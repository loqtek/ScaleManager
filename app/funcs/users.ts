import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { getUsers, addUser, deleteUser, renameUser } from "../api/users";
import { getDevices } from "../api/devices";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      // Fetch both users and devices for complete data
      const [usersData, devicesData] = await Promise.all([
        getUsers(),
        getDevices()
      ]);

      if (usersData?.users) {
        setUsers(usersData.users);
      }

      if (devicesData?.nodes) {
        setDevices(devicesData.nodes);
      } else if (devicesData && Array.isArray(devicesData)) {
        setDevices(devicesData);
      }
    } catch (error) {
      console.error("Error fetching users/devices:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Fetch Error",
        text2: "Failed to load users data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to count devices for a specific user
  const getUserDeviceCount = (userId: string | number): number => {
    return devices.filter(device => {
      // Handle both string and numeric user IDs
      const deviceUserId = device.user?.id?.toString();
      const searchUserId = userId?.toString();
      return deviceUserId === searchUserId;
    }).length;
  };

  // Function to get devices for a specific user
  const getUserDevices = (userId: string | number) => {
    return devices.filter(device => {
      const deviceUserId = device.user?.id?.toString();
      const searchUserId = userId?.toString();
      return deviceUserId === searchUserId;
    });
  };

  const handleAddUser = () => {
    Alert.prompt(
      "Add User",
      "Enter the name for the new user:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: async (userName: string | undefined) => {
            if (!userName?.trim()) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Invalid Input",
                text2: "Please enter a valid user name",
              });
              return;
            }

            try {
              const response = await addUser(userName.trim());
              if (response) {
                // Refresh the entire users list to get accurate data
                await fetchUsers();
                
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "✅ User Added",
                  text2: `User "${userName}" added successfully!`,
                });
              } else {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Add Failed",
                  text2: `Failed to add user "${userName}".`,
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Add Failed",
                text2: "An error occurred while adding the user.",
              });
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleRenameUser = (oldName: string) => {
    Alert.prompt(
      "Rename User",
      `Enter the new name for "${oldName}":`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rename",
          onPress: async (newName: string | undefined) => {
            if (!newName?.trim()) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Invalid Input",
                text2: "Please enter a valid user name",
              });
              return;
            }

            if (newName.trim() === oldName) {
              Toast.show({
                type: "info",
                position: "top",
                text1: "No Changes",
                text2: "The new name is the same as the current name",
              });
              return;
            }

            try {
              const response = await renameUser(oldName, newName.trim());
              if (response) {
                // Update local state immediately for better UX
                setUsers((prev) =>
                  prev.map((user) =>
                    user.name === oldName ? { ...user, name: newName.trim() } : user
                  )
                );

                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "✅ User Renamed",
                  text2: `"${oldName}" renamed to "${newName}"`,
                });
              } else {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Rename Failed",
                  text2: `Failed to rename user "${oldName}".`,
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Rename Failed",
                text2: "An error occurred while renaming the user.",
              });
            }
          },
        },
      ],
      "plain-text",
      oldName
    );
  };

  const handleDeleteUser = async (userName: string) => {
    try {
      const response = await deleteUser(userName);
      if (response) {
        // Remove from local state immediately
        setUsers((prev) => prev.filter((user) => user.name !== userName));
        
        // Also refresh to ensure data consistency
        await fetchUsers();

        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ User Deleted",
          text2: `User "${userName}" deleted successfully!`,
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Delete Failed",
          text2: `Failed to delete user "${userName}".`,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Delete Failed",
        text2: "An error occurred while deleting the user.",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    devices,
    loading,
    fetchUsers,
    handleAddUser,
    handleRenameUser,
    handleDeleteUser,
    getUserDeviceCount,
    getUserDevices,
  };
}