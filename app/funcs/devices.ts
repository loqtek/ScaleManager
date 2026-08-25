import { useEffect, useState } from "react";
import { getDevices, registerDevice } from "../api/devices";
import { approveAuth, rejectAuth } from "../api/auth";
import { getUsers } from "../api/users";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { getApiEndpoints } from "../utils/apiUtils";
import { isV026OrHigher, isV029OrHigher } from "../utils/headscaleVersion";
import { parseRegistrationInput } from "../utils/registrationUtils";
import { Device } from "../types";

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deviceKey, setDeviceKey] = useState("");
  const [serverVersion, setServerVersion] = useState<string>("");
  const router = useRouter();

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const config = await getApiEndpoints();
      if (config?.serverConf?.version) {
        setServerVersion(config.serverConf.version);
      }

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

  const getOnlineDevicesCount = (): number => {
    return devices.filter(device => device.online).length;
  };

  const sortDevices = (deviceList: Device[], sortBy: "name" | "lastSeen" | "user"): Device[] => {
    return [...deviceList].sort((a, b) => {
      switch (sortBy) {
        case "name": {
          const nameA = (a.givenName || a.name || "").toLowerCase();
          const nameB = (b.givenName || b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        }
        case "lastSeen": {
          const dateA = new Date(a.lastSeen || 0).getTime();
          const dateB = new Date(b.lastSeen || 0).getTime();
          return dateB - dateA;
        }
        case "user": {
          const userA = (a.user?.name || "").toLowerCase();
          const userB = (b.user?.name || "").toLowerCase();
          return userA.localeCompare(userB);
        }
        default:
          return 0;
      }
    });
  };

  const registrationFailed = (result: any) =>
    !result || result.error || (result.code !== undefined && result.code >= 400);

  const confirmAndRegister = async (user: any, keyOrAuthId: string) => {
    try {
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
      const useNumericIds = isV026OrHigher(serverConf.version);
      const userParam = useNumericIds ? user.id : user.name;
      const result = await registerDevice(userParam, keyOrAuthId);

      if (!registrationFailed(result)) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "✅ Device Registered",
          text2: `Device registered successfully for ${user.name}!`,
        });
        await fetchDevices();
        setShowRegisterModal(false);
        setSelectedUser(null);
        setDeviceKey("");
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Registration Failed",
          text2:
            result?.message ||
            "Failed to register device. Check the auth ID / key and user.",
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

  const confirmAuthAction = async (
    action: "approve" | "reject",
    authId: string,
  ) => {
    try {
      const result =
        action === "approve"
          ? await approveAuth(authId)
          : await rejectAuth(authId);

      if (!registrationFailed(result)) {
        Toast.show({
          type: "success",
          position: "top",
          text1: action === "approve" ? "✅ Auth Approved" : "✅ Auth Rejected",
          text2: `Auth request ${authId} ${action}d.`,
        });
        setShowRegisterModal(false);
        setDeviceKey("");
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ Auth Action Failed",
          text2: result?.message || `Failed to ${action} auth request.`,
        });
      }
    } catch (error) {
      console.error("Auth action error:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Auth Action Error",
        text2: `An error occurred while trying to ${action}.`,
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

  const resolveUser = (nameOrId?: string) => {
    if (!nameOrId) return selectedUser;
    return (
      users.find(
        (u) =>
          u.name === nameOrId ||
          String(u.id) === String(nameOrId),
      ) || selectedUser
    );
  };

  const handleKeyInput = async (input: string) => {
    const parsed = parseRegistrationInput(input);

    if (parsed.kind === "auth-approve") {
      await confirmAuthAction("approve", parsed.authId);
      return;
    }
    if (parsed.kind === "auth-reject") {
      await confirmAuthAction("reject", parsed.authId);
      return;
    }

    if (parsed.kind === "auth-register") {
      const user = resolveUser(parsed.user);
      if (!user) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ No User Selected",
          text2: "Select a user or include --user in the auth register command.",
        });
        return;
      }
      setDeviceKey(parsed.authId);
      await confirmAndRegister(user, parsed.authId);
      return;
    }

    if (parsed.kind === "node-register") {
      const user = resolveUser(parsed.user);
      if (!user) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "⚠️ No User Selected",
          text2: "Select a user or include --user in the register command.",
        });
        return;
      }
      setDeviceKey(parsed.key);
      await confirmAndRegister(user, parsed.key);
      return;
    }

    const trimmedKey = parsed.value;
    setDeviceKey(trimmedKey);

    if (!selectedUser) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No User Selected",
        text2: isV029OrHigher(serverVersion)
          ? "Select a user before registering with an auth ID."
          : "Please select a user before registering with just a key.",
      });
      return;
    }

    await confirmAndRegister(selectedUser, trimmedKey);
  };

  const handleDevicePress = (device: Device) => {
    router.push({
      pathname: `/customScreens/${device.id}` as any,
      params: {
        device: JSON.stringify(device),
      },
    });
  };

  const getDevicesByUser = (userId: string): Device[] => {
    return devices.filter(device => device.user?.id === userId);
  };

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
    if (!selectedUser && !/headscale\s+auth\s+(approve|reject)/i.test(deviceKey)) {
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
        text1: isV029OrHigher(serverVersion) ? "⚠️ No Auth ID" : "⚠️ No Key",
        text2: isV029OrHigher(serverVersion)
          ? "Enter an auth ID or paste a headscale auth command"
          : "Please enter a device key",
      });
      return;
    }
    handleKeyInput(deviceKey);
  };

  const extractAuthId = (input: string) => {
    const parsed = parseRegistrationInput(input);
    if (
      parsed.kind === "auth-approve" ||
      parsed.kind === "auth-reject" ||
      parsed.kind === "auth-register"
    ) {
      return parsed.authId;
    }
    if (parsed.kind === "raw") return parsed.value;
    return "";
  };

  const handleModalApprove = () => {
    const authId = extractAuthId(deviceKey);
    if (!authId) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No Auth ID",
        text2: "Enter an auth ID to approve.",
      });
      return;
    }
    confirmAuthAction("approve", authId);
  };

  const handleModalReject = () => {
    const authId = extractAuthId(deviceKey);
    if (!authId) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No Auth ID",
        text2: "Enter an auth ID to reject.",
      });
      return;
    }
    confirmAuthAction("reject", authId);
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
    serverVersion,
    showRegisterModal,
    selectedUser,
    deviceKey,
    setSelectedUser,
    setDeviceKey,
    handleModalClose,
    handleModalRegister,
    handleModalApprove,
    handleModalReject,
  };
}
