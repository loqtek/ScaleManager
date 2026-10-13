import { TopTabs } from "expo-router/js-top-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getServerConfig } from "../utils/getServer";
import { useEffect, useState, type ComponentProps } from "react";
import { StyleSheet, Text, type ColorValue } from "react-native";
import { isV026OrHigher } from "../utils/headscaleVersion";
import { useTheme } from "@/theme";
import { spacing } from "@/theme/spacing";

function tabIcon(name: ComponentProps<typeof MaterialCommunityIcons>["name"]) {
  return ({ color }: { color: string }) => (
    <MaterialCommunityIcons name={name} color={color} size={24} />
  );
}

function TabLabel({
  color,
  children,
}: {
  color: ColorValue;
  children: string;
}) {
  const { theme } = useTheme();

  return (
    <Text
      numberOfLines={1}
      style={{
        ...theme.typography.label,
        marginTop: 2,
        fontSize: 11,
        color,
        textAlign: "center",
      }}
    >
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const [hideRoutes, setHideRoutes] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    async function checkVersion() {
      const serverConf = await getServerConfig();
      if (isV026OrHigher(serverConf?.version)) {
        setHideRoutes(true);
      }
    }
    checkVersion();
  }, []);

  return (
    <TopTabs
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        lazyPreloadDistance: 1,
        tabBarShowIcon: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarPressColor: theme.colors.primarySoft,
        tabBarIndicatorStyle: { height: 0 },
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 84,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
          paddingHorizontal: 0,
        },
        tabBarLabel: ({
          color,
          children,
        }: {
          color: ColorValue;
          children: string;
        }) => <TabLabel color={color}>{children}</TabLabel>,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <TopTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home"),
        }}
      />

      <TopTabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: tabIcon("account-group"),
        }}
      />

      <TopTabs.Screen
        name="devices"
        options={{
          title: "Devices",
          tabBarIcon: tabIcon("devices"),
        }}
      />

      <TopTabs.Screen
        name="preauthkeys"
        options={{
          title: "Auth Keys",
          tabBarIcon: tabIcon("key-chain"),
        }}
      />

      <TopTabs.Screen
        name="apikeys"
        options={{
          title: "API Keys",
          tabBarIcon: tabIcon("key"),
        }}
      />

      <TopTabs.Protected guard={!hideRoutes}>
        <TopTabs.Screen
          name="routes"
          options={{
            title: "Routes",
            tabBarIcon: tabIcon("router-network"),
          }}
        />
      </TopTabs.Protected>

      <TopTabs.Screen
        name="acl"
        options={{
          title: "ACL",
          tabBarIcon: tabIcon("shield-account"),
        }}
      />
    </TopTabs>
  );
}
