import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLogin } from "@/app/funcs/index";

export default function LoginScreen() {
  const {
    customName,
    setCustomName,
    server,
    setServer,
    apiKey,
    setApiKey,
    showInfo,
    setShowInfo,
    loading,
    checkForPreviousKey,
    handleLogin,
  } = useLogin();

  useEffect(() => {
    checkForPreviousKey();
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-zinc-900 px-6 justify-center"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Checking For Saved Login...</Text>
        </View>
      ) : (
        <View className="bg-zinc-800 rounded-2xl p-6">
          {/* Logo */}
          <View className="items-center mb-4">
            <Image
              source={require("@/assets/images/noBgScaleManagerLogo.png")}
              className="w-32 h-32"
              resizeMode="contain"
            />
            <Text className="text-white text-3xl font-bold">
              Scale Manager
            </Text>
            <Text className="text-slate-400 text-base mt-1">
              Connect to your Headscale server
            </Text>
          </View>

          {/* name input */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white mb-1">Custom Server Name</Text>
              <TouchableOpacity onPress={() => setShowInfo("name")}>
                <MaterialIcons name="info" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md"
              placeholder="e.g. Home Network, VPN, Work Server"
              placeholderTextColor="#94a3b8"
              value={customName}
              onChangeText={setCustomName}
            />
            {showInfo === "name" && (
              <Text className="text-sm text-slate-300 mt-1">
                Give your Headscale server a nickname to easily identify it later.
              </Text>
            )}
          </View>

          {/* server input */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white mb-1">Server Domain / IP</Text>
              <TouchableOpacity onPress={() => setShowInfo("server")}>
                <MaterialIcons name="info" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md"
              placeholder="e.g. headscale.example.com"
              placeholderTextColor="#94a3b8"
              value={server}
              onChangeText={setServer}
            />
            {showInfo === "server" && (
              <Text className="text-sm text-slate-300 mt-1">
                Use your Headscale server's IP or domain. You must expose it over the internet or local network.
              </Text>
            )}
          </View>

          {/* api key input */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-white mb-1">API Key</Text>
              <TouchableOpacity onPress={() => setShowInfo("key")}>
                <MaterialIcons name="info" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md"
              placeholder="Paste your Headscale API key"
              placeholderTextColor="#94a3b8"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
            />
            {showInfo === "key" && (
              <Text className="text-sm text-slate-300 mt-1">
                You can generate an API key using Headscale's CLI:{" "}
                <Text className="text-slate-100 font-mono">headscale apikey create --expiration 90d</Text>
              </Text>
            )}
          </View>

          {/* Login button */}
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-xl"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-bold text-lg">
              Connect
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
