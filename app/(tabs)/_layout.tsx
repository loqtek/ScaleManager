import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { getServerConfig } from "../utils/getServer";
import { useEffect, useState } from "react";




export default function TabLayout() {
  const [hideRoutes, setHideRoutes] = useState(false);

  useEffect(() => {
    async function checkVersion() {
      const serverConf = await getServerConfig();
      if (serverConf?.version && serverConf.version == "0.26") {
        setHideRoutes(true);
      }
    }
    checkVersion();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#27272a",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="users" color={color} size={26} />
          ),
        }}
      />

      <Tabs.Screen
        name="devices"
        options={{
          title: "Devices",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="devices" color={color} size={26} />
          ),
        }}
      />

      <Tabs.Screen
        name="preauthkeys"
        options={{
          title: "Auth Keys",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="key-chain" color={color} size={26} />
          ),
        }}
      />

      <Tabs.Screen
        name="apikeys"
        options={{
          title: "API Keys",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="key" color={color} size={26} />
          ),
        }}
      />

      {!hideRoutes && (
        <Tabs.Screen
          name="routes"
          options={{
            title: "Routes",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="router-network"
                color={color}
                size={26}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
}