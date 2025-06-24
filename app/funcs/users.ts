import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { getUsers, addUser, deleteUser, renameUser } from "../api/users";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    
    const data = await getUsers();
    if (data?.users) {
      setUsers(data.users);
    }
    setLoading(false);
  };

  const handleAddUser = () => {
    Alert.prompt(
      "Add User",
      "Enter the name for the new user:",
      [
        { text: "Cancel" },
        {
          text: "Add",
          onPress: async (userName: string) => {
            if (userName) {
              const response = await addUser(userName);
              if (response) {
                setUsers((prev) => [...prev, { name: userName, id: Date.now() }]);
                Toast.show({
                  type: "success",
                  text1: "✅ User Added",
                  text2: `User "${userName}" added successfully!`,
                });
              } else {
                Toast.show({
                  type: "error",
                  text1: "⚠️ Add Failed",
                  text2: `Failed to add user "${userName}".`,
                });
              }
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
      "Enter the new name for the user:",
      [
        { text: "Cancel" },
        {
          text: "Rename",
          onPress: async (newName: string) => {
            if (newName) {
              const response = await renameUser(oldName, newName);
              if (response) {
                setUsers((prev) =>
                  prev.map((user) =>
                    user.name === oldName ? { ...user, name: newName } : user
                  )
                );
                Toast.show({
                  type: "success",
                  text1: "✅ User Renamed",
                  text2: `User "${oldName}" renamed to "${newName}" successfully!`,
                });
              } else {
                Toast.show({
                  type: "error",
                  text1: "⚠️ Rename Failed",
                  text2: `Failed to rename user "${oldName}".`,
                });
              }
            }
          },
        },
      ],
      "plain-text",
      oldName
    );
  };

  const handleDeleteUser = (userName: string) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete user "${userName}"?`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const response = await deleteUser(userName);
            if (response) {
              setUsers((prev) => prev.filter((user) => user.name !== userName));
              Toast.show({
                type: "success",
                text1: "✅ User Deleted",
                text2: `User "${userName}" deleted successfully!`,
              });
            } else {
              Toast.show({
                type: "error",
                text1: "⚠️ Delete Failed",
                text2: `Failed to delete user "${userName}".`,
              });
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    handleAddUser,
    handleRenameUser,
    handleDeleteUser,
  };
}
