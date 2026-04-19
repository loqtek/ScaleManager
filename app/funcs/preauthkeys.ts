import { useEffect, useState } from "react";
import { getPreAuthKeys, createPreAuthKey, expirePreAuthKey } from "../api/preauthkeys";
import { getUsers } from "../api/users";
import { getApiEndpoints } from "../utils/apiUtils";
import { isV026OrHigher, isV028OrHigher } from "../utils/headscaleVersion";
import Toast from "react-native-toast-message";
import { calculateExpirationDate } from "../utils/time";

export const usePreAuthManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [preAuthKeys, setPreAuthKeys] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [apiVersion, setApiVersion] = useState<string>('');

  // Helper function to get the correct user identifier based on API version
  const getUserIdentifier = (user: any, version: string): string => {
    
    // v0.26+ uses user IDs across endpoints.
    if (isV026OrHigher(version)) {
      // For v0.26, return user ID as string (API will convert to number)
      const userId = user.id ? user.id.toString() : user.name;
      return userId;
    } else {
      // For older versions, use name
      return user.name;
    }
  };

  // Helper function to get user key for storing preauth keys
  const getUserKey = (user: any): string => {
    // Always use name as the key for consistency in our state management
    return user.name;
  };

  const fetchData = async () => {
    try {
      const config = await getApiEndpoints();
      const detectedVersion = config?.serverConf?.version || '0.23.x';
      setApiVersion(detectedVersion);

      // Now fetch users
      const usersRes = await getUsers();
      const userList = usersRes?.users || [];
      setUsers(userList);

      const allKeys: Record<string, any[]> = {};

      // v0.28+ preauth key listing is global, so we fetch once and fan out by user.
      if (isV028OrHigher(detectedVersion)) {
        const keysRes = await getPreAuthKeys();
        const keys = keysRes?.preAuthKeys || [];

        for (const user of userList) {
          const userKey = getUserKey(user);
          allKeys[userKey] = keys.filter((key: any) => key?.user?.name === user.name);
        }
      } else {
        for (const user of userList) {
          const userIdentifier = getUserIdentifier(user, detectedVersion);
          const userKey = getUserKey(user);

          try {
            const keysRes = await getPreAuthKeys(userIdentifier);
            allKeys[userKey] = keysRes?.preAuthKeys || [];
          } catch (error) {
            console.error(`Failed to fetch preauth keys for user ${userKey}:`, error);
            allKeys[userKey] = [];
          }
        }
      }
      
      setPreAuthKeys(allKeys);
    } catch (error) {
      console.error("Error in fetchData:", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Fetch Error",
        text2: "Failed to load preauth keys data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExpireKey = async (keyId: string, userName: string) => {
    // Find the user object to get the correct identifier
    const user = users.find((u: any) => u.name === userName || u.id === userName);
    if (!user) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "User Not Found",
        text2: `Could not find user ${userName}.`,
      });
      return;
    }

    const userIdentifier = getUserIdentifier(user, apiVersion);
    console.log(`Expiring key ${keyId} for user ${userName} with identifier ${userIdentifier}`);
    
    const result = await expirePreAuthKey(userIdentifier, keyId, apiVersion);
    
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Key Expired",
        text2: `Key expired successfully.`,
      });
      
      try {
        fetchData();
      } catch (error) {
        console.error("Failed to refresh preauth keys:", error);
      }
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to Expire Key",
        text2: `Failed to expire key.`,
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
    const user = users.find((u: any) => u.name === userName || u.id === userName)  ;
    if (!user) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "User Not Found",
        text2: `Could not find user ${userName}.`,
      });
      return;
    }

    const userIdentifier = getUserIdentifier(user, apiVersion);
    
    const result = await createPreAuthKey(userIdentifier, expirationDate, reusable);
    
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Key Created",
        text2: `Key created successfully for ${userName}.`,
      });
      
      try {
        fetchData()
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
    apiVersion,
    fetchData,
    setPreAuthKeys,
    handleExpireKey,
    handleCreateKey,
  };
};