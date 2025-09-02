import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDevices } from "@/app/funcs/devices";


export default function DevicesScreen() {
  const { devices, loading, fetchDevices, handleRegisterDevice, handleDevicePress, router } = useDevices();

  const onRefresh = () => {
    fetchDevices();
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {/* Show loading spinner while data is being fetched */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading Devices...</Text>
        </View>
      ) : (

        <ScrollView className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          <View className="mb-4 flex-row justify-between items-center">
            <TouchableOpacity
              onPress={handleRegisterDevice}
              className="bg-blue-600 py-2 px-4 rounded-xl"
            >
              <Text className="text-white font-bold">+ Register Device</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={fetchDevices}>
              <MaterialIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {devices.map((device) => (
            <TouchableOpacity key={device.id} onPress={() => handleDevicePress(device)}>
              <View className="bg-zinc-800 p-4 mb-2 rounded-xl border border-zinc-700">
                <Text className="text-white text-lg font-semibold">
                  {device.givenName || device.name}
                </Text>
                <Text className="text-zinc-400">
                  IP: {device.ipAddresses?.[0] || "N/A"}
                </Text>
                <Text className={`mt-1 ${device.online ? "text-green-400" : "text-red-400"}`}>
                  {device.online ? "Online" : "Offline"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
