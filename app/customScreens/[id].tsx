import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, 
  ScrollView, Clipboard, Modal 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import { renameDevice, deleteDevice, addTags, changeUser } from "../api/devices";
import { getUsers } from "../api/users";
import { updateRoute } from "../api/routes";

interface Device {
  id: string;
  machineKey: string;
  nodeKey: string;
  discoKey: string;
  ipAddresses: string[];
  name: string;
  user: {
    id: string;
    name: string;
    createdAt: string;
    displayName?: string;
    email?: string;
    provider?: string;
  };
  lastSeen: string;
  expiry: string | null;
  preAuthKey?: {
    user: any;
    id: string;
    key: string;
    reusable: boolean;
    ephemeral: boolean;
    used: boolean;
    expiration: string;
    createdAt: string;
    aclTags: string[];
  } | null;
  createdAt: string;
  registerMethod: string;
  forcedTags: string[];
  invalidTags: string[];
  validTags: string[];
  givenName: string;
  online: boolean;
  approvedRoutes: string[];
  availableRoutes: string[];
  subnetRoutes: string[];
}

export default function DeviceDetailScreen() {
  const { device: deviceData } = useLocalSearchParams<{ device: string }>();
  
  const [device, setDevice] = useState<Device | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [newTags, setNewTags] = useState("");
  
  const router = useRouter();

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

  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "Never";
    }
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setString(text);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Copied!",
        text2: `${label} copied to clipboard`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Copy Failed",
        text2: "Could not copy to clipboard",
      });
    }
  };

  const handleRename = async () => {
    if (!device || !tempValue.trim()) return;
    
    try {
      const result = await renameDevice(device.id, tempValue.trim());
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
      const result = await changeUser(device.id, newUser);
      if (result) {
        const selectedUser = users.find(u => u.name === newUser);
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
      const result = await addTags(device.id, tagsArray);
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
              const result = await deleteDevice(device.id);
              if (result) {
                Toast.show({
                  type: "success",
                  text1: "Device Deleted",
                  text2: "Device has been removed",
                });
                router.push("/(tabs)/devices");
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

  if (!device) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
        <MaterialIcons name="devices-other" size={64} color="#6b7280" />
        <Text className="text-white mt-4">Loading device details...</Text>
      </SafeAreaView>
    );
  }

  const InfoRow = ({ label, value, copyable = false, onEdit }: {
    label: string;
    value: string;
    copyable?: boolean;
    onEdit?: () => void;
  }) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-slate-400 text-sm font-medium">{label}:</Text>
        <View className="flex-row space-x-2">
          {copyable && (
            <TouchableOpacity onPress={() => copyToClipboard(value, label)}>
              <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <MaterialIcons name="edit" size={16} color="#60a5fa" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="bg-zinc-700 p-3 rounded-lg">
        <Text className="text-white font-mono text-sm" selectable>
          {value || "N/A"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/devices")}
            className="flex-row items-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">Back</Text>
          </TouchableOpacity>
          
          <View className={`px-3 py-1 rounded-full ${
            device.online ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Text className={`text-sm font-semibold ${
              device.online ? 'text-green-400' : 'text-red-400'
            }`}>
              {device.online ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        {/* Device Title */}
        <View className="mb-6 items-center">
          <Text className="text-white text-2xl font-bold">
            {device.givenName || device.name}
          </Text>
          <Text className="text-slate-400">
            {device.user?.name} • {device.ipAddresses?.[0]}
          </Text>
        </View>

        {/* Basic Information */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
          <Text className="text-white text-lg font-semibold mb-4">Basic Information</Text>
          
          {editingField === "name" ? (
            <View className="mb-4">
              <Text className="text-slate-400 text-sm font-medium mb-1">Device Name:</Text>
              <View className="flex-row space-x-2">
                <TextInput
                  className="flex-1 bg-zinc-700 text-white p-3 rounded-lg"
                  value={tempValue}
                  onChangeText={setTempValue}
                  placeholder="Enter device name"
                  placeholderTextColor="#94a3b8"
                  autoFocus
                />
                <TouchableOpacity onPress={handleRename} className="bg-green-600 px-4 py-3 rounded-lg">
                  <MaterialIcons name="check" size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingField(null)} className="bg-gray-600 px-4 py-3 rounded-lg">
                  <MaterialIcons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <InfoRow 
              label="Device Name" 
              value={device.givenName || device.name}
              onEdit={() => {
                setTempValue(device.givenName || device.name);
                setEditingField("name");
              }}
            />
          )}
          
          <InfoRow label="Device ID" value={device.id} copyable />
          <InfoRow label="IP Address" value={device.ipAddresses?.join(", ") || "N/A"} copyable />
          <InfoRow label="Last Seen" value={`${formatDate(device.lastSeen)} (${getTimeAgo(device.lastSeen)})`} />
          <InfoRow label="Created" value={formatDate(device.createdAt)} />
          <InfoRow label="Registration Method" value={device.registerMethod.replace('REGISTER_METHOD_', '').replace('_', ' ')} />
          {device.expiry && device.expiry !== "0001-01-01T00:00:00Z" && (
            <InfoRow label="Expires" value={formatDate(device.expiry)} />
          )}
        </View>

        {/* User Information */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">User Assignment</Text>
            <TouchableOpacity onPress={() => setShowUserModal(true)} className="bg-blue-600 px-3 py-1 rounded">
              <Text className="text-white text-sm">Change</Text>
            </TouchableOpacity>
          </View>
          
          <InfoRow label="User Name" value={device.user?.name || "Unknown"} />
          <InfoRow label="User ID" value={device.user?.id || "N/A"} />
          {device.user?.displayName && (
            <InfoRow label="Display Name" value={device.user.displayName} />
          )}
          {device.user?.email && (
            <InfoRow label="Email" value={device.user.email} />
          )}
        </View>

        {/* Network Keys */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
          <Text className="text-white text-lg font-semibold mb-4">Network Keys</Text>
          <InfoRow label="Machine Key" value={device.machineKey} copyable />
          <InfoRow label="Node Key" value={device.nodeKey} copyable />
          <InfoRow label="Disco Key" value={device.discoKey} copyable />
        </View>

        {/* Routes */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Route Management</Text>
            {device.availableRoutes?.length > 0 && (
              <TouchableOpacity onPress={() => setShowRoutesModal(true)} className="bg-green-600 px-3 py-1 rounded">
                <Text className="text-white text-sm">Approve Routes</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Approved Routes */}
          {device.approvedRoutes?.length > 0 && (
            <View className="mb-4">
              <Text className="text-slate-400 text-sm font-medium mb-2">Approved Routes:</Text>
              <View className="bg-zinc-700 rounded-lg p-3">
                {device.approvedRoutes.map((route, index) => (
                  <View key={index} className="flex-row justify-between items-center py-1">
                    <Text className="text-green-400 font-mono text-sm flex-1">{route}</Text>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                        <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleRemoveRoute(route)}>
                        <MaterialIcons name="close" size={16} color="#f87171" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Available Routes */}
          {device.availableRoutes?.length > 0 && (
            <View className="mb-4">
              <Text className="text-slate-400 text-sm font-medium mb-2">Available Routes:</Text>
              <View className="bg-zinc-700 rounded-lg p-3">
                {device.availableRoutes.map((route, index) => (
                  <View key={index} className="flex-row justify-between items-center py-1">
                    <Text className="text-yellow-400 font-mono text-sm flex-1">{route}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                      <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <Text className="text-slate-500 text-xs mt-2">
                Tap "Approve Routes" to move available routes to approved routes
              </Text>
            </View>
          )}

          {/* Subnet Routes */}
          {device.subnetRoutes?.length > 0 && (
            <View>
              <Text className="text-slate-400 text-sm font-medium mb-2">Subnet Routes:</Text>
              <View className="bg-zinc-700 rounded-lg p-3">
                {device.subnetRoutes.map((route, index) => (
                  <View key={index} className="flex-row justify-between items-center py-1">
                    <Text className="text-blue-400 font-mono text-sm flex-1">{route}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                      <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {(!device.approvedRoutes?.length && !device.availableRoutes?.length && !device.subnetRoutes?.length) && (
            <Text className="text-slate-400 text-center py-4">No routes configured</Text>
          )}
        </View>

        {/* Tags */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Tags</Text>
            <TouchableOpacity onPress={() => setShowTagsModal(true)} className="bg-yellow-600 px-3 py-1 rounded">
              <Text className="text-white text-sm">Add</Text>
            </TouchableOpacity>
          </View>
          
          {device.validTags?.length > 0 && (
            <InfoRow label="Valid Tags" value={device.validTags.join(", ")} />
          )}
          {device.forcedTags?.length > 0 && (
            <InfoRow label="Forced Tags" value={device.forcedTags.join(", ")} />
          )}
          {device.invalidTags?.length > 0 && (
            <InfoRow label="Invalid Tags" value={device.invalidTags.join(", ")} />
          )}
          
          {(!device.validTags?.length && !device.forcedTags?.length && !device.invalidTags?.length) && (
            <Text className="text-slate-400 text-center py-4">No tags assigned</Text>
          )}
        </View>

        {/* Pre-Auth Key Info */}
        {device.preAuthKey && (
          <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
            <Text className="text-white text-lg font-semibold mb-4">Pre-Auth Key</Text>
            <InfoRow label="Key ID" value={device.preAuthKey.id} />
            <InfoRow label="Key" value={device.preAuthKey.key} copyable />
            <InfoRow label="Reusable" value={device.preAuthKey.reusable ? "Yes" : "No"} />
            <InfoRow label="Used" value={device.preAuthKey.used ? "Yes" : "No"} />
            <InfoRow label="Created" value={formatDate(device.preAuthKey.createdAt)} />
            <InfoRow label="Expires" value={formatDate(device.preAuthKey.expiration)} />
          </View>
        )}

        {/* Actions */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
          <Text className="text-white text-lg font-semibold mb-4">Actions</Text>
          <TouchableOpacity 
            className="bg-red-600 py-3 rounded-lg flex-row items-center justify-center"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Delete Device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* User Selection Modal */}
      <Modal visible={showUserModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-zinc-800 rounded-xl p-4 w-4/5 max-h-96">
            <Text className="text-white text-lg font-semibold mb-4">Select User</Text>
            <ScrollView>
              {users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  onPress={() => handleChangeUser(user.name)}
                  className="py-3 border-b border-zinc-700"
                >
                  <Text className="text-white">{user.name}</Text>
                  {user.displayName && (
                    <Text className="text-slate-400 text-sm">{user.displayName}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowUserModal(false)}
              className="bg-gray-600 py-2 rounded mt-4"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tags Modal */}
      <Modal visible={showTagsModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-zinc-800 rounded-xl p-4 w-4/5">
            <Text className="text-white text-lg font-semibold mb-4">Add Tags</Text>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-lg mb-4"
              value={newTags}
              onChangeText={setNewTags}
              placeholder="Enter tags separated by commas or spaces"
              placeholderTextColor="#94a3b8"
              multiline
            />
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleAddTags}
                className="flex-1 bg-yellow-600 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold text-center">Add Tags</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowTagsModal(false);
                  setNewTags("");
                }}
                className="flex-1 bg-gray-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Routes Approval Modal */}
      <Modal visible={showRoutesModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-zinc-800 rounded-xl p-4 w-4/5 max-h-120">
            <Text className="text-white text-lg font-semibold mb-4">Approve Routes</Text>
            <Text className="text-slate-400 text-sm mb-4">
              Select routes to approve from available routes:
            </Text>
            
            <ScrollView className="mb-4">
              {device?.availableRoutes?.map((route, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (selectedRoutes.includes(route)) {
                      setSelectedRoutes(selectedRoutes.filter(r => r !== route));
                    } else {
                      setSelectedRoutes([...selectedRoutes, route]);
                    }
                  }}
                  className={`flex-row items-center justify-between py-3 px-3 mb-2 rounded-lg ${
                    selectedRoutes.includes(route) ? 'bg-green-600/20 border border-green-500' : 'bg-zinc-700'
                  }`}
                >
                  <Text className={`font-mono text-sm flex-1 ${
                    selectedRoutes.includes(route) ? 'text-green-400' : 'text-white'
                  }`}>
                    {route}
                  </Text>
                  <MaterialIcons 
                    name={selectedRoutes.includes(route) ? "check-box" : "check-box-outline-blank"} 
                    size={20} 
                    color={selectedRoutes.includes(route) ? "#10b981" : "#6b7280"} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedRoutes.length > 0 && (
              <View className="bg-zinc-700 p-3 rounded-lg mb-4">
                <Text className="text-slate-400 text-sm mb-1">Selected routes ({selectedRoutes.length}):</Text>
                <Text className="text-green-400 text-sm font-mono">
                  {selectedRoutes.join(", ")}
                </Text>
              </View>
            )}
            
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handleApproveRoutes}
                disabled={selectedRoutes.length === 0}
                className={`flex-1 py-3 rounded-lg mx-2 ${
                  selectedRoutes.length > 0 ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <Text className="text-white font-semibold text-center">
                  Approve {selectedRoutes.length > 0 ? `(${selectedRoutes.length})` : ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowRoutesModal(false);
                  setSelectedRoutes([]);
                }}
                className="flex-1 bg-gray-600 py-3 rounded-lg mx-2"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}