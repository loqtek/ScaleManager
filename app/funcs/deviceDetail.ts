import { useState, useEffect } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Device, User } from "../types";
import { renameDevice, deleteDevice, addTags, changeUser } from "../api/devices";
import { getUsers } from "../api/users";
import { updateRoute } from "../api/routes";
import { getVersionInfo } from "../utils/deviceUtils";

export function useDeviceDetail(deviceData: string | undefined) {
  const [device, setDevice] = useState<Device | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [newTags, setNewTags] = useState("");

  useEffect(() => {
    if (deviceData) {
      try {
        const parsedDevice: Device = JSON.parse(deviceData);
        setDevice(parsedDevice);
        loadUsers();
      } catch (error) {
        console.error("Failed to parse device data:", error);
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Data Error",
          text2: "Failed to load device data",
        });
      }
    }
  }, [deviceData]);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      if (usersData?.users) {
        setUsers(usersData.users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleRename = async () => {
    if (!device || !tempValue.trim()) return;
    
    try {
      const versionInfo = await getVersionInfo();
      if (!versionInfo) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Configuration Error",
          text2: "Failed to get server configuration",
        });
        return;
      }

      const { isV026OrHigher } = versionInfo;
      const result = await renameDevice(isV026OrHigher ? device.id : device.name, tempValue.trim());
      
      if (result) {
        setDevice({ ...device, givenName: tempValue.trim() });
        setEditingField(null);
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ Device Renamed",
          text2: `Device renamed to "${tempValue.trim()}"`,
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Rename Failed",
          text2: "Failed to rename device",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Rename Error",
        text2: "An error occurred while renaming",
      });
    }
  };

  const handleChangeUser = async (newUser: string) => {
    if (!device) return;
    
    try {
      const versionInfo = await getVersionInfo();
      if (!versionInfo) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Configuration Error",
          text2: "Failed to get server configuration",
        });
        return;
      }
      
      const selectedUser = users.find(u => u.name === newUser);
      const result = await changeUser(device.name, selectedUser);
      
      if (result) {
        setDevice({ 
          ...device, 
          user: selectedUser || { ...device.user, name: newUser }
        });
        setShowUserModal(false);
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ User Changed",
          text2: `Device assigned to "${newUser}"`,
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Change Failed",
          text2: "Failed to change user",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Change Error",
        text2: "An error occurred while changing user",
      });
    }
  };

  const handleAddTags = async () => {
    if (!device || !newTags.trim()) return;

    const tagsArray = newTags.split(/[,\s]+/).map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
    
    if (tagsArray.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No Tags",
        text2: "Please enter at least one tag",
      });
      return;
    }

    try {
      const versionInfo = await getVersionInfo();
      if (!versionInfo) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Configuration Error",
          text2: "Failed to get server configuration",
        });
        return;
      }

      const { isV026OrHigher } = versionInfo;
      const result = await addTags(isV026OrHigher ? device.id : device.name, tagsArray);
      
      if (result) {
        setDevice({ 
          ...device, 
          validTags: [...new Set([...device.validTags, ...tagsArray])]
        });
        setShowTagsModal(false);
        setNewTags("");
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ Tags Added",
          text2: `Added ${tagsArray.length} tag(s)`,
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Add Failed",
          text2: "Failed to add tags",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Add Error",
        text2: "An error occurred while adding tags",
      });
    }
  };

  const handleApproveRoutes = async () => {
    if (!device || selectedRoutes.length === 0) return;

    try {
      const newApprovedRoutes = [...new Set([...device.approvedRoutes, ...selectedRoutes])];
      const result = await updateRoute(device.id, newApprovedRoutes);

      if (result) {
        setDevice({
          ...device,
          approvedRoutes: newApprovedRoutes,
          availableRoutes: device.availableRoutes.filter(
            route => !selectedRoutes.includes(route)
          ),
        });
        setSelectedRoutes([]);
        setShowRoutesModal(false);
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ Routes Updated",
          text2: `Approved ${selectedRoutes.length} route(s)`,
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Update Failed",
          text2: "Failed to approve routes",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Update Error",
        text2: "An error occurred while approving routes",
      });
    }
  };

  const handleRemoveRoute = async (route: string) => {
    if (!device) return;

    Alert.alert(
      "Remove Route",
      `Remove route "${route}" from approved routes?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const newApprovedRoutes = device.approvedRoutes.filter(r => r !== route);
              const result = await updateRoute(device.id, newApprovedRoutes);

              if (result) {
                setDevice({
                  ...device,
                  approvedRoutes: newApprovedRoutes,
                  availableRoutes: [...device.availableRoutes, route],
                });
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "✅ Route Removed",
                  text2: `Route "${route}" removed from approved`,
                });
              } else {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Update Failed",
                  text2: "Failed to remove route",
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Update Error",
                text2: "An error occurred while removing route",
              });
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    if (!device) return;
    
    Alert.alert(
      "Delete Device", 
      `Are you sure you want to delete "${device.givenName || device.name}"?\n\nThis action cannot be undone.`, 
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const versionInfo = await getVersionInfo();
              if (!versionInfo) {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Configuration Error",
                  text2: "Failed to get server configuration",
                });
                return;
              }

              const result = await deleteDevice(device.id);
              if (result) {
                Toast.show({
                  type: "success",
                  text1: "Device Deleted",
                  text2: "Device has been removed",
                });
                return true; // Signal successful deletion
              } else {
                Toast.show({
                  type: "error",
                  text1: "Delete Failed",
                  text2: "Failed to delete device",
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Delete Error",
                text2: "An error occurred while deleting",
              });
            }
          },
        },
      ]
    );
  };

  return {
    device,
    users,
    editingField,
    setEditingField,
    tempValue,
    setTempValue,
    showUserModal,
    setShowUserModal,
    showTagsModal,
    setShowTagsModal,
    showRoutesModal,
    setShowRoutesModal,
    selectedRoutes,
    setSelectedRoutes,
    newTags,
    setNewTags,
    handleRename,
    handleChangeUser,
    handleAddTags,
    handleApproveRoutes,
    handleRemoveRoute,
    handleDelete,
  };
}
