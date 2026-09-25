import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLogin, HeadscaleVersion } from "@/app/funcs/index";
import { HttpInsecureWarning } from "@/app/components/HttpInsecureWarning";

const VERSION_OPTIONS: HeadscaleVersion[] = ["0.29.x", "0.28.x", "0.27.x", "0.26.x", "0.25.x", "0.24.x", "0.23.x"];

function InfoButton({
  field,
  showInfo,
  onPress,
}: {
  field: string;
  showInfo: string | null;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="p-1">
      <MaterialIcons
        name={showInfo === field ? "info" : "info-outline"}
        size={18}
        color={showInfo === field ? "#60a5fa" : "#cbd5e1"}
      />
    </TouchableOpacity>
  );
}

function InfoText({
  field,
  showInfo,
  children,
}: {
  field: string;
  showInfo: string | null;
  children: React.ReactNode;
}) {
  if (showInfo !== field) return null;
  return (
    <View className="bg-zinc-700 p-3 rounded-md mt-2 border-l-4 border-blue-500">
      <Text className="text-sm text-slate-200 leading-5">{children}</Text>
    </View>
  );
}

function VersionSelector({
  headscaleVersion,
  setHeadscaleVersion,
  showInfo,
  toggleInfo,
}: {
  headscaleVersion: HeadscaleVersion;
  setHeadscaleVersion: (version: HeadscaleVersion) => void;
  showInfo: string | null;
  toggleInfo: (field: string) => void;
}) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white">Headscale Version</Text>
        <InfoButton field="version" showInfo={showInfo} onPress={() => toggleInfo("version")} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {VERSION_OPTIONS.map((version) => (
          <TouchableOpacity
            key={version}
            onPress={() => setHeadscaleVersion(version)}
            className={`mr-3 px-4 py-2 rounded-lg border-2 ${
              headscaleVersion === version
                ? "bg-blue-600 border-blue-500"
                : "bg-zinc-700 border-zinc-600"
            }`}
          >
            <Text
              className={`font-semibold ${
                headscaleVersion === version ? "text-white" : "text-slate-300"
              }`}
            >
              {version}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <InfoText field="version" showInfo={showInfo}>
        Select your Headscale server version to ensure compatibility with the correct API endpoints. Different versions may use different API paths and request formats. If unsure, check your server version with: {"\n"}
        <Text className="text-slate-100 font-mono">headscale version</Text>
      </InfoText>
    </View>
  );
}

export default function LoginScreen() {
  const {
    customName,
    setCustomName,
    server,
    setServer,
    apiKey,
    setApiKey,
    headscaleVersion,
    setHeadscaleVersion,
    showInfo,
    toggleInfo,
    loading,
    checkForPreviousKey,
    handleLogin,
    httpRisk,
  } = useLogin();

  useEffect(() => {
    checkForPreviousKey();
  }, [checkForPreviousKey]);

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
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ justifyContent: 'center', paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-zinc-800 rounded-2xl p-6 mt-32">
            {/* Logo */}
            <View className="items-center mb-6">
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

            {/* Custom Name Input */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white">Custom Server Name</Text>
                <InfoButton field="name" showInfo={showInfo} onPress={() => toggleInfo("name")} />
              </View>
              <TextInput
                className="bg-zinc-700 text-white p-3 rounded-md"
                placeholder="e.g. Home Network, VPN, Work Server"
                placeholderTextColor="#94a3b8"
                value={customName}
                onChangeText={setCustomName}
              />
              <InfoText field="name" showInfo={showInfo}>
                Give your Headscale server a nickname to easily identify it later. This helps when managing multiple servers.
              </InfoText>
            </View>

            {/* Server Input */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white">Server Domain / IP</Text>
                <InfoButton field="server" showInfo={showInfo} onPress={() => toggleInfo("server")} />
              </View>
              <TextInput
                className="bg-zinc-700 text-white p-3 rounded-md"
                placeholder="e.g. https://headscale.example.com"
                placeholderTextColor="#94a3b8"
                value={server}
                onChangeText={setServer}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <InfoText field="server" showInfo={showInfo}>
                Enter your Headscale server's full URL including http:// or https://. The server must be accessible from your device over the internet or local network.
              </InfoText>
              <HttpInsecureWarning
                insecure={httpRisk.insecure}
                acknowledged={httpRisk.acknowledged}
                secondsLeft={httpRisk.secondsLeft}
                onToggle={httpRisk.toggleAcknowledged}
              />
            </View>

            {/* Version Selector */}
            <VersionSelector
              headscaleVersion={headscaleVersion}
              setHeadscaleVersion={setHeadscaleVersion}
              showInfo={showInfo}
              toggleInfo={toggleInfo}
            />

            {/* API Key Input */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white">API Key</Text>
                <InfoButton field="key" showInfo={showInfo} onPress={() => toggleInfo("key")} />
              </View>
              <TextInput
                className="bg-zinc-700 text-white p-3 rounded-md"
                placeholder="Paste your Headscale API key"
                placeholderTextColor="#94a3b8"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <InfoText field="key" showInfo={showInfo}>
                Generate a management API key (not a pre-auth key):{"\n"}
                <Text className="text-slate-100 font-mono">headscale apikeys create --expiration 90d</Text>
                {"\n\n"}
                Headscale v0.28+ keys look like{" "}
                <Text className="text-slate-100 font-mono">hskey-api-…</Text>
                . Pre-auth keys (<Text className="text-slate-100 font-mono">hskey-auth-…</Text>) cannot log in.
              </InfoText>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`py-3 rounded-xl shadow-lg ${
                httpRisk.canProceed ? "bg-blue-600" : "bg-zinc-600"
              }`}
              onPress={handleLogin}
              disabled={!httpRisk.canProceed}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">
                Connect to Headscale
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}