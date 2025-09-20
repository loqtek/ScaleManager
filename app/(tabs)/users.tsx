import React from "react";
import {
  Text, View, SafeAreaView, ScrollView, ActivityIndicator, 
  TouchableOpacity, RefreshControl, Alert
} from "react-native";
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
    getUserDeviceCount,
  } = useUsers();

  const confirmDelete = (user: any) => {
    const deviceCount = getUserDeviceCount(user.id);
    
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete "${user.name}"?\n\n` +
      `This user has ${deviceCount} device(s). Deleting this user will also affect their devices.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete User",
          style: "destructive",
          onPress: () => handleDeleteUser(user.name),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading Users...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchUsers} />
          }
        >
          {/* Header */}
          <View className="mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Users</Text>
              <Text className="text-slate-400">
                {users.length} {users.length === 1 ? 'user' : 'users'} total
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={fetchUsers} className="p-2">
                <MaterialIcons name="refresh" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAddUser}
                className="bg-blue-600 py-2 px-4 rounded-lg flex-row items-center"
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-white font-semibold ml-1">Add User</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Users List */}
          {users.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="people-outline" size={64} color="#6b7280" />
              <Text className="text-slate-400 text-lg mt-4 text-center">
                No Users Found
              </Text>
              <Text className="text-slate-500 text-center mt-2">
                Create your first user to get started
              </Text>
            </View>
          ) : (
            users.map((user) => {
              const deviceCount = getUserDeviceCount(user.id);
              
              return (
                <View
                  key={user.id}
                  className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700"
                >
                  {/* User Header */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center">
                        <MaterialIcons name="person" size={20} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-white text-lg font-semibold">
                          {user.name || "Unnamed User"}
                        </Text>
                        <Text className="text-slate-400 text-sm">
                          ID: {user.id}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Device Count Badge */}
                    <View className="bg-zinc-700 px-3 py-1 rounded-full flex-row items-center">
                      <MaterialIcons name="devices" size={14} color="#60a5fa" />
                      <Text className="text-blue-400 text-sm font-semibold ml-1">
                        {deviceCount}
                      </Text>
                    </View>
                  </View>

                  {/* User Details */}
                  <View className="mb-4 space-y-2">
                    <View className="flex-row">
                      <Text className="text-slate-300 flex-1">
                        Created: {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
                      </Text>
                    </View>
                    
                    {user.displayName && (
                      <View className="flex-row">
                        <Text className="text-slate-400 w-20">Display:</Text>
                        <Text className="text-slate-300 flex-1">{user.displayName}</Text>
                      </View>
                    )}
                    
                    {user.email && (
                      <View className="flex-row">
                        <Text className="text-slate-400 w-20">Email:</Text>
                        <Text className="text-slate-300 flex-1">{user.email}</Text>
                      </View>
                    )}
                    
                    {user.provider && (
                      <View className="flex-row">
                        <Text className="text-slate-400 w-20">Provider:</Text>
                        <Text className="text-slate-300 flex-1">{user.provider}</Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row space-x-3 ">
                    <TouchableOpacity
                      onPress={() => handleRenameUser(user.name)}
                      className="flex-1 bg-yellow-600 py-2 rounded-lg flex-row items-center justify-center"
                    >
                      <MaterialIcons name="edit" size={16} color="white" />
                      <Text className="text-white font-semibold ml-1">Rename</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => confirmDelete(user)}
                      className="flex-1 bg-red-600 py-2  rounded-lg flex-row items-center justify-center"
                    >
                      <MaterialIcons name="delete" size={16} color="white" />
                      <Text className="text-white font-semibold ml-1">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}