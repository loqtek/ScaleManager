import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SetupGuideModal from "@/components/SetupGuideModal";
import { useACL } from "@/hooks/useACL";

export default function ACLScreen() {
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
  } = useACL();

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">ACL Policy</Text>
              <Text className="text-slate-400 text-sm">Access Control List Management</Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowSetupGuide(true)}
                className="bg-green-600 p-3 rounded-xl shadow-lg"
                activeOpacity={0.8}
              >
                <MaterialIcons name="help-outline" size={22} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowVersions(true)}
                className={`p-3 rounded-xl shadow-lg ${
                  policyVersions.length === 0 ? 'bg-zinc-700' : 'bg-purple-600'
                }`}
                disabled={policyVersions.length === 0}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="history" 
                  size={22} 
                  color={policyVersions.length > 0 ? "white" : "#6b7280"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={startEditing}
                className="bg-blue-600 p-3 rounded-xl shadow-lg"
                disabled={!policy}
                activeOpacity={0.8}
              >
                <MaterialIcons 
                  name="edit" 
                  size={22} 
                  color={policy ? "white" : "#6b7280"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Version count badge */}
          {policyVersions.length > 0 && (
            <View className="bg-purple-900/30 border border-purple-500/30 rounded-lg px-3 py-2 flex-row items-center">
              <MaterialIcons name="history" size={14} color="#a78bfa" />
              <Text className="text-purple-300 text-xs ml-2 font-semibold">
                {policyVersions.length} saved version{policyVersions.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Setup Help Banner - Only show if no policy */}
        {!policy && !loading && (
          <View className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-blue-500/30 rounded-2xl p-5 mb-6 shadow-lg">
            <View className="flex-row items-start">
              <View className="bg-blue-600 rounded-full p-3 mr-4">
                <MaterialIcons name="info" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base mb-2">
                  Need Help Setting Up ACL?
                </Text>
                <Text className="text-blue-100 text-sm leading-5 mb-4">
                  If you're having trouble accessing your ACL policy, you might need to configure Headscale properly. Our setup guide will walk you through it step-by-step.
                </Text>
                <TouchableOpacity
                  onPress={() => setShowSetupGuide(true)}
                  className="bg-blue-600 px-5 py-3 rounded-xl flex-row items-center self-start shadow-md"
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="play-arrow" size={18} color="white" />
                  <Text className="text-white font-bold ml-1">View Setup Guide</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Policy Display */}
        <View className="bg-zinc-800 rounded-2xl p-5 mb-6 border border-zinc-700 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-green-600 rounded-lg p-2 mr-3">
                <MaterialIcons name="policy" size={20} color="white" />
              </View>
              <Text className="text-white text-lg font-bold">Current Policy</Text>
            </View>
            {loading && (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#10b981" />
                <Text className="text-green-400 text-sm ml-2">Loading...</Text>
              </View>
            )}
          </View>

          {policy ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              className="bg-zinc-900 rounded-xl p-4"
            >
              <Text className="text-green-400 font-mono text-xs leading-5" selectable>
                {policy}
              </Text>
            </ScrollView>
          ) : (
            <View className="bg-zinc-900 rounded-xl p-8 items-center">
              <View className="bg-zinc-800 rounded-full p-6 mb-3">
                <MaterialIcons name="policy" size={48} color="#4b5563" />
              </View>
              <Text className="text-slate-400 text-base font-semibold">No Policy Loaded</Text>
              <Text className="text-slate-500 text-sm mt-1">Pull to refresh or check setup</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={fetchPolicy}
              className="bg-zinc-800 flex-1 min-w-[45%] p-4 rounded-xl border border-zinc-700 flex-row items-center shadow-md"
              activeOpacity={0.7}
            >
              <View className="bg-blue-600 rounded-lg p-2 mr-3">
                <MaterialIcons name="refresh" size={20} color="white" />
              </View>
              <Text className="text-white font-semibold">Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowVersions(true)}
              className="bg-zinc-800 flex-1 min-w-[45%] p-4 rounded-xl border border-zinc-700 flex-row items-center shadow-md"
              disabled={policyVersions.length === 0}
              activeOpacity={0.7}
            >
              <View className={`rounded-lg p-2 mr-3 ${
                policyVersions.length > 0 ? 'bg-purple-600' : 'bg-zinc-700'
              }`}>
                <MaterialIcons 
                  name="history" 
                  size={20} 
                  color={policyVersions.length > 0 ? "white" : "#6b7280"} 
                />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${
                  policyVersions.length > 0 ? 'text-white' : 'text-gray-500'
                }`}>
                  Versions
                </Text>
                {policyVersions.length > 0 && (
                  <Text className="text-purple-400 text-xs">
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
        <SafeAreaView className="flex-1 bg-zinc-900">
          <View className="flex-row justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800">
            <TouchableOpacity 
              onPress={cancelEditing}
              className="px-4 py-2"
              activeOpacity={0.7}
            >
              <Text className="text-red-400 text-base font-semibold">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Edit Policy</Text>
            <TouchableOpacity 
              onPress={savePolicy} 
              disabled={saving}
              className="px-4 py-2"
              activeOpacity={0.7}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#10b981" />
              ) : (
                <Text className="text-green-400 text-base font-semibold">Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
              <View className="bg-zinc-900 px-4 py-2 border-b border-zinc-700">
                <Text className="text-slate-400 text-xs font-mono">
                  {editText.split('\n').length} lines • {editText.length} characters
                </Text>
              </View>
              <TextInput
                value={editText}
                onChangeText={setEditText}
                multiline
                textAlignVertical="top"
                className="bg-zinc-900 text-white p-4 font-mono text-sm"
                style={{ minHeight: 500 }}
                placeholder="Enter your ACL policy JSON here..."
                placeholderTextColor="#4b5563"
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
        <SafeAreaView className="flex-1 bg-zinc-900">
          <View className="flex-row justify-between items-center p-4 border-b border-zinc-700 bg-zinc-800">
            <TouchableOpacity 
              onPress={() => setShowVersions(false)}
              className="px-4 py-2"
              activeOpacity={0.7}
            >
              <Text className="text-blue-400 text-base font-semibold">Close</Text>
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Version History</Text>
            <View style={{ width: 70 }} />
          </View>

          <ScrollView className="flex-1 p-4">
            {policyVersions.length === 0 ? (
              <View className="items-center py-12">
                <View className="bg-zinc-800 rounded-full p-8 mb-4">
                  <MaterialIcons name="history" size={48} color="#4b5563" />
                </View>
                <Text className="text-slate-400 text-base font-semibold">No Saved Versions</Text>
                <Text className="text-slate-500 text-sm mt-1">
                  Versions are saved automatically when you update
                </Text>
              </View>
            ) : (
              policyVersions.map((version, index) => (
                <View key={version.id} className="bg-zinc-800 rounded-xl p-4 mb-3 border border-zinc-700 shadow-md">
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View className="bg-purple-600 rounded-full px-2 py-1 mr-2">
                          <Text className="text-white text-xs font-bold">v{policyVersions.length - index}</Text>
                        </View>
                        <Text className="text-slate-400 text-sm">
                          {version.timestamp.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteVersion(version.id)}
                      className="p-2"
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="delete" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="bg-zinc-900 rounded-lg p-3 mb-3">
                    <Text className="text-green-400 font-mono text-xs leading-4">
                      {version.policy.substring(0, 200) + (version.policy.length > 200 ? '...' : '')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => restoreVersion(version)}
                    className="bg-purple-600 py-3 px-4 rounded-xl flex-row items-center justify-center shadow-md"
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="restore" size={18} color="white" />
                    <Text className="text-white font-bold ml-2">Restore This Version</Text>
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