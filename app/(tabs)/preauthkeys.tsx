import React, { useEffect, useState } from "react";
import {
  Text, View, ScrollView, TouchableOpacity,
  RefreshControl, Modal, TextInput, Alert, Clipboard,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { usePreAuthManager } from "@/app/funcs/preauthkeys";
import { ScreenLoading } from "@/app/components/ScreenLoading";
import { useTheme } from "@/theme";

export default function PreAuthKeysScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
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
  }, [fetchData]);

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
    if (!key.used && !isExpired(key.expiration)) return { status: "Active", color: colors.success, bg: colors.successSoft };
    if (key.used) return { status: "Used", color: colors.primaryMuted, bg: colors.primarySoft };
    if (isExpired(key.expiration)) return { status: "Expired", color: colors.error, bg: colors.errorSoft };
    return { status: "Unknown", color: colors.muted, bg: colors.surfaceMuted };
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
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
      {loading ? (
        <ScreenLoading label="Loading Pre-Auth Keys..." />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        >
          {/* Header */}
          <View className="mb-6 flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>Pre-Auth Keys</Text>
              <Text style={{ color: colors.textMuted }}>
                API Version: {apiVersion} • {users.length} users
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={fetchData} className="p-2">
                <MaterialIcons name="refresh" size={24} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowCreateModal(true)}
                className="py-2 px-4 rounded-lg flex-row items-center" style={{ backgroundColor: colors.primary }}
              >
                <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                <Text className="font-semibold ml-1" style={{ color: colors.onPrimary }}>Create Key</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Users List */}
          {users.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="vpn-key-off" size={64} color={colors.muted} />
              <Text className="text-lg mt-4 text-center" style={{ color: colors.textMuted }}>No Users Found</Text>
              <Text className="text-center mt-2" style={{ color: colors.muted }}>Create users first to generate pre-auth keys</Text>
            </View>
          ) : (
            users.map((user: any) => {
              const userKeys = preAuthKeys[user.name] || [];
              const totalKeys = getTotalKeysForUser(user.name);
              const activeKeys = getActiveKeysForUser(user.name);
              const isExpanded = expandedUsers.has(user.name);

              return (
                <View key={user.id} className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  {/* User Header */}
                  <TouchableOpacity 
                    onPress={() => toggleUserExpansion(user.name)}
                    className="flex-row items-center justify-between mb-3"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
                        <MaterialIcons name="person" size={20} color={colors.onPrimary} />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-lg font-semibold" style={{ color: colors.text }}>{user.name}</Text>
                        <Text className="text-sm" style={{ color: colors.textMuted }}>ID: {user.id}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center space-x-4">
                      <View className="items-center">
                        <Text className="text-lg font-bold" style={{ color: colors.success }}>{activeKeys}</Text>
                        <Text className="text-xs" style={{ color: colors.textMuted }}>Active</Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-lg font-bold" style={{ color: colors.textSecondary }}>{totalKeys}</Text>
                        <Text className="text-xs" style={{ color: colors.textMuted }}>Total</Text>
                      </View>
                      <MaterialIcons 
                        name={isExpanded ? "expand-less" : "expand-more"} 
                        size={24} 
                        color={colors.primaryMuted} 
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Keys List (Expandable) */}
                  {isExpanded && (
                    <View className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                      {userKeys.length === 0 ? (
                        <Text className="text-center py-4" style={{ color: colors.textMuted }}>No keys found for this user</Text>
                      ) : (
                        userKeys.map((key: any) => {
                          const keyStatus = getKeyStatus(key);
                          
                          return (
                            <View key={key.id} className="rounded-lg p-4 mb-3 border" style={{ backgroundColor: colors.surfaceMuted, borderColor: colors.border }}>
                              {/* Key Header */}
                              <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                  <View className="flex-row items-center mb-2">
                                    <Text className="font-semibold" style={{ color: colors.text }}>Key #{key.id}</Text>
                                    <View className="ml-2 px-2 py-1 rounded-full" style={{ backgroundColor: keyStatus.bg }}>
                                      <Text className="text-xs font-semibold" style={{ color: keyStatus.color }}>
                                        {keyStatus.status}
                                      </Text>
                                    </View>
                                  </View>
                                  
                                  {/* Key Properties */}
                                  <View className="space-y-1">
                                    <View className="flex-row">
                                      <Text className="w-16 text-xs" style={{ color: colors.textMuted }}>Reusable:</Text>
                                      <Text className="text-xs" style={{ color: colors.textSecondary }}>
                                        {key.reusable ? "Yes" : "No"}
                                      </Text>
                                    </View>
                                    <View className="flex-row">
                                      <Text className="w-16 text-xs" style={{ color: colors.textMuted }}>Used:</Text>
                                      <Text className="text-xs" style={{ color: colors.textSecondary }}>
                                        {key.used ? "Yes" : "No"}
                                      </Text>
                                    </View>
                                    <View className="flex-row">
                                      <Text className="w-16 text-xs" style={{ color: colors.textMuted }}>Created:</Text>
                                      <Text className="text-xs" style={{ color: colors.textSecondary }}>
                                        {formatDate(key.createdAt)}
                                      </Text>
                                    </View>
                                    <View className="flex-row">
                                      <Text className="w-16 text-xs" style={{ color: colors.textMuted }}>Expires:</Text>
                                      <Text className="text-xs" style={{ color: isExpired(key.expiration) ? colors.error : colors.textSecondary }}>
                                        {formatDate(key.expiration)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                {/* Actions */}
                                <View className="flex-row space-x-2">
                                  {!!key.key && (
                                    <TouchableOpacity
                                      onPress={() => copyToClipboard(key.key, "Pre-auth key")}
                                      className="p-2 rounded" style={{ backgroundColor: colors.primary }}
                                    >
                                      <MaterialIcons name="content-copy" size={16} color={colors.onPrimary} />
                                    </TouchableOpacity>
                                  )}
                                  
                                  {!key.used && !isExpired(key.expiration) && (
                                    <TouchableOpacity
                                      onPress={() => confirmExpireKey(String(key.id), user.name)}
                                      className="p-2 rounded ml-2" style={{ backgroundColor: colors.error }}
                                    >
                                      <MaterialIcons name="block" size={16} color={colors.onPrimary} />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>

                              {/* Key Value */}
                              {!!key.key && (
                                <View className="p-3 rounded border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                                  <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-xs" style={{ color: colors.textMuted }}>Pre-Auth Key:</Text>
                                    <TouchableOpacity onPress={() => copyToClipboard(key.key, "Key")}>
                                      <Text className="text-xs" style={{ color: colors.primaryMuted }}>Tap to copy</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <Text className="font-mono text-sm break-all" style={{ color: colors.text }} selectable>
                                    {key.key}
                                  </Text>
                                </View>
                              )}
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
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCreateModal(false);
          setSelectedUser("");
          setExpireTime("24h");
          setIsReusable(false);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: colors.overlay }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              className="w-full max-w-md"
            >
          <View className="rounded-xl p-6 w-full" style={{ backgroundColor: colors.surface }}>
            <Text className="text-xl font-bold mb-4 text-center" style={{ color: colors.text }}>Create Pre-Auth Key</Text>
            
            {/* User Selection */}
            <View className="mb-4">
              <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>Select User:</Text>
              <ScrollView className="max-h-60" keyboardShouldPersistTaps="handled">
                {users.map((user: any) => (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => setSelectedUser(user.name)}
                    activeOpacity={0.8}
                    className="p-3 rounded-lg mb-2"
                    style={{
                      backgroundColor: selectedUser === user.name ? colors.primary : colors.surfaceMuted,
                    }}
                  >
                    <Text style={{ color: selectedUser === user.name ? colors.onPrimary : colors.textSecondary }}>{user.name}</Text>
                    <Text className="text-xs" style={{ color: selectedUser === user.name ? colors.onPrimary : colors.textMuted }}>ID: {user.id}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Expiration Time */}
            <View className="mb-4">
              <Text className="text-sm mb-2" style={{ color: colors.textMuted }}>Expiration Time:</Text>
              <TextInput
                className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                value={expireTime}
                onChangeText={setExpireTime}
                placeholder="e.g. 24h, 7d, 30d"
                placeholderTextColor={colors.textMuted}
              />
              <Text className="text-xs mt-1" style={{ color: colors.muted }}>
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
                color={isReusable ? colors.success : colors.muted} 
              />
              <View className="ml-3">
                <Text style={{ color: colors.text }}>Reusable Key</Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>Allow this key to be used multiple times</Text>
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
                className="flex-1 py-3 rounded-lg" style={{ backgroundColor: colors.secondary }}
              >
                <Text className="font-semibold text-center" style={{ color: colors.onSecondary }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleCreateKeySubmit}
                className="flex-1 py-3 rounded-lg" style={{ backgroundColor: colors.primary }}
              >
                <Text className="font-semibold text-center" style={{ color: colors.onPrimary }}>Create Key</Text>
              </TouchableOpacity>
            </View>
          </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}