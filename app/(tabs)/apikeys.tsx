import React, { useEffect } from "react";
import {
  Text, View, SafeAreaView, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApiKeys } from "@/app/funcs/apikeys";

export default function apiKeysScreen() {
  const {
    apiKeys,
    newKeyExpire,
    setNewKeyExpire,
    activeKeyExpire,
    loading,
    fetchApiKeys,
    handleCreateKey,
    handleExpireKey,
    isExpired,
  } = useApiKeys();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-900 px-4 pt-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading API Keys...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchApiKeys} />
          }
        >
          <View className="mb-4 flex-row justify-between items-center">
            <Text className="text-white text-xl">Active Key Expiration</Text>
            <TouchableOpacity onPress={fetchApiKeys}>
              <MaterialIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-white">
              Active Key Expires On: {activeKeyExpire}
            </Text>
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Expire Time (e.g. 24h, 7d)"
              value={newKeyExpire}
              onChangeText={setNewKeyExpire}
              className="bg-zinc-600 text-white p-2 rounded-md"
            />
            <TouchableOpacity
              onPress={handleCreateKey}
              className="bg-green-600 p-3 rounded-md mt-2"
            >
              <Text className="text-white text-center font-bold">Create New Key</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-white text-xl">API Keys</Text>
          {apiKeys.length === 0 ? (
            <Text className="text-white">No API keys found</Text>
          ) : (
            apiKeys.map((key) => (
              <View key={key.id} className="bg-zinc-800 p-4 rounded-xl mb-4">
                <Text className="text-white">Key Prefix: {key.prefix}</Text>
                <Text className="text-white">
                  Created At: {new Date(key.createdAt).toLocaleString()}
                </Text>
                <Text className="text-white">
                  Expiration: {new Date(key.expiration).toLocaleString()}
                </Text>

                <TouchableOpacity
                  onPress={() => handleExpireKey(key.prefix)}
                  disabled={isExpired(key.expiration)}
                  className={`p-2 rounded-md mt-2 ${
                    isExpired(key.expiration) ? "bg-zinc-500" : "bg-red-600"
                  }`}
                >
                  <Text className="text-white text-center">
                    {isExpired(key.expiration) ? "Expired" : "Expire Key"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
