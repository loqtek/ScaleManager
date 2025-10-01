import React, { useEffect, useState } from "react";
import {
  Text, View, SafeAreaView, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, RefreshControl,
  Alert, Modal, Clipboard
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
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

  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreateKeyWithDisplay = async () => {
    const result = await handleCreateKey();
    
    if (result && result.apiKey) {
      setNewApiKey(result.apiKey);
      setShowKeyModal(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setString(text);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Copied!",
        text2: "API key copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Copy Failed",
        text2: "Could not copy to clipboard",
      });
    }
  };

  const closeKeyModal = () => {
    setShowKeyModal(false);
    setNewApiKey(null);
  };

  const KeyDisplayModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showKeyModal}
      onRequestClose={closeKeyModal}
    >
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-zinc-800 rounded-2xl p-6 w-full max-w-md">
          <View className="items-center mb-4">
            <MaterialIcons name="vpn-key" size={48} color="#10b981" />
            <Text className="text-white text-xl font-bold mt-2">
              New API Key Created
            </Text>
            <Text className="text-slate-400 text-center mt-1">
              Save this key securely - it won't be shown again
            </Text>
          </View>

          <View className="bg-zinc-900 p-4 rounded-lg mb-4 border border-zinc-700">
            <Text className="text-white font-mono text-sm break-all leading-6">
              {newApiKey}
            </Text>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => copyToClipboard(newApiKey!)}
              className="flex-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center"
            >
              <MaterialIcons name="content-copy" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">Copy Key</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeKeyModal}
              className="flex-1 bg-zinc-600 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">Done</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-slate-500 text-xs text-center mt-3">
            This is the only time you'll see the full API key
          </Text>
        </View>
      </View>
    </Modal>
  );

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
          {/* Header */}
          <View className="mb-6 flex-row justify-between items-center">
            <Text className="text-white text-2xl font-bold">API Keys</Text>
            <TouchableOpacity onPress={fetchApiKeys}>
              <MaterialIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Active Key Status */}
          <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="info" size={20} color="#60a5fa" />
              <Text className="text-white text-lg font-semibold ml-2">
                Current Key Status
              </Text>
            </View>
            <Text className="text-slate-300">
              Active Key Expires: {activeKeyExpire || "Unknown"}
            </Text>
          </View>

          {/* Create New Key */}
          <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
            <Text className="text-white text-lg font-semibold mb-3">
              Create New API Key
            </Text>
            
            <View className="mb-3">
              <Text className="text-slate-300 mb-2">Expiration Time</Text>
              <TextInput
                placeholder="e.g. 24h, 7d, 30d, 1y"
                placeholderTextColor="#94a3b8"
                value={newKeyExpire}
                onChangeText={setNewKeyExpire}
                className="bg-zinc-700 text-white p-3 rounded-lg"
              />
              <Text className="text-slate-400 text-xs mt-1">
                Examples: 1h (1 hour), 7d (7 days), 90d (90 days), 1y (1 year)
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleCreateKeyWithDisplay}
              className="bg-green-600 p-3 rounded-lg flex-row items-center justify-center"
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={18} color="white" />
              <Text className="text-white text-center font-semibold ml-1">
                Create New Key
              </Text>
            </TouchableOpacity>
          </View>

          {/* Existing Keys */}
          <View className="mb-4">
            <Text className="text-white text-xl font-semibold mb-4">
              Existing Keys ({apiKeys.length})
            </Text>
            
            {apiKeys.length === 0 ? (
              <View className="bg-zinc-800 rounded-xl p-6 items-center">
                <MaterialIcons name="vpn-key-off" size={48} color="#6b7280" />
                <Text className="text-slate-400 mt-2 text-center">
                  No API keys found
                </Text>
                <Text className="text-slate-500 text-sm text-center mt-1">
                  Create your first API key above
                </Text>
              </View>
            ) : (
              apiKeys.map((key, index) => {
                const expired = isExpired(key.expiration);
                return (
                  <View 
                    key={key.id || index} 
                    className={`bg-zinc-800 p-4 rounded-xl mb-3 border ${
                      expired ? 'border-red-500/30' : 'border-zinc-700'
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <MaterialIcons 
                          name={expired ? "vpn-key-off" : "vpn-key"} 
                          size={20} 
                          color={expired ? "#ef4444" : "#10b981"} 
                        />
                        <Text className="text-white font-semibold ml-2">
                          Key #{index + 1}
                        </Text>
                      </View>
                      <View className={`px-2 py-1 rounded-full ${
                        expired ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}>
                        <Text className={`text-xs font-semibold ${
                          expired ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {expired ? 'EXPIRED' : 'ACTIVE'}
                        </Text>
                      </View>
                    </View>

                    <View className="space-y-2 mb-4">
                      <View className="flex-row">
                        <Text className="text-slate-400 w-20">Prefix:</Text>
                        <Text className="text-white font-mono">{key.prefix}</Text>
                      </View>
                      <View className="flex-row">
                        <Text className="text-slate-400 w-20">Created:</Text>
                        <Text className="text-slate-300">
                          {new Date(key.createdAt).toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Text className="text-slate-400 w-20">Expires:</Text>
                        <Text className={expired ? 'text-red-400' : 'text-slate-300'}>
                          {new Date(key.expiration).toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Expire API Key",
                          `Are you sure you want to expire the key with prefix "${key.prefix}"? This action cannot be undone.`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Expire Key",
                              style: "destructive",
                              onPress: () => handleExpireKey(key.prefix),
                            },
                          ]
                        );
                      }}
                      disabled={expired}
                      className={`p-3 rounded-lg flex-row items-center justify-center ${
                        expired ? "bg-zinc-600" : "bg-red-600"
                      }`}
                    >
                      <MaterialIcons 
                        name={expired ? "block" : "delete"} 
                        size={16} 
                        color="white" 
                      />
                      <Text className="text-white font-semibold ml-1">
                        {expired ? "Already Expired" : "Expire Key"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      <KeyDisplayModal />
    </SafeAreaView>
  );
}