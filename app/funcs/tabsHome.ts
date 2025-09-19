import { useState, useCallback } from "react";
import { getDevices } from "../api/devices";
import { getUsers } from "../api/users";
import { getServerConfig } from "../utils/getServer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export function useDashboardData() {
    const [devices, setDevices] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [pingTime, setPingTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const deviceRes = await getDevices();
            setDevices(deviceRes.nodes || []);

            const userRes = await getUsers();
            setUsersCount(userRes.users.length || 0);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, []);

    const onlineDevices = devices.filter((d) => d.online);
    const offlineDevices = devices.filter((d) => !d.online);
    const topActiveDevices = [...devices]
        .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
        .slice(0, 5);


    const measurePing = useCallback(async () => {
        try {
            setLoading(true);
            const serverConfig = await getServerConfig();
            if (!serverConfig?.server) {
                setPingTime(null);
                return;
            }

            const start = Date.now();
            await fetch(`${serverConfig.server}`);
            const end = Date.now();
            setPingTime(end - start);
        } catch (err) {
            console.error("Ping error:", err);
            setPingTime(null);
        } finally {
            setLoading(false);
        }
    }, []);
const handleSignOut = () => {
  Alert.alert(
    "Confirm Sign Out",
    "Are you sure you want to sign out? This will remove the server and all associated data.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const selectedName = await AsyncStorage.getItem("selectedServer");
            const serversJson = await AsyncStorage.getItem("servers");

            if (selectedName && serversJson) {
              const servers = JSON.parse(serversJson);
              const updatedServers = servers.filter((s) => s.name !== selectedName);

              await AsyncStorage.setItem("servers", JSON.stringify(updatedServers));
              await AsyncStorage.removeItem("selectedServer");
              console.log(updatedServers.length)
              if (updatedServers.length === 0) {
                router.push("/");
              } else {
                router.push("/accounts");
              }
            } else {
              await AsyncStorage.removeItem("selectedServer");
              router.replace("/");
            }
          } catch (error) {
            console.error("Error during sign out:", error);
          }
        },
      },
    ],
    { cancelable: true }
  );
};


    return {
        devices,
        usersCount,
        fetchData,
        onlineDevices,
        offlineDevices,
        topActiveDevices,
        measurePing,
        loading,
        pingTime,
        handleSignOut
    };
}
