import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDevices, registerDevice } from "../api/devices";
import { getUsers } from "../api/users";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { getApiEndpoints } from "../utils/apiUtils";

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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deviceKey, setDeviceKey] = useState("");
  const router = useRouter();

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const [devicesData, usersData] = await Promise.all([
        getDevices(),
        getUsers()
      ]);
      
      if (devicesData?.nodes) {
        setDevices(devicesData.nodes);
      } else if (Array.isArray(devicesData)) {
        setDevices(devicesData);
      } else {
        console.warn("Unexpected devices data format:", devicesData);
        setDevices([]);
      }

      if (usersData?.users) {
        setUsers(usersData.users);
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
  const getDeviceTypeIcon = (deviceName: string = ""): any => {
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

  const confirmAndRegister = async (user: any, key: string) => {
    try {
      // Check server version to determine whether to use ID or name
      const config = await getApiEndpoints();
      if (!config) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Configuration Error",
          text2: "Failed to get server configuration",
        });
        return;
      }

      const { serverConf } = config;
      const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
      const isV026OrHigher = versionKey >= 'v0.26';
      
      // Use user ID for v0.26+ or name for older versions
      const userParam = isV026OrHigher ? user.id : user.name;
      console.log(userParam, key)
      const result = await registerDevice(userParam, key);

      if (result) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ Device Registered",
          text2: `Device registered successfully for ${user.name}!`,
        });
        await fetchDevices(); // Refresh device list
        setShowRegisterModal(false);
        setSelectedUser(null);
        setDeviceKey("");
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
    if (users.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No Users",
        text2: "No users available. Please add a user first.",
      });
      return;
    }
    setShowRegisterModal(true);
  };

  const handleKeyInput = (input: string) => {
    // Regex to match "headscale nodes register --user USERNAME --key KEY"
    const fullCommandMatch = input.match(
      /headscale\s+nodes?\s+register\s+--user\s+([^\s]+)\s+--key\s+([A-Za-z0-9:_-]+)/i
    );
  
    if (fullCommandMatch) {
      const username = fullCommandMatch[1];
      const preAuthKey = fullCommandMatch[2];
      if (preAuthKey) {
        setDeviceKey(preAuthKey);
        confirmAndRegister(selectedUser, preAuthKey);
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ User Not Found",
          text2: `User "${selectedUser}" not found in the system`,
        });
      }
    } else {
      console.log("Treating as key only");
      // Treat as just a key input
      const trimmedKey = input.trim();
      setDeviceKey(trimmedKey);
  
      if (selectedUser) {
        confirmAndRegister(selectedUser, trimmedKey);
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ No User Selected",
          text2: "Please select a user before registering with just a key.",
        });
      }
    }
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

  const handleModalClose = () => {
    setShowRegisterModal(false);
    setSelectedUser(null);
    setDeviceKey("");
  };

  const handleModalRegister = () => {
    console.log(selectedUser, deviceKey)
    if (!selectedUser) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No User Selected",
        text2: "Please select a user first",
      });
      return;
    }
    if (!deviceKey.trim()) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No Key",
        text2: "Please enter a device key",
      });
      return;
    }
    console.log(deviceKey)
    handleKeyInput(deviceKey);
  };

  return {
    devices,
    users,
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
    // Modal state and handlers
    showRegisterModal,
    selectedUser,
    deviceKey,
    setSelectedUser,
    setDeviceKey,
    handleModalClose,
    handleModalRegister,
  };
}