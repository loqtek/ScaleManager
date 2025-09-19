import { useState } from "react";
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Switch, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { usePreAuthManager } from "@/app/funcs/preauthkeys";

export default function preauthKeysScreen() {
  const { 
    users,
    preAuthKeys,
    loading,
    fetchData,
    setPreAuthKeys,
    handleExpireKey,
    handleCreateKey,
  } = usePreAuthManager();

  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [expireTimeMap, setExpireTimeMap] = useState({});
  const [reusableMap, setReusableMap] = useState({});

  const isExpired = (expiration: string) => new Date(expiration).getTime() < Date.now();

  return (
    <SafeAreaView className="flex-1 bg-zinc-900 px-4 pt-4">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading Pre Auth Keys...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        >
          <View className="mb-4 flex-row justify-end items-center">
            <TouchableOpacity onPress={fetchData}>
              <MaterialIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {users.map((user) => (
            <View key={user.id} className="bg-zinc-800 mb-4 p-4 rounded-xl">
              <TouchableOpacity onPress={() => setExpandedUser(expandedUser === user.name ? null : user.name)}>
                <Text className="text-white text-xl font-semibold mb-2 p-1">{user.name}</Text>
              </TouchableOpacity>

              {expandedUser === user.name && (
                <View>
                  {preAuthKeys[user.name]?.map((key) => {
                    const expired = isExpired(key.expiration);
                    return (
                      <View key={key.id} className="bg-zinc-700 p-3 rounded-md mb-2">
                        <Text className="text-white text-xs">Key: {key.key}</Text>
                        <Text className="text-white text-xs">Created: {new Date(key.createdAt).toLocaleString()}</Text>
                        <Text className="text-white text-xs">Expires: {new Date(key.expiration).toLocaleString()}</Text>
                        <Text className="text-white text-xs">Used: {key.used ? "Yes" : "No"}</Text>

                        <TouchableOpacity
                          className={`${expired ? "bg-zinc-500" : "bg-red-600"} mt-2 p-2 rounded-md`}
                          disabled={expired}
                          onPress={() => handleExpireKey(key.key, user.id)}
                        >
                          <Text className="text-white text-center text-sm font-semibold">
                            {expired ? "Expire Key (expired)" : "Expire Key"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}

                  <View className="bg-zinc-700 p-3 rounded-md mb-2">
                    <TextInput
                      placeholder="Expire Time (e.g. 24h or 7d)"
                      placeholderTextColor="#aaa"
                      value={expireTimeMap[user.name] || ""}
                      onChangeText={(text) => setExpireTimeMap((prev) => ({ ...prev, [user.name]: text }))}
                      className="bg-zinc-600 text-white p-2 rounded-md mb-2"
                    />

                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-white mr-2">Reusable</Text>
                      <Switch
                        value={reusableMap[user.name] || false}
                        onValueChange={(val) =>
                          setReusableMap((prev) => ({ ...prev, [user.name]: val }))
                        }
                        trackColor={{ false: "#767577", true: "#008000" }}
                        thumbColor={reusableMap[user.name] ? "#D3D3D3" : "#D3D3D3"}
                      />
                    </View>

                    <TouchableOpacity
                      className="bg-green-600 p-3 rounded-md"
                      onPress={() =>
                        handleCreateKey(
                          user.id,
                          expireTimeMap[user.name] || "1h",
                          reusableMap[user.name] || false
                        )
                      }
                    >
                      <Text className="text-white text-center font-bold">Create New Key</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
