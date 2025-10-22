import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { getUsers, addUser, deleteUser, renameUser } from "../api/users";
import { getDevices } from "../api/devices";
import { getApiEndpoints } from "../utils/apiUtils";

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
            const trimmed = userName?.trim();

            // Reject empty input
            if (!trimmed) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Invalid Input",
                text2: "Please enter a valid user name",
              });
              return;
            }

            // Regex: allow only letters, numbers, underscores, and hyphens
            const validNameRegex = /^[a-zA-Z0-9_-]+$/;

            if (!validNameRegex.test(trimmed)) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Invalid Characters",
                text2: "User name cannot contain spaces or special characters (!@#$%).",
              });
              return;
            }

            try {
              const response = await addUser(trimmed);
              if (response) {
                await fetchUsers(); // refresh list
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "✅ User Added",
                  text2: `User "${trimmed}" added successfully!`,
                });
              } else {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Add Failed",
                  text2: `Failed to add user "${trimmed}".`,
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Add Failed",
                text2: "An error occurred while adding the user.",
              });
              console.error(error)
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleRenameUser = (name: string, id: number) => {
    Alert.prompt(
      "Rename User",
      `Enter the new name for "${name}":`,
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

            if (newName.trim() === name) {
              Toast.show({
                type: "info",
                position: "top",
                text1: "No Changes",
                text2: "The new name is the same as the current name",
              });
              return;
            }

            try {
              // Check server version to determine whether to use name or ID
              const config = await getApiEndpoints();
              if (!config) {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Configuration Error",
                  text2: "Failed to get server configuration",
                });
                return;
              }

              const { serverConf } = config;
              const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
              const isV026OrHigher = versionKey >= 'v0.26';
              
              // Use user ID for v0.26+ or name for older versions
              const response = await renameUser(isV026OrHigher ? id : name, newName.trim());
              if (response) {
                // Update local state immediately for better UX
                setUsers((prev) =>
                  prev.map((user) =>
                    user.id === id ? { ...user, name: newName.trim() } : user
                  )
                );

                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "✅ User Renamed",
                  text2: `"${name}" renamed to "${newName}"`,
                });
              } else {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "⚠️ Rename Failed",
                  text2: `Failed to rename user "${name}".`,
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Rename Failed",
                text2: "An error occurred while renaming the user.",
              });
              console.error(error)
            }
          },
        },
      ],
      "plain-text",
      name
    );
  };

  const handleDeleteUser = async (userName: string, userId: number) => {
    try {
      // Check server version to determine whether to use name or ID
      const config = await getApiEndpoints();
      if (!config) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Configuration Error",
          text2: "Failed to get server configuration",
        });
        return;
      }

      const { serverConf } = config;
      const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
      const isV026OrHigher = versionKey >= 'v0.26';
      
      // Use user ID for v0.26+ or name for older versions
      const response = await deleteUser(isV026OrHigher ? userId : userName);
      if (response) {
        // Remove from local state immediately
        setUsers((prev) => prev.filter((user) => user.id !== userId));

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
      console.error(error)
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