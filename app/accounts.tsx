import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAccountsManager, HeadscaleVersion } from "@/app/funcs/accounts";

const VERSION_OPTIONS: HeadscaleVersion[] = ["0.27.x", "0.26.x", "0.25.x", "0.24.x", "0.23.x"];

export default function Accounts() {
  const {
    accounts,
    loading,
    handleSelectAccount,
    handleRemoveAccount,
    handleAddAccount,
    updateAccountVersion,
  } = useAccountsManager();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [customName, setCustomName] = useState("");
  const [server, setServer] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<HeadscaleVersion>("0.26.x");
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<string | null>(null);
  
  const router = useRouter();

  const toggleInfo = (field: string) => {
    setShowInfo(showInfo === field ? null : field);
  };

  const handleAdd = () =>
    handleAddAccount({
      customName,
      server,
      apiKey,
      version: selectedVersion,
      onSuccess: () => {
        setModalVisible(false);
        setCustomName("");
        setServer("");
        setApiKey("");
        setSelectedVersion("0.26.x");
        setShowInfo(null);
      },
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const InfoButton = ({ field, onPress }: { field: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="p-1">
      <MaterialIcons 
        name={showInfo === field ? "info" : "info-outline"} 
        size={18} 
        color={showInfo === field ? "#60a5fa" : "#cbd5e1"} 
      />
    </TouchableOpacity>
  );

  const InfoText = ({ field, children }: { field: string; children: React.ReactNode }) => (
    showInfo === field ? (
      <View className="bg-zinc-700 p-3 rounded-md mt-2 border-l-4 border-blue-500">
        <Text className="text-sm text-slate-200 leading-5">
          {children}
        </Text>
      </View>
    ) : null
  );

  const VersionSelector = ({ 
    currentVersion, 
    onVersionChange 
  }: { 
    currentVersion: HeadscaleVersion; 
    onVersionChange: (version: HeadscaleVersion) => void;
  }) => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerStyle={{ paddingRight: 20 }}
    >
      {VERSION_OPTIONS.map((version) => (
        <TouchableOpacity
          key={version}
          onPress={() => onVersionChange(version)}
          className={`mr-3 px-3 py-2 rounded-lg border-2 ${
            currentVersion === version 
              ? 'bg-blue-600 border-blue-500' 
              : 'bg-zinc-700 border-zinc-600'
          }`}
        >
          <Text className={`font-semibold text-sm ${
            currentVersion === version ? 'text-white' : 'text-slate-300'
          }`}>
            {version}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Text className="text-white text-lg font-semibold">{"< Back"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-blue-400 text-lg font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Account List */}
      <ScrollView className="px-4">
        <Text className="text-white text-2xl font-bold mb-4">Saved Servers</Text>
        
        {accounts.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-slate-400 text-center">
              No servers saved yet.{'\n'}Tap "Add" to connect to your first Headscale server.
            </Text>
          </View>
        ) : (
          accounts.map((acc) => (
            <View
              key={acc.name}
              className="bg-zinc-800 rounded-xl p-4 mb-3 border border-zinc-700"
            >
              <View className="flex-row justify-between items-start mb-3">
                <TouchableOpacity
                  onPress={() => handleSelectAccount(acc.name)}
                  className="flex-1 pr-4"
                >
                  <Text className="text-white text-lg font-semibold mb-1">
                    {acc.name}
                  </Text>
                  <Text className="text-gray-400 text-sm mb-1">
                    {acc.server}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Added: {formatDate(acc.addedOn)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => handleRemoveAccount(acc.name)}
                  className="p-2"
                >
                  <MaterialIcons name="delete" size={20} color="#f87171" />
                </TouchableOpacity>
              </View>

              {/* Version Section */}
              <View className="border-t border-zinc-700 pt-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-slate-300 text-sm">Headscale Version:</Text>
                  <TouchableOpacity
                    onPress={() => setEditingVersion(editingVersion === acc.name ? null : acc.name)}
                  >
                    <MaterialIcons 
                      name={editingVersion === acc.name ? "close" : "edit"} 
                      size={16} 
                      color="#60a5fa" 
                    />
                  </TouchableOpacity>
                </View>
                
                {editingVersion === acc.name ? (
                  <VersionSelector 
                    currentVersion={acc.version}
                    onVersionChange={(newVersion) => {
                      updateAccountVersion(acc.name, newVersion);
                      setEditingVersion(null);
                    }}
                  />
                ) : (
                  <View className="bg-zinc-700 px-3 py-2 rounded-md">
                    <Text className="text-white font-semibold">{acc.version}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Account Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <ScrollView 
            className="w-full max-h-[90%] mt-32" 
            contentContainerStyle={{ justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full bg-zinc-800 p-6 rounded-2xl">
              <Text className="text-white text-2xl font-bold mb-6 text-center">
                Add New Server
              </Text>

              {/* Custom Name Input */}
              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white">Server Name</Text>
                  <InfoButton field="name" onPress={() => toggleInfo("name")} />
                </View>
                <TextInput
                  className="bg-zinc-700 text-white p-3 rounded-md"
                  placeholder="e.g. Home Network, Work VPN"
                  placeholderTextColor="#94a3b8"
                  value={customName}
                  onChangeText={setCustomName}
                />
                <InfoText field="name">
                  Give this server a memorable name to identify it easily.
                </InfoText>
              </View>

              {/* Server URL Input */}
              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white">Server URL</Text>
                  <InfoButton field="server" onPress={() => toggleInfo("server")} />
                </View>
                <TextInput
                  className="bg-zinc-700 text-white p-3 rounded-md"
                  placeholder="https://headscale.example.com"
                  placeholderTextColor="#94a3b8"
                  value={server}
                  onChangeText={setServer}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <InfoText field="server">
                  Enter the full URL including http:// or https://
                </InfoText>
              </View>

              {/* Version Selector */}
              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white">Headscale Version</Text>
                  <InfoButton field="version" onPress={() => toggleInfo("version")} />
                </View>
                <VersionSelector 
                  currentVersion={selectedVersion}
                  onVersionChange={setSelectedVersion}
                />
                <InfoText field="version">
                  Select your server's Headscale version for API compatibility. Check with: {'\n'}
                  <Text className="text-slate-100 font-mono">headscale version</Text>
                </InfoText>
              </View>

              {/* API Key Input */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white">API Key</Text>
                  <InfoButton field="key" onPress={() => toggleInfo("key")} />
                </View>
                <TextInput
                  className="bg-zinc-700 text-white p-3 rounded-md"
                  placeholder="Paste your API key here"
                  placeholderTextColor="#94a3b8"
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <InfoText field="key">
                  Generate with: {'\n'}
                  <Text className="text-slate-100 font-mono">headscale apikey create --expiration 90d</Text>
                </InfoText>
              </View>

              {/* Buttons */}
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-600 py-3 px-6 rounded-xl"
                  onPress={() => {
                    setModalVisible(false);
                    setShowInfo(null);
                    setCustomName("");
                    setServer("");
                    setApiKey("");
                    setSelectedVersion("0.26.x");
                  }}
                >
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-blue-600 py-3 px-6 rounded-xl"
                  onPress={handleAdd}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white font-semibold">Add Server</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}