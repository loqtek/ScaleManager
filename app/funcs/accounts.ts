import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { testAPIKey } from "../api/login";

export type HeadscaleVersion = "0.23.x" | "0.24.x" | "0.25.x" | "0.26.x";

interface ServerAccount {
  name: string;
  server: string;
  apiKey: string;
  addedOn: string;
  version: HeadscaleVersion;
}

interface AddAccountParams {
  customName: string;
  server: string;
  apiKey: string;
  version: HeadscaleVersion;
  onSuccess?: () => void;
  onFail?: () => void;
}

export function useAccountsManager() {
  const [accounts, setAccounts] = useState<ServerAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      const serversJson = await AsyncStorage.getItem("servers");
      if (serversJson) {
        const parsedAccounts = JSON.parse(serversJson);
        // Ensure backward compatibility - add default version if missing
        const accountsWithVersion = parsedAccounts.map((account: any) => ({
          ...account,
          version: account.version || "0.26.x" as HeadscaleVersion
        }));
        setAccounts(accountsWithVersion);
      }
    };
    fetchAccounts();
  }, []);

  const handleSelectAccount = async (accountName: string) => {
    try {
      await AsyncStorage.setItem("selectedServer", accountName);
      router.replace("/");
    } catch (error) {
      console.error("Error selecting account:", error);
    }
  };

  const handleRemoveAccount = async (accountName: string) => {
    const serversJson = await AsyncStorage.getItem("servers");
    if (!serversJson) return;

    const servers = JSON.parse(serversJson);
    const filtered = servers.filter((s: ServerAccount) => s.name !== accountName);
    await AsyncStorage.setItem("servers", JSON.stringify(filtered));

    const selectedServer = await AsyncStorage.getItem("selectedServer");
    if (selectedServer === accountName) {
      await AsyncStorage.removeItem("selectedServer");
      if (filtered.length > 0) {
        await AsyncStorage.setItem("selectedServer", filtered[0].name);
      }
    }

    Toast.show({
      type: "success",
      position: "top",
      text1: "✅ Account Removed",
      text2: `Account "${accountName}" has been removed.`,
    });

    setAccounts(filtered);
    if (filtered.length === 0) router.replace("/");
  };

  const handleAddAccount = async ({
    customName,
    server,
    apiKey,
    version,
    onSuccess,
    onFail,
  }: AddAccountParams) => {
    if (!server || !apiKey || !customName) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Input Required",
        text2: "Fill out name, server and API key.",
      });
      if (onFail) onFail();
      return;
    }

    if (!server.startsWith("http://") && !server.startsWith("https://")) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Server URL",
        text2: "Must start with http:// or https://",
      });
      if (onFail) onFail();
      return;
    }

    const existing = await AsyncStorage.getItem("servers");
    let parsed: ServerAccount[] = [];
    if (existing) {
      try {
        parsed = JSON.parse(existing);
      } catch (e) {
        console.warn("Failed to parse saved servers:", e);
      }
    }

    const nameTaken = parsed.some(
      (item) =>
        item.name.trim().toLowerCase() === customName.trim().toLowerCase()
    );
    const serverTaken = parsed.some(
      (item) => item.server.trim() === server.trim()
    );

    if (nameTaken || serverTaken) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "❌ Duplicate Entry",
        text2: nameTaken
          ? "That name is already taken."
          : "That server is already added.",
      });
      if (onFail) onFail();
      return;
    }

    setLoading(true);
    
    let isValid = false;
    // temp for apple login demo, will do nothing
    if (server === "https://appledemo.login.ieouiudhmpac.com" && apiKey === "WlEB2D3t4fdash89LQW65KDsaD9oq0d2npso78uJolmOod2jp7") {
      isValid = true;
    } else {
      isValid = await testAPIKey(server, apiKey);
    }
    
    setLoading(false);

    if (!isValid) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid API Key",
        text2: "Check the key and try again.",
      });
      if (onFail) onFail();
      return;
    }

    const newEntry: ServerAccount = {
      name: customName.trim(),
      server: server.trim(),
      apiKey: apiKey.trim(),
      addedOn: new Date().toISOString(),
      version: version,
    };

    const updated = [...parsed, newEntry];
    await AsyncStorage.setItem("servers", JSON.stringify(updated));
    setAccounts(updated);
    await AsyncStorage.setItem("selectedServer", newEntry.name);

    Toast.show({
      type: "success",
      text1: "✅ Connected",
      text2: "Account added successfully.",
    });

    if (onSuccess) onSuccess();
    router.push("/(tabs)");
  };

  const updateAccountVersion = async (accountName: string, newVersion: HeadscaleVersion) => {
    const serversJson = await AsyncStorage.getItem("servers");
    if (!serversJson) return;

    const servers: ServerAccount[] = JSON.parse(serversJson);
    const updated = servers.map(server => 
      server.name === accountName 
        ? { ...server, version: newVersion }
        : server
    );

    await AsyncStorage.setItem("servers", JSON.stringify(updated));
    setAccounts(updated);

    Toast.show({
      type: "success",
      position: "top",
      text1: "✅ Version Updated",
      text2: `${accountName} updated to ${newVersion}`,
    });
  };

  return {
    accounts,
    loading,
    handleSelectAccount,
    handleRemoveAccount,
    handleAddAccount,
    updateAccountVersion,
    setLoading,
  };
}