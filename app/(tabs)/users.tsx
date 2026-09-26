import React from "react";
import {
  Text, View, ScrollView,
  TouchableOpacity, RefreshControl, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useUsers } from "@/app/funcs/users";
import { ScreenLoading } from "@/app/components/ScreenLoading";
import { useTheme } from "@/theme";

export default function UsersScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
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
          onPress: () => handleDeleteUser(user.name, user.id),
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
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
      {loading ? (
        <ScreenLoading label="Loading Users..." />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchUsers} tintColor={colors.primary} colors={[colors.primary]} />
          }
        >
          <View className="mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>Users</Text>
              <Text style={{ color: colors.textMuted }}>
                {users.length} {users.length === 1 ? 'user' : 'users'} total
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={fetchUsers} className="p-2" activeOpacity={0.7}>
                <MaterialIcons name="refresh" size={24} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddUser}
                activeOpacity={0.8}
                className="py-2 px-4 rounded-lg flex-row items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                <Text className="font-semibold ml-1" style={{ color: colors.onPrimary }}>Add User</Text>
              </TouchableOpacity>
            </View>
          </View>

          {users.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="people-outline" size={64} color={colors.muted} />
              <Text className="text-lg mt-4 text-center" style={{ color: colors.textMuted }}>
                No Users Found
              </Text>
              <Text className="text-center mt-2" style={{ color: colors.muted }}>
                Create your first user to get started
              </Text>
            </View>
          ) : (
            users.map((user) => {
              const deviceCount = getUserDeviceCount(user.id);

              return (
                <View
                  key={user.id}
                  className="rounded-xl p-4 mb-4 border"
                  style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
                        <MaterialIcons name="person" size={20} color={colors.onPrimary} />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-lg font-semibold" style={{ color: colors.text }}>
                          {user.name || "Unnamed User"}
                        </Text>
                        <Text className="text-sm" style={{ color: colors.textMuted }}>
                          ID: {user.id}
                        </Text>
                      </View>
                    </View>

                    <View className="px-3 py-1 rounded-full flex-row items-center" style={{ backgroundColor: colors.surfaceMuted }}>
                      <MaterialIcons name="devices" size={14} color={colors.primaryMuted} />
                      <Text className="text-sm font-semibold ml-1" style={{ color: colors.primaryMuted }}>
                        {deviceCount}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-4 space-y-2">
                    <View className="flex-row">
                      <Text className="flex-1" style={{ color: colors.textSecondary }}>
                        Created: {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
                      </Text>
                    </View>

                    {user.displayName && (
                      <View className="flex-row">
                        <Text className="w-20" style={{ color: colors.textMuted }}>Display:</Text>
                        <Text className="flex-1" style={{ color: colors.textSecondary }}>{user.displayName}</Text>
                      </View>
                    )}

                    {user.email && (
                      <View className="flex-row">
                        <Text className="w-20" style={{ color: colors.textMuted }}>Email:</Text>
                        <Text className="flex-1" style={{ color: colors.textSecondary }}>{user.email}</Text>
                      </View>
                    )}

                    {user.provider && (
                      <View className="flex-row">
                        <Text className="w-20" style={{ color: colors.textMuted }}>Provider:</Text>
                        <Text className="flex-1" style={{ color: colors.textSecondary }}>{user.provider}</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row space-x-3 ">
                    <TouchableOpacity
                      onPress={() => handleRenameUser(user.name, user.id)}
                      activeOpacity={0.8}
                      className="flex-1 py-2 rounded-lg flex-row items-center justify-center mr-2"
                      style={{ backgroundColor: colors.warning }}
                    >
                      <MaterialIcons name="edit" size={16} color={colors.background} />
                      <Text className="font-semibold ml-1" style={{ color: colors.background }}>Rename</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => confirmDelete(user)}
                      activeOpacity={0.8}
                      className="flex-1 py-2 rounded-lg flex-row items-center justify-center ml-2"
                      style={{ backgroundColor: colors.error }}
                    >
                      <MaterialIcons name="delete" size={16} color={colors.onPrimary} />
                      <Text className="font-semibold ml-1" style={{ color: colors.onPrimary }}>Delete</Text>
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
