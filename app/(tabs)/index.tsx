import React, { useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useDashboardData } from "@/app/funcs/tabsHome";

export default function IndexScreen() {
  const router = useRouter();
  const {
    devices,
    usersCount,
    fetchData,
    onlineDevices,
    offlineDevices,
    topActiveDevices,
    pingTime,
    loading,
    measurePing,
    handleSignOut
  } = useDashboardData();

  const onRefresh = async () => {
    await measurePing();
    await fetchData();
  };

  const handleAccounts = () => {
    router.push("/accounts");
  };
  const handleDiscord = async () => {
    const url = "https://discord.gg/UARvXnT2";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        "Unable to open Discord. Please visit: https://discord.gg/UARvXnT2",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    measurePing();
    fetchData();
  }, []);
  const handleGitHub = async () => {
    const url = "https://github.com/loqtek/ScaleManager/issues";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        "Unable to open GitHub. Please visit: https://github.com/loqtek/ScaleManager/issues",
        [{ text: "OK" }]
      );
    }
  };

  const handleStarRepo = async () => {
    const url = "https://github.com/loqtek/ScaleManager";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        "Unable to open GitHub. Please visit: https://github.com/loqtek/ScaleManager",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    measurePing();
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">Scale Manager</Text>
            <Text className="text-slate-400">Headscale Network Dashboard</Text>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={handleAccounts} className="p-2">
              <Ionicons name="person-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} className="p-2">
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Server Status Card */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-lg font-semibold">Server Status</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#10b981" className="mt-2" />
              ) : (
                <Text className="text-slate-300 mt-1">
                  {pingTime !== null ? `${pingTime}ms response time` : "No connection"}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={measurePing}
              className="bg-zinc-700 p-3 rounded-lg"
            >
              <MaterialIcons name="refresh" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview Stats */}
        <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-semibold">Network Overview</Text>
            <TouchableOpacity
              onPress={fetchData}
              className="bg-zinc-700 p-2 rounded-lg"
            >
              <MaterialIcons name="refresh" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] bg-zinc-700 p-3 rounded-lg mb-2">
              <View className="flex-row items-center">
                <FontAwesome name="users" size={16} color="#60a5fa" />
                <Text className="text-slate-400 text-sm ml-2">Users</Text>
              </View>
              <Text className="text-white text-xl font-bold mt-1">{usersCount}</Text>
            </View>

            <View className="w-[48%] bg-zinc-700 p-3 rounded-lg mb-2">
              <View className="flex-row items-center">
                <MaterialIcons name="wifi" size={16} color="#10b981" />
                <Text className="text-slate-400 text-sm ml-2">Online</Text>
              </View>
              <Text className="text-white text-xl font-bold mt-1">{onlineDevices.length}</Text>
            </View>

            <View className="w-[48%] bg-zinc-700 p-3 rounded-lg">
              <View className="flex-row items-center">
                <MaterialIcons name="wifi-off" size={16} color="#f87171" />
                <Text className="text-slate-400 text-sm ml-2">Offline</Text>
              </View>
              <Text className="text-white text-xl font-bold mt-1">{offlineDevices.length}</Text>
            </View>

            <View className="w-[48%] bg-zinc-700 p-3 rounded-lg">
              <View className="flex-row items-center">
                <Ionicons name="server" size={16} color="#60a5fa" />
                <Text className="text-slate-400 text-sm ml-2">Total</Text>
              </View>
              <Text className="text-white text-xl font-bold mt-1">{devices.length}</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        {topActiveDevices.length > 0 && (
          <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
            <Text className="text-white text-lg font-semibold mb-3">Recent Activity</Text>
            {topActiveDevices.map((device) => (
              <View key={device.id} className="flex-row items-center py-2 border-b border-zinc-700 last:border-b-0">
                <MaterialIcons name="devices" size={16} color="#60a5fa" />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium">
                    {device.givenName || device.name}
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    {new Date(device.lastSeen).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View className="mb-2">
          <Text className="text-white text-lg font-semibold mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              { label: "Users", route: "/(tabs)/users", icon: "people" },
              { label: "Devices", route: "/(tabs)/devices", icon: "devices" },
              { label: "Auth Keys", route: "/(tabs)/preauthkeys", icon: "vpn-key" },
              { label: "API Keys", route: "/(tabs)/apikeys", icon: "key" },
            ].map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.replace(item.route)}
                className="bg-zinc-800 w-[48%] p-4 rounded-xl mb-3 border border-zinc-700 flex-row items-center"
              >
                <MaterialIcons name={item.icon} size={20} color="#60a5fa" />
                <Text className="text-white font-semibold ml-3">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* GitHub Footer Section */}
        <View className="pt-8 pb-4">
          <View className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <View className="items-center mb-4">
              <FontAwesome name="github" size={32} color="#60a5fa" />
              <Text className="text-white text-lg font-bold">
                Help Improve Scale Manager
              </Text>
            </View>

            <Text className="text-slate-300 text-center mb-6 leading-6">
              Found a bug or have a feature idea? We'd love to hear from you!
              Your feedback helps make this app better for everyone.
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleGitHub}
                className="bg-blue-600 py-3 px-4 rounded-lg flex-row items-center justify-center mb-4"
                activeOpacity={0.8}
              >
                <MaterialIcons name="bug-report" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Report Issues & Suggestions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStarRepo}
                className="bg-zinc-700 py-3 px-4 rounded-lg flex-row items-center justify-center border border-zinc-600 mb-4"
                activeOpacity={0.8}
              >
                <FontAwesome name="star" size={16} color="#fbbf24" />
                <Text className="text-slate-200 font-semibold ml-2">
                  Star on GitHub
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDiscord}
                className="bg-zinc-700 py-3 px-4 rounded-lg flex-row items-center justify-center border border-zinc-600"
                activeOpacity={0.8}
              >
                <FontAwesome name="inbox" size={16} color="#7289DA" />
                <Text className="text-slate-200 font-semibold ml-2">
                  Join Our Discord
                </Text>
              </TouchableOpacity>

            </View>

            <Text className="text-slate-400 text-xs text-center mt-4">
              github.com/loqtek/ScaleManager
            </Text>
            <Text className="text-slate-400 text-xs text-center mt-1">
              discord.gg/UARvXnT2
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}