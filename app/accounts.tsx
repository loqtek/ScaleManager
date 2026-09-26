import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAccountsManager, HeadscaleVersion } from "@/app/funcs/accounts";
import { HttpInsecureWarning, useHttpRiskAck } from "@/app/components/HttpInsecureWarning";
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
  currentVersion,
  onVersionChange,
}: {
  currentVersion: HeadscaleVersion;
  onVersionChange: (version: HeadscaleVersion) => void;
}) {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerStyle={{ paddingRight: 20 }}
    >
      {VERSION_OPTIONS.map((version) => {
        const selected = currentVersion === version;
        return (
          <TouchableOpacity
            key={version}
            onPress={() => onVersionChange(version)}
            activeOpacity={0.8}
            className="mr-3 px-3 py-2 rounded-lg border-2"
            style={{
              backgroundColor: selected ? colors.primary : colors.surfaceMuted,
              borderColor: selected ? colors.primaryMuted : colors.border,
            }}
          >
            <Text
              className="font-semibold text-sm"
              style={{ color: selected ? colors.onPrimary : colors.textSecondary }}
            >
              {version}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default function Accounts() {
  const { theme } = useTheme();
  const { colors } = theme;
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
  const [selectedVersion, setSelectedVersion] = useState<HeadscaleVersion>("0.29.x");
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<string | null>(null);

  const router = useRouter();
  const httpRisk = useHttpRiskAck(server);

  const toggleInfo = (field: string) => {
    setShowInfo(showInfo === field ? null : field);
  };

  const handleAdd = () =>
    handleAddAccount({
      customName,
      server,
      apiKey,
      version: selectedVersion,
      httpRiskAcknowledged: httpRisk.canProceed,
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

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)")} activeOpacity={0.7}>
          <Text className="text-lg font-semibold" style={{ color: colors.text }}>{"<- Back"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text className="text-lg font-semibold" style={{ color: colors.primaryMuted }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>Saved Servers</Text>

        {accounts.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-center" style={{ color: colors.textMuted }}>
              No servers saved yet.{'\n'}Tap "Add" to connect to your first Headscale server.
            </Text>
          </View>
        ) : (
          accounts.map((acc) => (
            <View
              key={acc.name}
              className="rounded-xl p-4 mb-3 border"
              style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            >
              <View className="flex-row justify-between items-start mb-3">
                <TouchableOpacity
                  onPress={() => handleSelectAccount(acc.name)}
                  className="flex-1 pr-4"
                  activeOpacity={0.7}
                >
                  <Text className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
                    {acc.name}
                  </Text>
                  <Text className="text-sm mb-1" style={{ color: colors.textMuted }}>
                    {acc.server}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.muted }}>
                    Added: {formatDate(acc.addedOn)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRemoveAccount(acc.name)}
                  className="p-2"
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              <View className="border-t pt-3" style={{ borderTopColor: colors.border }}>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>Headscale Version:</Text>
                  <TouchableOpacity
                    onPress={() => setEditingVersion(editingVersion === acc.name ? null : acc.name)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={editingVersion === acc.name ? "close" : "edit"}
                      size={16}
                      color={colors.primaryMuted}
                    />
                  </TouchableOpacity>
                </View>

                {editingVersion === acc.name ? (
                  <VersionSelector
                    currentVersion={acc.version as HeadscaleVersion}
                    onVersionChange={(newVersion) => {
                      updateAccountVersion(acc.name, newVersion);
                      setEditingVersion(null);
                    }}
                  />
                ) : (
                  <View className="px-3 py-2 rounded-md" style={{ backgroundColor: colors.surfaceMuted }}>
                    <Text className="font-semibold" style={{ color: colors.text }}>{acc.version}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: colors.overlay }}
        >
          <ScrollView
            className="w-full max-h-[90%] mt-32"
            contentContainerStyle={{ justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full p-6 rounded-2xl" style={{ backgroundColor: colors.surface }}>
              <Text className="text-2xl font-bold mb-6 text-center" style={{ color: colors.text }}>
                Add New Server
              </Text>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>Server Name</Text>
                  <InfoButton field="name" showInfo={showInfo} onPress={() => toggleInfo("name")} />
                </View>
                <TextInput
                  className="p-3 rounded-md"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                  placeholder="e.g. Home Network, Work VPN"
                  placeholderTextColor={colors.textMuted}
                  value={customName}
                  onChangeText={setCustomName}
                />
                <InfoText field="name" showInfo={showInfo}>
                  Give this server a memorable name to identify it easily.
                </InfoText>
              </View>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>Server URL</Text>
                  <InfoButton field="server" showInfo={showInfo} onPress={() => toggleInfo("server")} />
                </View>
                <TextInput
                  className="p-3 rounded-md"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                  placeholder="https://headscale.example.com"
                  placeholderTextColor={colors.textMuted}
                  value={server}
                  onChangeText={setServer}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <InfoText field="server" showInfo={showInfo}>
                  Enter the full URL including http:// or https://
                </InfoText>
                <HttpInsecureWarning
                  insecure={httpRisk.insecure}
                  acknowledged={httpRisk.acknowledged}
                  secondsLeft={httpRisk.secondsLeft}
                  onToggle={httpRisk.toggleAcknowledged}
                />
              </View>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>Headscale Version</Text>
                  <InfoButton field="version" showInfo={showInfo} onPress={() => toggleInfo("version")} />
                </View>
                <VersionSelector
                  currentVersion={selectedVersion}
                  onVersionChange={setSelectedVersion}
                />
                <InfoText field="version" showInfo={showInfo}>
                  Select your server's Headscale version for API compatibility. Check with: {'\n'}
                  <Text className="font-mono" style={{ color: colors.text }}>headscale version</Text>
                </InfoText>
              </View>

              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text style={{ color: colors.text }}>API Key</Text>
                  <InfoButton field="key" showInfo={showInfo} onPress={() => toggleInfo("key")} />
                </View>
                <TextInput
                  className="p-3 rounded-md"
                  style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                  placeholder="Paste your API key here"
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
                  {"\n"}
                  v0.28+ format: <Text className="font-mono" style={{ color: colors.text }}>hskey-api-…</Text>
                </InfoText>
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="py-3 px-6 rounded-xl"
                  style={{ backgroundColor: colors.secondary }}
                  activeOpacity={0.8}
                  onPress={() => {
                    setModalVisible(false);
                    setShowInfo(null);
                    setCustomName("");
                    setServer("");
                    setApiKey("");
                    setSelectedVersion("0.26.x");
                  }}
                >
                  <Text className="font-semibold" style={{ color: colors.onSecondary }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-3 px-6 rounded-xl"
                  style={{ backgroundColor: httpRisk.canProceed ? colors.primary : colors.secondaryPressed }}
                  onPress={handleAdd}
                  disabled={!httpRisk.canProceed}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.onPrimary} size="small" />
                  ) : (
                    <Text className="font-semibold" style={{ color: colors.onPrimary }}>Add Server</Text>
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
