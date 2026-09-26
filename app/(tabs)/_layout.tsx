import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getServerConfig } from "../utils/getServer";
import { useEffect, useState } from "react";
import { isV026OrHigher } from "../utils/headscaleVersion";
import { useTheme } from "@/theme";
import { spacing } from "@/theme/spacing";

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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          borderTopWidth: 1,
          height: 74,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
        },
        tabBarLabelStyle: {
          ...theme.typography.label,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="devices"
        options={{
          title: "Devices",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="devices" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="preauthkeys"
        options={{
          title: "Auth Keys",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="key-chain" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="apikeys"
        options={{
          title: "API Keys",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="key" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="routes"
        options={{
          title: "Routes",
          headerShown: false,
          href: hideRoutes ? null : "/routes",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="router-network"
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="acl"
        options={{
          title: "ACL",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="shield-account"
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
