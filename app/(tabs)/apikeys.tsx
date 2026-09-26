import React, { useEffect, useState } from "react";
import {
  Text, View, TouchableOpacity,
  TextInput, ScrollView, RefreshControl,
  Alert, Modal, Clipboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useApiKeys } from "@/app/funcs/apikeys";
import { ScreenLoading } from "@/app/components/ScreenLoading";
import { useTheme } from "@/theme";

function KeyDisplayModal({
  visible,
  apiKey,
  onClose,
  onCopy,
}: {
  visible: boolean;
  apiKey: string | null;
  onClose: () => void;
  onCopy: (value: string) => void;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: colors.overlay }}>
        <View className="rounded-2xl p-6 w-full max-w-md shadow-2xl" style={{ backgroundColor: colors.surface }}>
          <View className="items-center mb-4">
            <MaterialIcons name="vpn-key" size={48} color={colors.success} />
            <Text className="text-xl font-bold mt-2" style={{ color: colors.text }}>
              New API Key Created
            </Text>
            <Text className="text-center mt-1" style={{ color: colors.textMuted }}>
              Save this key securely - it won&apos;t be shown again
            </Text>
          </View>

          <View className="p-4 rounded-lg mb-4 border" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
            <Text className="font-mono text-sm break-all leading-6" style={{ color: colors.text }}>
              {apiKey}
            </Text>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => apiKey && onCopy(apiKey)}
              className="flex-1 py-3 rounded-lg flex-row items-center justify-center" style={{ backgroundColor: colors.primary }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="content-copy" size={18} color={colors.onPrimary} />
              <Text className="font-semibold ml-2" style={{ color: colors.onPrimary }}>Copy Key</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-lg" style={{ backgroundColor: colors.secondaryPressed }}
              activeOpacity={0.7}
            >
              <Text className="font-semibold text-center" style={{ color: colors.onSecondary }}>Done</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-center mt-3" style={{ color: colors.muted }}>
            This is the only time you&apos;ll see the full API key
          </Text>
        </View>
      </View>
    </Modal>
  );
}

export default function ApiKeysScreen() {
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
  const { theme } = useTheme();
  const colors = theme.colors;

  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

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

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
      {loading ? (
        <ScreenLoading label="Loading API Keys..." />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchApiKeys} />
          }
        >
          {/* Header */}
          <View className="mb-6 flex-row justify-between items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>API Keys</Text>
            <TouchableOpacity onPress={fetchApiKeys} activeOpacity={0.7}>
              <MaterialIcons name="refresh" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Active Key Status */}
          <View className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="info" size={20} color={colors.primaryMuted} />
              <Text className="text-lg font-semibold ml-2" style={{ color: colors.text }}>
                Current Key Status
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary }}>
              Active Key Expires: {activeKeyExpire || "Unknown"}
            </Text>
          </View>

          {/* Create New Key */}
          <View className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
              Create New API Key
            </Text>
            
            <View className="mb-3">
              <Text className="mb-2" style={{ color: colors.textSecondary }}>Expiration Time</Text>
              <TextInput
                placeholder="e.g. 24h, 7d, 30d, 1y"
                placeholderTextColor={colors.textMuted}
                value={newKeyExpire}
                onChangeText={setNewKeyExpire}
                className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
              />
              <Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
                Examples: 1h (1 hour), 7d (7 days), 90d (90 days), 1y (1 year)
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleCreateKeyWithDisplay}
              className="p-3 rounded-lg flex-row items-center justify-center" style={{ backgroundColor: colors.success }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="add" size={18} color={colors.onPrimary} />
              <Text className="text-center font-semibold ml-1" style={{ color: colors.onPrimary }}>
                Create New Key
              </Text>
            </TouchableOpacity>
          </View>

          {/* Existing Keys */}
          <View className="mb-4">
            <Text className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Existing Keys ({apiKeys.length})
            </Text>
            
            {apiKeys.length === 0 ? (
              <View className="rounded-xl p-6 items-center" style={{ backgroundColor: colors.surface }}>
                <MaterialIcons name="vpn-key-off" size={48} color={colors.muted} />
                <Text className="mt-2 text-center" style={{ color: colors.textMuted }}>
                  No API keys found
                </Text>
                <Text className="text-sm text-center mt-1" style={{ color: colors.muted }}>
                  Create your first API key above
                </Text>
              </View>
            ) : (
              apiKeys.map((key, index) => {
                const expired = isExpired(key.expiration);
                return (
                  <View 
                    key={key.id || index} 
                    className="p-4 rounded-xl mb-3 border"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: expired ? colors.error : colors.border,
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <MaterialIcons 
                          name={expired ? "vpn-key-off" : "vpn-key"} 
                          size={20} 
                          color={expired ? colors.error : colors.success} 
                        />
                        <Text className="font-semibold ml-2" style={{ color: colors.text }}>
                          Key #{index + 1}
                        </Text>
                      </View>
                      <View
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: expired ? colors.errorSoft : colors.successSoft }}
                      >
                        <Text className="text-xs font-semibold" style={{ color: expired ? colors.error : colors.success }}>
                          {expired ? 'EXPIRED' : 'ACTIVE'}
                        </Text>
                      </View>
                    </View>

                    <View className="space-y-2 mb-4">
                      <View className="flex-row">
                        <Text className="w-20" style={{ color: colors.textMuted }}>Prefix:</Text>
                        <Text className="font-mono" style={{ color: colors.text }}>{key.prefix}</Text>
                      </View>
                      <View className="flex-row">
                        <Text className="w-20" style={{ color: colors.textMuted }}>Created:</Text>
                        <Text style={{ color: colors.textSecondary }}>
                          {new Date(key.createdAt).toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row">
                        <Text className="w-20" style={{ color: colors.textMuted }}>Expires:</Text>
                        <Text style={{ color: expired ? colors.error : colors.textSecondary }}>
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
                              onPress: () => handleExpireKey({ id: key.id, prefix: key.prefix }),
                            },
                          ]
                        );
                      }}
                      disabled={expired}
                      className="p-3 rounded-lg flex-row items-center justify-center"
                      style={{ backgroundColor: expired ? colors.secondaryPressed : colors.error }}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons 
                        name={expired ? "block" : "delete"} 
                        size={16} 
                        color={colors.onPrimary} 
                      />
                      <Text className="font-semibold ml-1" style={{ color: colors.onPrimary }}>
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

      <KeyDisplayModal
        visible={showKeyModal}
        apiKey={newApiKey}
        onClose={closeKeyModal}
        onCopy={copyToClipboard}
      />
    </SafeAreaView>
  );
}