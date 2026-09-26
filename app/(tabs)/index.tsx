import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useDashboardData } from "@/app/funcs/tabsHome";
import { exportFrontendLogs } from "@/app/utils/frontendLog";
import { useTheme } from "@/theme";
import Toast from "react-native-toast-message";

const ICON_SIZE = 20;

function SkeletonBar({
  width,
  height = 14,
}: {
  width: number | `${number}%`;
  height?: number;
}) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.colors.skeleton,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function IndexScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { colors, spacing, radii, shadows, typography } = theme;
  const [exportingLogs, setExportingLogs] = useState(false);
  const {
    devices,
    usersCount,
    fetchData,
    onlineDevices,
    offlineDevices,
    topActiveDevices,
    pingTime,
    loading,
    measurePing,
    handleSignOut
  } = useDashboardData();

  const showSkeleton = loading && devices.length === 0 && usersCount === 0;

  const onRefresh = async () => {
    await measurePing();
    await fetchData();
  };

  const handleAccounts = () => {
    router.push("/accounts");
  };
  const handleDiscord = async () => {
    const url = "https://discord.gg/fRMxHmwm4z";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        "Unable to open Discord. Please visit: https://discord.gg/fRMxHmwm4z",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    measurePing();
    fetchData();
  }, [measurePing, fetchData]);

  const handleGitHub = async () => {
    const url = "https://github.com/loqtek/ScaleManager/issues";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        "Unable to open GitHub. Please visit: https://github.com/loqtek/ScaleManager/issues",
        [{ text: "OK" }]
      );
    }
  };

  const handleExportLogs = async () => {
    if (exportingLogs) return;
    setExportingLogs(true);
    try {
      await exportFrontendLogs();
      Toast.show({
        type: "success",
        position: "top",
        text1: "Logs ready",
        text2: "Save or share the log file to debug this session.",
      });
    } catch (error) {
      console.error("Failed to export logs:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Export failed",
        text2: "Could not write the log file.",
      });
    } finally {
      setExportingLogs(false);
    }
  };

  const handleStarRepo = async () => {
    const url = "https://github.com/loqtek/ScaleManager";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        "Unable to open GitHub. Please visit: https://github.com/loqtek/ScaleManager",
        [{ text: "OK" }]
      );
    }
  };

  const card = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  };

  const quickActions: {
    label: string;
    route: "/(tabs)/users" | "/(tabs)/devices" | "/(tabs)/preauthkeys" | "/(tabs)/apikeys" | "/(tabs)/acl";
    icon: React.ComponentProps<typeof MaterialIcons>["name"];
  }[] = [
    { label: "Users", route: "/(tabs)/users", icon: "people" },
    { label: "Devices", route: "/(tabs)/devices", icon: "devices" },
    { label: "Auth Keys", route: "/(tabs)/preauthkeys", icon: "vpn-key" },
    { label: "API Keys", route: "/(tabs)/apikeys", icon: "key" },
    { label: "ACL", route: "/(tabs)/acl", icon: "security" },
  ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl }}>
          <View style={{ flex: 1, marginRight: spacing.md }}>
            <Text style={{ color: colors.text, ...typography.heading }}>Scale Manager</Text>
            <Text style={{ color: colors.textMuted, ...typography.caption, marginTop: spacing.xs }}>
              Headscale Network Dashboard
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
            <Pressable
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel={theme.scheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              style={({ pressed }) => ({
                padding: spacing.sm,
                borderRadius: radii.full,
                backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <MaterialCommunityIcons
                name={theme.scheme === "dark" ? "weather-sunny" : "weather-night"}
                size={22}
                color={colors.text}
              />
            </Pressable>
            <Pressable
              onPress={handleAccounts}
              accessibilityRole="button"
              accessibilityLabel="Accounts"
              style={({ pressed }) => ({
                padding: spacing.sm,
                borderRadius: radii.full,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <MaterialCommunityIcons name="account-circle" size={26} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={handleSignOut}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              style={({ pressed }) => ({
                padding: spacing.sm,
                borderRadius: radii.full,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <MaterialCommunityIcons name="logout" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={card}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={{ color: colors.text, ...typography.subheading }}>Server Status</Text>
              {loading ? (
                <View style={{ marginTop: spacing.sm }}>
                  <SkeletonBar width={140} />
                </View>
              ) : (
                <Text style={{ color: colors.textSecondary, ...typography.caption, marginTop: spacing.xs }}>
                  {pingTime !== null ? `${pingTime}ms response time` : "No connection"}
                </Text>
              )}
            </View>
            <Pressable
              onPress={measurePing}
              accessibilityRole="button"
              accessibilityLabel="Refresh server status"
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.secondaryPressed : colors.secondary,
                padding: spacing.md,
                borderRadius: radii.md,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <MaterialCommunityIcons name="refresh" size={ICON_SIZE} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={card}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg }}>
            <Text style={{ color: colors.text, ...typography.subheading }}>Network Overview</Text>
            <Pressable
              onPress={fetchData}
              accessibilityRole="button"
              accessibilityLabel="Refresh network overview"
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.secondaryPressed : colors.secondary,
                padding: spacing.sm,
                borderRadius: radii.md,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <MaterialCommunityIcons name="refresh" size={16} color={colors.text} />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: spacing.sm }}>
            {(
              [
                { label: "Users", value: usersCount, icon: "account-group" as const, tint: colors.primaryMuted },
                { label: "Online", value: onlineDevices.length, icon: "wifi" as const, tint: colors.success },
                { label: "Offline", value: offlineDevices.length, icon: "wifi-off" as const, tint: colors.error },
                { label: "Total", value: devices.length, icon: "server" as const, tint: colors.primaryMuted },
              ]
            ).map((stat) => (
              <View
                key={stat.label}
                style={{
                  width: "48%",
                  backgroundColor: colors.surfaceMuted,
                  padding: spacing.md,
                  borderRadius: radii.md,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcons name={stat.icon} size={16} color={stat.tint} />
                  <Text style={{ color: colors.textMuted, ...typography.caption, marginLeft: spacing.sm }}>
                    {stat.label}
                  </Text>
                </View>
                {showSkeleton ? (
                  <View style={{ marginTop: spacing.sm }}>
                    <SkeletonBar width={36} height={20} />
                  </View>
                ) : (
                  <Text style={{ color: colors.text, fontSize: 20, lineHeight: 28, fontWeight: "700", marginTop: spacing.xs }}>
                    {stat.value}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {topActiveDevices.length > 0 && (
          <View style={card}>
            <Text style={{ color: colors.text, ...typography.subheading, marginBottom: spacing.md }}>
              Recent Activity
            </Text>
            {topActiveDevices.map((device, index) => (
              <View
                key={device.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: spacing.sm,
                  borderBottomWidth: index === topActiveDevices.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: radii.full,
                    backgroundColor: colors.primarySoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons name="devices" size={16} color={colors.primaryMuted} />
                </View>
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={{ color: colors.text, ...typography.bodyMedium }}>
                    {device.givenName || device.name}
                  </Text>
                  <Text style={{ color: colors.textMuted, ...typography.caption }}>
                    {new Date(device.lastSeen).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginBottom: spacing.sm }}>
          <Text style={{ color: colors.text, ...typography.subheading, marginBottom: spacing.md }}>
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
                className="w-[48%] p-4 rounded-xl mb-3 border flex-row items-center"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <MaterialIcons name={item.icon} size={20} color={colors.primaryMuted} />
                <Text className="font-semibold ml-3" style={{ color: colors.text }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingTop: spacing.xxl, paddingBottom: spacing.lg }}>
          <View style={{ ...card, padding: spacing.xl, marginBottom: 0 }}>
            <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
              <MaterialCommunityIcons name="github" size={32} color={colors.primaryMuted} />
              <Text style={{ color: colors.text, ...typography.subheading, fontWeight: "700", marginTop: spacing.sm }}>
                Help Improve Scale Manager
              </Text>
            </View>

            <Text
              style={{
                color: colors.textSecondary,
                ...typography.body,
                textAlign: "center",
                marginBottom: spacing.xl,
              }}
            >
              Found a bug or have a feature idea? We'd love to hear from you!
              Your feedback helps make this app better for everyone.
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleGitHub}
                activeOpacity={0.8}
                className="py-3 px-4 rounded-lg flex-row items-center justify-center mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <MaterialIcons name="bug-report" size={18} color={colors.onPrimary} />
                <Text className="font-semibold ml-2" style={{ color: colors.onPrimary }}>
                  Report Issues & Suggestions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleExportLogs}
                disabled={exportingLogs}
                activeOpacity={0.8}
                className="py-3 px-4 rounded-lg flex-row items-center justify-center border mb-4"
                style={{
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                  opacity: exportingLogs ? 0.5 : 1,
                }}
              >
                <MaterialIcons name="file-download" size={18} color={colors.primaryMuted} />
                <Text className="font-semibold ml-2" style={{ color: colors.onSecondary }}>
                  {exportingLogs ? "Preparing log file..." : "Export debug logs"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStarRepo}
                activeOpacity={0.8}
                className="py-3 px-4 rounded-lg flex-row items-center justify-center border mb-4"
                style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
              >
                <FontAwesome name="star" size={16} color={colors.warning} />
                <Text className="font-semibold ml-2" style={{ color: colors.onSecondary }}>
                  Star on GitHub
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDiscord}
                activeOpacity={0.8}
                className="py-3 px-4 rounded-lg flex-row items-center justify-center border"
                style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
              >
                <FontAwesome name="inbox" size={16} color={colors.primaryMuted} />
                <Text className="font-semibold ml-2" style={{ color: colors.onSecondary }}>
                  Join Our Discord
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: colors.textMuted, ...typography.label, textAlign: "center", marginTop: spacing.lg }}>
              github.com/loqtek/ScaleManager
            </Text>
            <Text style={{ color: colors.textMuted, ...typography.label, textAlign: "center", marginTop: spacing.xs }}>
              discord.gg/fRMxHmwm4z
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
