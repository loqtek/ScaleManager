import { useState } from "react";
import Toast from "react-native-toast-message";
import { getAPIKeys, createAPIKey, expireAPIKey } from "../api/apikeys";
import { calculateExpirationDate } from "../utils/time";
import { getServerConfig } from "../utils/getServer";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyExpire, setNewKeyExpire] = useState("");
  const [activeKeyExpire, setActiveKeyExpire] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApiKeys = async () => {
    try {
      const keys = await getAPIKeys();
      const allKeys = keys?.apiKeys || [];
      setApiKeys(allKeys);

      const serverConfig = await getServerConfig();
      if (!serverConfig) {
        setActiveKeyExpire("No server configured.");
        return;
      }

      const currentKey = serverConfig.apiKey;
      if (currentKey) {
        const matchedKey = allKeys.find((key) => key.prefix && currentKey.startsWith(key.prefix));
        if (matchedKey?.expiration) {
          const expirationDate = new Date(matchedKey.expiration).toLocaleString();
          setActiveKeyExpire(expirationDate);
        } else {
          setActiveKeyExpire("Key found but has no expiration date");
        }
      } else {
        setActiveKeyExpire("No key set in storage");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setActiveKeyExpire("Error loading key info");
    } finally {
      setLoading(false);
    }
  };

const handleCreateKey = async () => {
  if (!newKeyExpire.trim()) {
    Toast.show({
      type: "error",
      position: "top",
      text1: "⚠️ Expiration Required",
      text2: "Please enter an expiration time",
    });
    return null;
  }

  // Validate expiration format
  const regex = /^(0|[1-9]\d*)([smhdy])$/;
  if (!regex.test(newKeyExpire)) {
    Toast.show({
      type: "error",
      position: "top",
      text1: "⚠️ Invalid Format",
      text2: "Use format like: 24h, 7d, 30d, 1y",
    });
    return null;
  }

  try {
    // Convert expiration to timestamp format your API expects
    const expirationTimestamp = calculateExpirationDate(newKeyExpire);
    
    // Call your API to create the key
    const result = await createAPIKey(expirationTimestamp);
    
    if (result && result.apiKey) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ API Key Created",
        text2: "New API key generated successfully",
      });
      
      // Refresh the keys list
      await fetchApiKeys();
      
      // Clear the input
      setNewKeyExpire("");
      
      // Return the result so the component can display the key
      return result;
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "❌ Creation Failed",
        text2: "Failed to create API key",
      });
      return null;
    }
  } catch (error) {
    console.error("Error creating API key:", error);
    Toast.show({
      type: "error",
      position: "top",
      text1: "❌ Creation Failed",
      text2: "An error occurred while creating the key",
    });
    return null;
  }
};

  const handleExpireKey = async (prefix: string) => {
    const result = await expireAPIKey(prefix);
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Key Expired",
        text2: "API Key Expired Successfully",
      });
      await fetchApiKeys();
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Failed to Expire Key",
        text2: "Failed to expire API key.",
      });
    }
  };

  const isExpired = (expiration: string) => {
    const now = new Date();
    const exp = new Date(expiration).getTime();
    return exp < now.getTime();
  };

  return {
    apiKeys,
    newKeyExpire,
    setNewKeyExpire,
    activeKeyExpire,
    loading,
    fetchApiKeys,
    handleCreateKey,
    handleExpireKey,
    isExpired,
  };
}
