import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDevices, registerDevice } from "../api/devices";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

interface Device {
  id: string;
  name: string;
  givenName?: string;
  ipAddresses: string[];
  online: boolean;
  lastSeen: string;
  user: {
    id: string;
    name: string;
  };
  registerMethod?: string;
  approvedRoutes?: string[];
  availableRoutes?: string[];
  subnetRoutes?: string[];
  validTags?: string[];
  createdAt: string;
  expiry?: string | null;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await getDevices();
      if (data?.nodes) {
        setDevices(data.nodes);
      } else if (Array.isArray(data)) {
        setDevices(data);
      } else {
        console.warn("Unexpected devices data format:", data);
        setDevices([]);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Fetch Error",
        text2: "Failed to load devices",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Get appropriate icon based on device name/type
  const getDeviceTypeIcon = (deviceName: string = ""): string => {
    const name = deviceName.toLowerCase();
    
    if (name.includes('iphone') || name.includes('phone')) return 'phone-iphone';
    if (name.includes('ipad') || name.includes('tablet')) return 'tablet-mac';
    if (name.includes('macbook') || name.includes('mac')) return 'laptop-mac';
    if (name.includes('desktop') || name.includes('pc')) return 'desktop-windows';
    if (name.includes('server') || name.includes('ubuntu') || name.includes('linux')) return 'dns';
    if (name.includes('pi') || name.includes('raspberry')) return 'developer-board';
    if (name.includes('router') || name.includes('gateway') || name.includes('fw') || name.includes('firewall')) return 'router';
    if (name.includes('localhost')) return 'computer';
    
    return 'devices-other';
  };

  // Format last seen time
  const getLastSeenText = (lastSeen: string): string => {
    try {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      
      return lastSeenDate.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  // Get count of online devices
  const getOnlineDevicesCount = (): number => {
    return devices.filter(device => device.online).length;
  };

  // Sort devices by different criteria
  const sortDevices = (deviceList: Device[], sortBy: "name" | "lastSeen" | "user"): Device[] => {
    return [...deviceList].sort((a, b) => {
      switch (sortBy) {
        case "name":
          const nameA = (a.givenName || a.name || "").toLowerCase();
          const nameB = (b.givenName || b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        
        case "lastSeen":
          const dateA = new Date(a.lastSeen || 0).getTime();
          const dateB = new Date(b.lastSeen || 0).getTime();
          return dateB - dateA; // Most recent first
        
        case "user":
          const userA = (a.user?.name || "").toLowerCase();
          const userB = (b.user?.name || "").toLowerCase();
          return userA.localeCompare(userB);
        
        default:
          return 0;
      }
    });
  };

  const confirmAndRegister = async (username: string, key: string) => {
    try {
      const result = await registerDevice(username, key);

      if (result) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ Device Registered",
          text2: "Device registered successfully!",
        });
        await fetchDevices(); // Refresh device list
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Registration Failed",
          text2: "Failed to register device. Check your credentials.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Registration Error",
        text2: "An error occurred during registration.",
      });
    }
  };

  const handleRegisterDevice = () => {
    Alert.prompt(
      "Register Device",
      "Enter the username to register the device under, or paste the full headscale command:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Next",
          onPress: (input) => {
            if (!input?.trim()) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "⚠️ Invalid Input",
                text2: "Please enter a username or command",
              });
              return;
            }

            // Check if it's a full headscale command
            const fullCommandMatch = input.match(
              /headscale\s+nodes?\s+register\s+--user\s+([^\s]+)\s+--key\s+([\w:]+)/i
            );

            if (fullCommandMatch) {
              const username = fullCommandMatch[1];
              const preAuthKey = fullCommandMatch[2];
              
              Alert.alert(
                "Confirm Registration",
                `Register device for user "${username}" with the provided key?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Register",
                    onPress: () => confirmAndRegister(username, preAuthKey),
                  },
                ]
              );
            } else {
              // Treat as username, prompt for key
              const username = input.trim();
              Alert.prompt(
                "Enter Pre-Auth Key",
                `Enter the pre-auth key for user "${username}":`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Register",
                    onPress: async (key) => {
                      if (!key?.trim()) {
                        Toast.show({
                          type: "error",
                          position: "top",
                          text1: "⚠️ Invalid Key",
                          text2: "Please enter a valid pre-auth key",
                        });
                        return;
                      }
                      confirmAndRegister(username, key.trim());
                    },
                  },
                ],
                "plain-text"
              );
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleDevicePress = (device: Device) => {
    router.push({
      pathname: `/customScreens/${device.id}` as any,
      params: {
        device: JSON.stringify(device),
      },
    });
  };

  // Get devices by user
  const getDevicesByUser = (userId: string): Device[] => {
    return devices.filter(device => device.user?.id === userId);
  };

  // Get device statistics
  const getDeviceStats = () => {
    const totalDevices = devices.length;
    const onlineDevices = devices.filter(d => d.online).length;
    const offlineDevices = totalDevices - onlineDevices;
    
    const userDeviceCounts = devices.reduce((acc, device) => {
      const userName = device.user?.name || "Unknown";
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceTypes = devices.reduce((acc, device) => {
      const icon = getDeviceTypeIcon(device.name || device.givenName);
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDevices,
      onlineDevices,
      offlineDevices,
      userDeviceCounts,
      deviceTypes,
    };
  };

  return {
    devices,
    loading,
    fetchDevices,
    handleRegisterDevice,
    handleDevicePress,
    getDeviceTypeIcon,
    getLastSeenText,
    getOnlineDevicesCount,
    sortDevices,
    getDevicesByUser,
    getDeviceStats,
    router,
  };
}