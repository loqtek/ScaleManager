import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { testAPIKey } from "../api/login";

export function useLogin() {
  const router = useRouter();

  const [customName, setCustomName] = useState("");
  const [server, setServer] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showInfo, setShowInfo] = useState("");
  const [loading, setLoading] = useState(true);

  const checkForPreviousKey = async () => {
    setLoading(true);
    const selectedName = await AsyncStorage.getItem("selectedServer");
    const serversJson = await AsyncStorage.getItem("servers");

    if (!selectedName || !serversJson) {
      setLoading(false);
      return;
    }

    const servers = JSON.parse(serversJson);
    const selected = servers.find(s => s.name === selectedName);

    if (!selected) {
      setLoading(false);
      return;
    }

    const isValid = await testAPIKey(selected.server, selected.apiKey);

    if (isValid) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Connected",
        text2: `Connected to ${selected.name}.`,
      });
      setLoading(false);
      router.push("/(tabs)");
    } else {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!server || !apiKey || !customName) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Input Required",
        text2: "Fill out name, server and API key.",
      });
      return;
    }

    if (!server.startsWith("http://") && !server.startsWith("https://")) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Server URL",
        text2: "Server URL must start with http:// or https://",
      });
      return;
    }
    let isValid = false
    // temp for apple login demo, will do nothing
    if (server === "https://appledemo.login.ieouiudhmpac.com" && apiKey ==="WlEB2D3t4fdash89LQW65KDsaD9oq0d2npso78uJolmOod2jp7"){
      isValid = true
    }else{
      isValid = await testAPIKey(server, apiKey);
    }

    if (!isValid) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid API Key",
        text2: "Check your API key and try again.",
      });
      return;
    }

    Toast.show({
      type: "success",
      position: "top",
      text1: "✅ Connected",
      text2: "Successfully connected to Headscale.",
    });

    const newEntry = {
      name: customName.trim(),
      server: server.trim(),
      apiKey: apiKey.trim(),
      addedOn: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem("servers");
    let parsed = [];
    if (existing) {
      try {
        parsed = JSON.parse(existing);
      } catch (e) {
        console.warn("Failed to parse saved servers:", e);
      }
    }

    const updated = [
      ...parsed.filter((item) => item.name !== newEntry.name),
      newEntry,
    ];

    await AsyncStorage.setItem("servers", JSON.stringify(updated));
    await AsyncStorage.setItem("selectedServer", newEntry.name);
    router.push("/(tabs)");
  };

  return {
    customName,
    setCustomName,
    server,
    setServer,
    apiKey,
    setApiKey,
    showInfo,
    setShowInfo,
    loading,
    checkForPreviousKey,
    handleLogin,
  };
}
