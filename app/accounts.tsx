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
import { useRouter } from "expo-router";
import { useAccountsManager } from "@/app/funcs/accounts";

export default function Accounts() {
  const {
    accounts,
    loading,
    handleSelectAccount,
    handleRemoveAccount,
    handleAddAccount,
  } = useAccountsManager();

  const [modalVisible, setModalVisible] = useState(false);
  const [customName, setCustomName] = useState("");
  const [server, setServer] = useState("");
  const [apiKey, setApiKey] = useState("");

  const router = useRouter();

  const handleAdd = () =>
    handleAddAccount({
      customName,
      server,
      apiKey,
      onSuccess: () => {
        setModalVisible(false);
        setCustomName("");
        setServer("");
        setApiKey("");
      },
    });

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {/* header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Text className="text-white text-lg font-semibold">{"< Back"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-blue-400 text-lg font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* acc list */}
      <ScrollView className="px-4">
        <Text className="text-white text-2xl font-bold mb-4">Saved Servers</Text>
        {accounts.map((acc) => (
          <View
            key={acc.name}
            className="flex-row justify-between items-center bg-zinc-800 rounded-xl p-4 mb-3"
          >
            <TouchableOpacity
              onPress={() => handleSelectAccount(acc.name)}
              className="px-4 py-2 rounded-sm"
            >
              <Text className="text-white text-lg font-semibold">{acc.name}</Text>
              <Text className="text-gray-400">{acc.server}</Text>
              <Text className="text-gray-400 font-mono">
                Added: {acc.addedOn}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveAccount(acc.name)}>
              <Text className="text-red-400 text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center px-6 mt-12"
        >
          <View className="w-full bg-zinc-800 p-6 rounded-2xl">
            <Text className="text-white text-2xl font-bold mb-4 text-center">
              Add New Account
            </Text>

            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md mb-3"
              placeholder="Custom Name"
              placeholderTextColor="#94a3b8"
              value={customName}
              onChangeText={setCustomName}
            />

            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md mb-3"
              placeholder="Server URL"
              placeholderTextColor="#94a3b8"
              value={server.toLowerCase()}
              onChangeText={setServer}
              autoCapitalize="none"
            />

            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md mb-6"
              placeholder="API Key"
              placeholderTextColor="#94a3b8"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-600 py-3 px-5 rounded-xl"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600 py-3 px-5 rounded-xl"
                onPress={handleAdd}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
