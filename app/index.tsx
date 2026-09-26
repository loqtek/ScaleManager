import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useLogin, HeadscaleVersion } from "@/app/funcs/index";
import { HttpInsecureWarning } from "@/app/components/HttpInsecureWarning";
import { ScreenLoading } from "@/app/components/ScreenLoading";
import { useTheme } from "@/theme";

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
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} className="p-1" activeOpacity={0.7}>
      <MaterialIcons
        name={showInfo === field ? "info" : "info-outline"}
        size={18}
        color={showInfo === field ? theme.colors.primaryMuted : theme.colors.textSecondary}
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
  const { theme } = useTheme();
  if (showInfo !== field) return null;
  return (
    <View
      className="p-3 rounded-md mt-2 border-l-4"
      style={{ backgroundColor: theme.colors.surfaceMuted, borderLeftColor: theme.colors.primary }}
    >
      <Text className="text-sm leading-5" style={{ color: theme.colors.textSecondary }}>{children}</Text>
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
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text style={{ color: colors.text }}>Headscale Version</Text>
        <InfoButton field="version" showInfo={showInfo} onPress={() => toggleInfo("version")} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {VERSION_OPTIONS.map((version) => {
          const selected = headscaleVersion === version;
          return (
            <TouchableOpacity
              key={version}
              onPress={() => setHeadscaleVersion(version)}
              activeOpacity={0.8}
              className="mr-3 px-4 py-2 rounded-lg border-2"
              style={{
                backgroundColor: selected ? colors.primary : colors.surfaceMuted,
                borderColor: selected ? colors.primaryMuted : colors.border,
              }}
            >
              <Text
                className="font-semibold"
                style={{ color: selected ? colors.onPrimary : colors.textSecondary }}
              >
                {version}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <InfoText field="version" showInfo={showInfo}>
        Select your Headscale server version to ensure compatibility with the correct API endpoints. Different versions may use different API paths and request formats. If unsure, check your server version with: {"\n"}
        <Text className="font-mono" style={{ color: colors.text }}>headscale version</Text>
      </InfoText>
    </View>
  );
}

export default function LoginScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
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
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1 px-6 justify-center"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <ScreenLoading label="Checking For Saved Login..." />
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ justifyContent: "center", paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="rounded-2xl p-6 mt-32" style={{ backgroundColor: colors.surface }}>
              <View className="items-center mb-6">
                <Image
                  source={require("@/assets/images/noBgScaleManagerLogo.png")}
                  className="w-32 h-32"
                  resizeMode="contain"
                />
                <Text className="text-3xl font-bold" style={{ color: colors.text }}>
                  Scale Manager
                </Text>
                <Text className="text-base mt-1" style={{ color: colors.textMuted }}>
                  Connect to your Headscale server
                </Text>
              </View>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>Custom Server Name</Text>
                  <InfoButton field="name" showInfo={showInfo} onPress={() => toggleInfo("name")} />
                </View>
                <TextInput
                  className="p-3 rounded-md"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                  placeholder="e.g. Home Network, VPN, Work Server"
                  placeholderTextColor={colors.textMuted}
                  value={customName}
                  onChangeText={setCustomName}
                />
                <InfoText field="name" showInfo={showInfo}>
                  Give your Headscale server a nickname to easily identify it later. This helps when managing multiple servers.
                </InfoText>
              </View>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>Server Domain / IP</Text>
                  <InfoButton field="server" showInfo={showInfo} onPress={() => toggleInfo("server")} />
                </View>
                <TextInput
                  className="p-3 rounded-md"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                  placeholder="e.g. https://headscale.example.com"
                  placeholderTextColor={colors.textMuted}
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

              <VersionSelector
                headscaleVersion={headscaleVersion}
                setHeadscaleVersion={setHeadscaleVersion}
                showInfo={showInfo}
                toggleInfo={toggleInfo}
              />

              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>API Key</Text>
                  <InfoButton field="key" showInfo={showInfo} onPress={() => toggleInfo("key")} />
                </View>
                <TextInput
                  className="p-3 rounded-md"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                  placeholder="Paste your Headscale API key"
                  placeholderTextColor={colors.textMuted}
                  value={apiKey}
                  onChangeText={setApiKey}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <InfoText field="key" showInfo={showInfo}>
                  Generate a management API key (not a pre-auth key):{"\n"}
                  <Text className="font-mono" style={{ color: colors.text }}>headscale apikeys create --expiration 90d</Text>
                  {"\n\n"}
                  Headscale v0.28+ keys look like{" "}
                  <Text className="font-mono" style={{ color: colors.text }}>hskey-api-…</Text>
                  . Pre-auth keys (<Text className="font-mono" style={{ color: colors.text }}>hskey-auth-…</Text>) cannot log in.
                </InfoText>
              </View>

              <TouchableOpacity
                className="py-3 rounded-xl"
                style={{ backgroundColor: httpRisk.canProceed ? colors.primary : colors.secondaryPressed }}
                onPress={handleLogin}
                disabled={!httpRisk.canProceed}
                activeOpacity={0.8}
              >
                <Text className="text-center font-bold text-lg" style={{ color: colors.onPrimary }}>
                  Connect to Headscale
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
