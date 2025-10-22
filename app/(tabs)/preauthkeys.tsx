import React, { useEffect, useState } from "react";
import {
  Text, View, SafeAreaView, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Modal, TextInput, Alert, Clipboard
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { usePreAuthManager } from "@/app/funcs/preauthkeys";

export default function PreAuthKeysScreen() {
  const {
    users,
    preAuthKeys,
    loading,
    apiVersion,
    fetchData,
    handleExpireKey,
    handleCreateKey,
  } = usePreAuthManager();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [expireTime, setExpireTime] = useState("24h");
  const [isReusable, setIsReusable] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setString(text);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Copied!",
        text2: `${label} copied to clipboard`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Copy Failed",
        text2: "Could not copy to clipboard",
      });
      console.error(error)
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
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

  const isExpired = (expiration: string) => {
    try {
      return new Date(expiration) < new Date();
    } catch {
      return true;
    }
  };

  const getKeyStatus = (key: any) => {
    if (!key.used && !isExpired(key.expiration)) return { status: "Active", color: "text-green-400", bg: "bg-green-500/20" };
    if (key.used) return { status: "Used", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (isExpired(key.expiration)) return { status: "Expired", color: "text-red-400", bg: "bg-red-500/20" };
    return { status: "Unknown", color: "text-gray-400", bg: "bg-gray-500/20" };
  };

  const toggleUserExpansion = (userName: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userName)) {
      newExpanded.delete(userName);
    } else {
      newExpanded.add(userName);
    }
    setExpandedUsers(newExpanded);
  };

  const handleCreateKeySubmit = async () => {
    if (!selectedUser || !expireTime) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Missing Information",
        text2: "Please select a user and expiration time",
      });
      return;
    }

    await handleCreateKey(selectedUser, expireTime, isReusable);
    setShowCreateModal(false);
    setSelectedUser("");
    setExpireTime("24h");
    setIsReusable(false);
  };

  const confirmExpireKey = (keyId: string, userName: string) => {
    Alert.alert(
      "Expire Key",
      `Are you sure you want to expire this pre-auth key?\n\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Expire Key",
          style: "destructive",
          onPress: () => handleExpireKey(keyId, userName),
        },
      ]
    );
  };

  const getTotalKeysForUser = (userName: string) => {
    return preAuthKeys[userName]?.length || 0;
  };

  const getActiveKeysForUser = (userName: string) => {
    return preAuthKeys[userName]?.filter(key => !key.used && !isExpired(key.expiration))?.length || 0;
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading Pre-Auth Keys...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        >
          {/* Header */}
          <View className="mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Pre-Auth Keys</Text>
              <Text className="text-slate-400">
                API Version: {apiVersion} • {users.length} users
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={fetchData} className="p-2">
                <MaterialIcons name="refresh" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowCreateModal(true)}
                className="bg-blue-600 py-2 px-4 rounded-lg flex-row items-center"
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-white font-semibold ml-1">Create Key</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Users List */}
          {users.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="vpn-key-off" size={64} color="#6b7280" />
              <Text className="text-slate-400 text-lg mt-4 text-center">No Users Found</Text>
              <Text className="text-slate-500 text-center mt-2">Create users first to generate pre-auth keys</Text>
            </View>
          ) : (
            users.map((user: any) => {
              const userKeys = preAuthKeys[user.name] || [];
              const totalKeys = getTotalKeysForUser(user.name);
              const activeKeys = getActiveKeysForUser(user.name);
              const isExpanded = expandedUsers.has(user.name);

              return (
                <View key={user.id} className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
                  {/* User Header */}
                  <TouchableOpacity 
                    onPress={() => toggleUserExpansion(user.name)}
                    className="flex-row items-center justify-between mb-3"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center">
                        <MaterialIcons name="person" size={20} color="white" />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-white text-lg font-semibold">{user.name}</Text>
                        <Text className="text-slate-400 text-sm">ID: {user.id}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center space-x-4">
                      <View className="items-center">
                        <Text className="text-green-400 text-lg font-bold">{activeKeys}</Text>
                        <Text className="text-slate-400 text-xs">Active</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-slate-300 text-lg font-bold">{totalKeys}</Text>
                        <Text className="text-slate-400 text-xs">Total</Text>
                      </View>
                      <MaterialIcons 
                        name={isExpanded ? "expand-less" : "expand-more"} 
                        size={24} 
                        color="#60a5fa" 
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Keys List (Expandable) */}
                  {isExpanded && (
                    <View className="mt-4 pt-4 border-t border-zinc-700">
                      {userKeys.length === 0 ? (
                        <Text className="text-slate-400 text-center py-4">No keys found for this user</Text>
                      ) : (
                        userKeys.map((key: any) => {
                          const keyStatus = getKeyStatus(key);
                          
                          return (
                            <View key={key.id} className="bg-zinc-700 rounded-lg p-4 mb-3 border border-zinc-600">
                              {/* Key Header */}
                              <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                  <View className="flex-row items-center mb-2">
                                    <Text className="text-white font-semibold">Key #{key.id}</Text>
                                    <View className={`ml-2 px-2 py-1 rounded-full ${keyStatus.bg}`}>
                                      <Text className={`text-xs font-semibold ${keyStatus.color}`}>
                                        {keyStatus.status}
                                      </Text>
                                    </View>
                                  </View>
                                  
                                  {/* Key Properties */}
                                  <View className="space-y-1">
                                    <View className="flex-row">
                                      <Text className="text-slate-400 w-16 text-xs">Reusable:</Text>
                                      <Text className="text-slate-300 text-xs">
                                        {key.reusable ? "Yes" : "No"}
                                      </Text>
                                    </View>
                                    <View className="flex-row">
                                      <Text className="text-slate-400 w-16 text-xs">Used:</Text>
                                      <Text className="text-slate-300 text-xs">
                                        {key.used ? "Yes" : "No"}
                                      </Text>
                                    </View>
                                    <View className="flex-row">
                                      <Text className="text-slate-400 w-16 text-xs">Created:</Text>
                                      <Text className="text-slate-300 text-xs">
                                        {formatDate(key.createdAt)}
                                      </Text>
                                    </View>
                                    <View className="flex-row">
                                      <Text className="text-slate-400 w-16 text-xs">Expires:</Text>
                                      <Text className={`text-xs ${isExpired(key.expiration) ? 'text-red-400' : 'text-slate-300'}`}>
                                        {formatDate(key.expiration)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                {/* Actions */}
                                <View className="flex-row space-x-2">
                                  <TouchableOpacity
                                    onPress={() => copyToClipboard(key.key, "Pre-auth key")}
                                    className="bg-blue-600 p-2 rounded"
                                  >
                                    <MaterialIcons name="content-copy" size={16} color="white" />
                                  </TouchableOpacity>
                                  
                                  {!key.used && !isExpired(key.expiration) && (
                                    <TouchableOpacity
                                      onPress={() => confirmExpireKey(key.key, user.name)}
                                      className="bg-red-600 p-2 rounded ml-2"
                                    >
                                      <MaterialIcons name="block" size={16} color="white" />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>

                              {/* Key Value */}
                              <View className="bg-zinc-800 p-3 rounded border border-zinc-600">
                                <View className="flex-row justify-between items-center mb-1">
                                  <Text className="text-slate-400 text-xs">Pre-Auth Key:</Text>
                                  <TouchableOpacity onPress={() => copyToClipboard(key.key, "Key")}>
                                    <Text className="text-blue-400 text-xs">Tap to copy</Text>
                                  </TouchableOpacity>
                                </View>
                                <Text className="text-white font-mono text-sm break-all" selectable>
                                  {key.key}
                                </Text>
                              </View>
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Create Key Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-zinc-800 rounded-xl p-6 w-full max-w-md">
            <Text className="text-white text-xl font-bold mb-4 text-center">Create Pre-Auth Key</Text>
            
            {/* User Selection */}
            <View className="mb-4">
              <Text className="text-slate-400 text-sm mb-2">Select User:</Text>
              <ScrollView className="max-h-32 bg-zinc-700 rounded-lg">
                {users.map((user: any) => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => setSelectedUser(user.name)}
                    className={`p-3 border-b border-zinc-600 ${
                      selectedUser === user.name ? 'bg-blue-600' : ''
                    }`}
                  >
                    <Text className="text-white">{user.name}</Text>
                    <Text className="text-slate-400 text-xs">ID: {user.id}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Expiration Time */}
            <View className="mb-4">
              <Text className="text-slate-400 text-sm mb-2">Expiration Time:</Text>
              <TextInput
                className="bg-zinc-700 text-white p-3 rounded-lg"
                value={expireTime}
                onChangeText={setExpireTime}
                placeholder="e.g. 24h, 7d, 30d"
                placeholderTextColor="#94a3b8"
              />
              <Text className="text-slate-500 text-xs mt-1">
                Examples: 1h (1 hour), 24h (24 hours), 7d (7 days), 30d (30 days)
              </Text>
            </View>

            {/* Reusable Toggle */}
            <TouchableOpacity
              onPress={() => setIsReusable(!isReusable)}
              className="flex-row items-center mb-6"
            >
              <MaterialIcons 
                name={isReusable ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color={isReusable ? "#10b981" : "#6b7280"} 
              />
              <View className="ml-3">
                <Text className="text-white">Reusable Key</Text>
                <Text className="text-slate-400 text-xs">Allow this key to be used multiple times</Text>
              </View>
            </TouchableOpacity>

            {/* Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setSelectedUser("");
                  setExpireTime("24h");
                  setIsReusable(false);
                }}
                className="flex-1 bg-gray-600 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold text-center">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleCreateKeySubmit}
                className="flex-1 bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold text-center">Create Key</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}