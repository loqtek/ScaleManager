import { useEffect, useState } from "react";
import { getPreAuthKeys, createPreAuthKey, expirePreAuthKey } from "../api/preauthkeys";
import { getUsers } from "../api/users";
import { getApiEndpoints } from "../utils/apiUtils";
import Toast from "react-native-toast-message";
import { calculateExpirationDate } from "../utils/time";

export const usePreAuthManager = () => {
  const [users, setUsers] = useState([]);
  const [preAuthKeys, setPreAuthKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiVersion, setApiVersion] = useState<string>('v0.26'); // Track API version

  // Helper function to get the correct user identifier based on API version
  const getUserIdentifier = (user: any): string => {
    if (apiVersion.startsWith('v0.26')) {
      return user.id?.toString() || user.name; // Use ID for 0.26+, fallback to name
    } else {
      return user.name; // Use name for 0.23, 0.24, 0.25
    }
  };

  // Helper function to get user key for storing preauth keys
  const getUserKey = (user: any): string => {
    // Always use name as the key for consistency in our state management
    return user.name;
  };

  const fetchData = async () => {
    // Get API version first
    const config = await getApiEndpoints();
    if (config) {
      // Determine version from server config
      const serverVersion = config.serverConf.version;
      if (serverVersion?.startsWith('0.26')) {
        setApiVersion('v0.26');
      } else if (serverVersion?.startsWith('0.25')) {
        setApiVersion('v0.25');
      } else if (serverVersion?.startsWith('0.24')) {
        setApiVersion('v0.24');
      } else {
        setApiVersion('v0.23');
      }
    }

    const usersRes = await getUsers();
    const userList = usersRes?.users || [];
    setUsers(userList);

    const allKeys: Record<string, any[]> = {};
    for (const user of userList) {
      const userIdentifier = getUserIdentifier(user);
      const userKey = getUserKey(user);
      
      try {
        const keysRes = await getPreAuthKeys(userIdentifier);
        allKeys[userKey] = keysRes?.preAuthKeys || [];
      } catch (error) {
        console.error(`Failed to fetch preauth keys for user ${userKey}:`, error);
        allKeys[userKey] = [];
      }
    }
    setPreAuthKeys(allKeys);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExpireKey = async (keyId: string, userName: string) => {
    // Find the user object to get the correct identifier
    const user = users.find((u: any) => u.name === userName);
    if (!user) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "User Not Found",
        text2: `Could not find user ${userName}.`,
      });
      return;
    }

    const userIdentifier = getUserIdentifier(user);
    const result = await expirePreAuthKey(userIdentifier, keyId);
    
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Key Expired",
        text2: `Key ${keyId} expired successfully.`,
      });
      
      // Refresh keys for this user
      try {
        const keysRes = await getPreAuthKeys(userIdentifier);
        setPreAuthKeys((prev) => ({ 
          ...prev, 
          [userName]: keysRes?.preAuthKeys || [] 
        }));
      } catch (error) {
        console.error("Failed to refresh preauth keys:", error);
      }
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to Expire Key",
        text2: `Failed to expire key ${keyId}.`,
      });
    }
  };

  const handleCreateKey = async (userName: string, expireTime: string, reusable: boolean) => {
    const regex = /^(0|[1-9]\d*)([smhd])$/;
    if (!regex.test(expireTime)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Expiration Time",
        text2: "Please enter a valid expiration time (e.g. 24h, 7d)",
      });
      return;
    }

    const expirationDate = calculateExpirationDate(expireTime);

    if (!expirationDate) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Expiration Time",
        text2: "Failed to calculate expiration date.",
      });
      return;
    }

    // Find the user object to get the correct identifier
    const user = users.find((u: any) => u.name === userName);
    if (!user) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "User Not Found",
        text2: `Could not find user ${userName}.`,
      });
      return;
    }

    const userIdentifier = getUserIdentifier(user);
    const result = await createPreAuthKey(userIdentifier, expirationDate, reusable);
    
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Key Created",
        text2: `Key created successfully for ${userName}.`,
      });
      
      // Refresh keys for this user
      try {
        const keysRes = await getPreAuthKeys(userIdentifier);
        setPreAuthKeys((prev) => ({ 
          ...prev, 
          [userName]: keysRes?.preAuthKeys || [] 
        }));
      } catch (error) {
        console.error("Failed to refresh preauth keys:", error);
      }
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to Create Key",
        text2: `Failed to create key for ${userName}.`,
      });
    }
  };

  return {
    users,
    preAuthKeys,
    loading,
    apiVersion, // Expose API version for debugging/display
    fetchData,
    setPreAuthKeys,
    handleExpireKey,
    handleCreateKey,
  };
};