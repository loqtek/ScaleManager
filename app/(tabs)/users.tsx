import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUsers } from "@/app/funcs/users";

export default function UsersScreen() {
  const {
    users,
    loading,
    fetchUsers,
    handleAddUser,
    handleRenameUser,
    handleDeleteUser,
  } = useUsers();


  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading users...</Text>
        </View>
      ) : (
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchUsers} />
        }
      >
        <View className="mb-4 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={handleAddUser}
            className="bg-blue-600 py-2 px-4 rounded-xl"
          >
            <Text className="text-white font-bold">+ Add User</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={fetchUsers}>
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {users.length === 0 ? (
          <Text className="text-white text-center mt-4">No users found</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={index}
              className="bg-zinc-800 p-4 mb-4 rounded-lg border border-zinc-700"
            >
              <Text className="text-white text-xl font-semibold">
                {user.name || "No Name"}
              </Text>
              <Text className="text-white text-lg">ID: {user.id || "N/A"}</Text>
              <Text className="text-white text-lg">
                Created At: {new Date(user.createdAt).toLocaleString() || "N/A"}
              </Text>

              <View className="flex-row space-x-4 mt-4">
                <TouchableOpacity
                  onPress={() => handleRenameUser(user.name)}
                  className="bg-yellow-600 py-2 px-4 rounded-xl"
                >
                  <Text className="text-white text-center">Rename</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteUser(user.name)}
                  className="bg-red-600 py-2 px-4 rounded-xl ml-2"
                >
                  <Text className="text-white text-center">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
