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
    <SafeAreaView className="flex-1 bg-zinc-900 px-4 pt-4">
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="absolute top-2 right-2 flex-row space-x-4">
          <TouchableOpacity onPress={handleAccounts} className="p-1">
            <Ionicons name="person-circle" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut} className="p-1">
            <MaterialIcons name="logout" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <Text className="text-white text-2xl font-bold mb-2">Server Status</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View className="flex-row items-center space-x-2">
              <Text className="text-white text-lg font-semibold mr-2">
                {pingTime !== null ? `Ping: ${pingTime} ms` : "No data"}
              </Text>
              <TouchableOpacity onPress={measurePing}>
                <MaterialIcons name="refresh" size={23} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="pt-8 space-y-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-bold">Overview</Text>
            <TouchableOpacity onPress={fetchData}>
              <MaterialIcons name="refresh" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center space-x-2">
            <FontAwesome name="users" size={18} color="white" />
            <Text className="text-white ml-2">Users: {usersCount}</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <MaterialIcons name="wifi" size={18} color="lightgreen" />
            <Text className="text-white ml-2">Online Devices: {onlineDevices.length}</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <MaterialIcons name="wifi-off" size={18} color="tomato" />
            <Text className="text-white ml-2">Offline Devices: {offlineDevices.length}</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <Ionicons name="server" size={18} color="deepskyblue" />
            <Text className="text-white ml-2">Total Devices: {devices.length}</Text>
          </View>

          <Text className="text-white text-lg font-semibold pt-4">
            Most Recently Active Devices:
          </Text>
          {topActiveDevices.map((device) => (
            <View key={device.id} className="flex-row items-center ml-2 space-x-2">
              <FontAwesome name="clock-o" size={16} color="white" />
              <Text className="text-white ml-2">
                {device.givenName || device.name} ({new Date(device.lastSeen).toLocaleString()})
              </Text>
            </View>
          ))}
        </View>

        <View className="pt-8">
          <View className="flex-row flex-wrap justify-between">
            {[
              { label: "Users", route: "/(tabs)/users" },
              { label: "Devices", route: "/(tabs)/devices" },
              { label: "Auth Keys", route: "/(tabs)/preauthkeys" },
              { label: "API Keys", route: "/(tabs)/apikeys" },
            ].map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.replace(item.route)}
                className="bg-zinc-800 w-[48%] p-4 rounded-xl mb-3"
              >
                <Text className="text-white text-center text-lg font-bold">
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
              <Text className="text-white text-lg font-bold mt-2">
                Help Improve Scale Manager
              </Text>
            </View>
            
            <Text className="text-slate-300 text-center mb-6 leading-6">
              Found a bug or have a feature idea? We'd love to hear from you! 
              Your feedback helps make this app better for everyone.
            </Text>
            
            <View className="space-y-2">
              <TouchableOpacity
                onPress={handleGitHub}
                className="bg-blue-600 py-3 px-4 rounded-lg flex-row items-center justify-center mb-2"
                activeOpacity={0.8}
              >
                <MaterialIcons name="bug-report" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Report Issues & Suggestions
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleStarRepo}
                className="bg-zinc-700 py-3 px-4 rounded-lg flex-row items-center justify-center border border-zinc-600"
                activeOpacity={0.8}
              >
                <FontAwesome name="star" size={16} color="#fbbf24" />
                <Text className="text-slate-200 font-semibold ml-2">
                  Star on GitHub
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text className="text-slate-400 text-xs text-center mt-4">
              github.com/loqtek/ScaleManager
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}