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
    if (!newKeyExpire) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Expiration Time Required",
        text2: "Please provide an expiration time (e.g. 24h or 7d)",
      });
      return;
    }

    const regex = /^(0|[1-9]\d*)([smhd])$/;
    if (!regex.test(newKeyExpire)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Expiration Time",
        text2: "Please enter a valid expiration time (e.g. 24h, 7d)",
      });
      return;
    }

    const expirationDate = calculateExpirationDate(newKeyExpire);
    if (!expirationDate) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Expiration Time",
        text2: "Failed to calculate expiration date.",
      });
      return;
    }

    const result = await createAPIKey(expirationDate);
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Key Created",
        text2: "API Key Created Successfully",
      });
      setNewKeyExpire("");
      await fetchApiKeys();
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Failed to Create Key",
        text2: "Failed to create API key.",
      });
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
