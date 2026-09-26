import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import SetupGuideModal from "@/components/SetupGuideModal";
import { useACL } from "@/hooks/useACL";
import { useTheme } from "@/theme";

export default function ACLScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const {
    // State
    policy,
    loading,
    saving,
    policyVersions,
    showVersions,
    editing,
    editText,
    showSetupGuide,

    // Actions
    fetchPolicy,
    savePolicy,
    startEditing,
    cancelEditing,
    restoreVersion,
    deleteVersion,
    onRefresh,

    // Modal controls
    setShowVersions,
    setShowSetupGuide,
    setEditText,
    serverVersion,
  } = useACL();

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>ACL Policy</Text>
              <Text className="text-sm" style={{ color: colors.textMuted }}>Access Control List Management</Text>
              {serverVersion?.startsWith("0.29") && (
                <Text className="text-xs mt-1" style={{ color: colors.muted }}>
                  v0.29: supports grants, nodeAttrs, tests & sshTests. Policy is checked before save.
                </Text>
              )}
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowSetupGuide(true)}
                className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.success }}
                activeOpacity={0.8}
              >
                <MaterialIcons name="help-outline" size={22} color={colors.onPrimary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowVersions(true)}
                className="p-3 rounded-xl shadow-lg"
                style={{ backgroundColor: policyVersions.length === 0 ? colors.surfaceMuted : colors.primary }}
                disabled={policyVersions.length === 0}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="history" 
                  size={22} 
                  color={policyVersions.length > 0 ? colors.onPrimary : colors.muted} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={startEditing}
                className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.primary }}
                disabled={!policy}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="edit" 
                  size={22} 
                  color={policy ? colors.onPrimary : colors.muted} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Version count badge */}
          {policyVersions.length > 0 && (
            <View className="border rounded-lg px-3 py-2 flex-row items-center" style={{ backgroundColor: colors.primarySoft, borderColor: colors.primaryMuted }}>
              <MaterialIcons name="history" size={14} color={colors.primaryMuted} />
              <Text className="text-xs ml-2 font-semibold" style={{ color: colors.primaryMuted }}>
                {policyVersions.length} saved version{policyVersions.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Setup Help Banner - Only show if no policy */}
        {!policy && !loading && (
          <View className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 rounded-2xl p-5 mb-6 shadow-lg" style={{ borderColor: colors.primaryMuted }}>
            <View className="flex-row items-start">
              <View className="rounded-full p-3 mr-4" style={{ backgroundColor: colors.primary }}>
                <MaterialIcons name="info" size={24} color={colors.onPrimary} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-base mb-2" style={{ color: colors.text }}>
                  Need Help Setting Up ACL?
                </Text>
                <Text className="text-sm leading-5 mb-4" style={{ color: colors.textSecondary }}>
                  If you're having trouble accessing your ACL policy, you might need to configure Headscale properly. Our setup guide will walk you through it step-by-step.
                </Text>
                <TouchableOpacity
                  onPress={() => setShowSetupGuide(true)}
                  className="px-5 py-3 rounded-xl flex-row items-center self-start shadow-md" style={{ backgroundColor: colors.primary }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="play-arrow" size={18} color={colors.onPrimary} />
                  <Text className="font-bold ml-1" style={{ color: colors.onPrimary }}>View Setup Guide</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Policy Display */}
        <View className="rounded-2xl p-5 mb-6 border shadow-lg" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="rounded-lg p-2 mr-3" style={{ backgroundColor: colors.success }}>
                <MaterialIcons name="policy" size={20} color={colors.onPrimary} />
              </View>
              <Text className="text-lg font-bold" style={{ color: colors.text }}>Current Policy</Text>
            </View>
            {loading && (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color={colors.success} />
                <Text className="text-sm ml-2" style={{ color: colors.success }}>Loading...</Text>
              </View>
            )}
          </View>

          {policy ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              className="rounded-xl p-4" style={{ backgroundColor: colors.background }}
            >
              <Text className="font-mono text-xs leading-5" style={{ color: colors.success }} selectable>
                {policy}
              </Text>
            </ScrollView>
          ) : (
            <View className="rounded-xl p-8 items-center" style={{ backgroundColor: colors.background }}>
              <View className="rounded-full p-6 mb-3" style={{ backgroundColor: colors.surface }}>
                <MaterialIcons name="policy" size={48} color={colors.muted} />
              </View>
              <Text className="text-base font-semibold" style={{ color: colors.textMuted }}>No Policy Loaded</Text>
              <Text className="text-sm mt-1" style={{ color: colors.muted }}>Pull to refresh or check setup</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={fetchPolicy}
              className="flex-1 min-w-[45%] p-4 rounded-xl border flex-row items-center shadow-md" style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              activeOpacity={0.7}
            >
              <View className="rounded-lg p-2 mr-3" style={{ backgroundColor: colors.primary }}>
                <MaterialIcons name="refresh" size={20} color={colors.onPrimary} />
              </View>
              <Text className="font-semibold" style={{ color: colors.text }}>Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowVersions(true)}
              className="flex-1 min-w-[45%] p-4 rounded-xl border flex-row items-center shadow-md" style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              disabled={policyVersions.length === 0}
              activeOpacity={0.7}
            >
              <View
                className="rounded-lg p-2 mr-3"
                style={{ backgroundColor: policyVersions.length > 0 ? colors.primary : colors.surfaceMuted }}
              >
                <MaterialIcons 
                  name="history" 
                  size={20} 
                  color={policyVersions.length > 0 ? colors.onPrimary : colors.muted} 
                />
              </View>
              <View className="flex-1">
                <Text className="font-semibold" style={{ color: policyVersions.length > 0 ? colors.text : colors.muted }}>
                  Versions
                </Text>
                {policyVersions.length > 0 && (
                  <Text className="text-xs" style={{ color: colors.primaryMuted }}>
                    {policyVersions.length} saved
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editing}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
          <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
            <TouchableOpacity 
              onPress={cancelEditing}
              className="px-4 py-2"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold" style={{ color: colors.error }}>Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold" style={{ color: colors.text }}>Edit Policy</Text>
            <TouchableOpacity 
              onPress={savePolicy} 
              disabled={saving}
              className="px-4 py-2"
              activeOpacity={0.7}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.success} />
              ) : (
                <Text className="text-base font-semibold" style={{ color: colors.success }}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="rounded-xl border overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <View className="px-4 py-2 border-b" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                <Text className="text-xs font-mono" style={{ color: colors.textMuted }}>
                  {editText.split('\n').length} lines • {editText.length} characters
                </Text>
              </View>
              <TextInput
                value={editText}
                onChangeText={setEditText}
                multiline
                textAlignVertical="top"
                className="p-4 font-mono text-sm"
                style={{ backgroundColor: colors.background, color: colors.text, minHeight: 500 }}
                placeholder="Enter your ACL policy JSON here..."
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Versions Modal */}
      <Modal
        visible={showVersions}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
          <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
            <TouchableOpacity 
              onPress={() => setShowVersions(false)}
              className="px-4 py-2"
              activeOpacity={0.7}
            >
              <Text className="text-base font-semibold" style={{ color: colors.primaryMuted }}>Close</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold" style={{ color: colors.text }}>Version History</Text>
            <View style={{ width: 70 }} />
          </View>

          <ScrollView className="flex-1 p-4">
            {policyVersions.length === 0 ? (
              <View className="items-center py-12">
                <View className="rounded-full p-8 mb-4" style={{ backgroundColor: colors.surface }}>
                  <MaterialIcons name="history" size={48} color={colors.muted} />
                </View>
                <Text className="text-base font-semibold" style={{ color: colors.textMuted }}>No Saved Versions</Text>
                <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                  Versions are saved automatically when you update
                </Text>
              </View>
            ) : (
              policyVersions.map((version, index) => (
                <View key={version.id} className="rounded-xl p-4 mb-3 border shadow-md" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View className="rounded-full px-2 py-1 mr-2" style={{ backgroundColor: colors.primary }}>
                          <Text className="text-xs font-bold" style={{ color: colors.onPrimary }}>v{policyVersions.length - index}</Text>
                        </View>
                        <Text className="text-sm" style={{ color: colors.textMuted }}>
                          {version.timestamp.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteVersion(version.id)}
                      className="p-2"
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="delete" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="rounded-lg p-3 mb-3" style={{ backgroundColor: colors.background }}>
                    <Text className="font-mono text-xs leading-4" style={{ color: colors.success }}>
                      {version.policy.substring(0, 200) + (version.policy.length > 200 ? '...' : '')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => restoreVersion(version)}
                    className="py-3 px-4 rounded-xl flex-row items-center justify-center shadow-md" style={{ backgroundColor: colors.primary }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="restore" size={18} color={colors.onPrimary} />
                    <Text className="font-bold ml-2" style={{ color: colors.onPrimary }}>Restore This Version</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Setup Guide Modal */}
      <SetupGuideModal
        visible={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />

    </SafeAreaView>
  );
}