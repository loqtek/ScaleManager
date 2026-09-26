import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { testAPIKeyDetailed } from "../api/login";
import { normalizeApiKey } from "../utils/apiKeyUtils";
import { parseVersion } from "../utils/getServer";
import { isInsecureHttpUrl, useHttpRiskAck } from "../components/HttpInsecureWarning";

export type HeadscaleVersion = "0.23.x" | "0.24.x" | "0.25.x" | "0.26.x" | "0.27.x" | "0.28.x" | "0.29.x";

export function useLogin() {
  const router = useRouter();

  const [customName, setCustomName] = useState("");
  const [server, setServer] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [headscaleVersion, setHeadscaleVersion] = useState<HeadscaleVersion>("0.29.x");
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const httpRisk = useHttpRiskAck(server);

  // Toggle info display - close if same item clicked, open if different
  const toggleInfo = (field: string) => {
    setShowInfo(showInfo === field ? null : field);
  };

  const checkForPreviousKey = useCallback(async () => {
    setLoading(true);
    const selectedName = await AsyncStorage.getItem("selectedServer");
    const serversJson = await AsyncStorage.getItem("servers");

    if (!serversJson) {
      setLoading(false);
      return;
    }

    let servers: { name: string; server: string; apiKey: string }[] = [];
    try {
      servers = JSON.parse(serversJson);
    } catch (e) {
      console.warn("Failed to parse saved servers:", e);
      setLoading(false);
      return;
    }

    if (!Array.isArray(servers) || servers.length === 0) {
      setLoading(false);
      return;
    }

    // Try the selected server first, then the rest of the saved list.
    const ordered = selectedName
      ? [
          ...servers.filter((s) => s.name === selectedName),
          ...servers.filter((s) => s.name !== selectedName),
        ]
      : servers;

    for (const candidate of ordered) {
      const result = await testAPIKeyDetailed(candidate.server, candidate.apiKey);
      if (!result.ok) continue;

      const fellBack = Boolean(selectedName) && candidate.name !== selectedName;
      if (candidate.name !== selectedName) {
        await AsyncStorage.setItem("selectedServer", candidate.name);
      }

      Toast.show({
        type: fellBack ? "info" : "success",
        position: "top",
        text1: fellBack ? "Switched server" : "✅ Connected",
        text2: fellBack
          ? `"${selectedName}" failed the connection test. Connected to ${candidate.name}.`
          : `Connected to ${candidate.name}.`,
      });
      setLoading(false);
      router.push("/(tabs)");
      return;
    }

    setLoading(false);
  }, [router]);

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

    if (isInsecureHttpUrl(server) && !httpRisk.canProceed) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "HTTP confirmation required",
        text2: "Confirm you understand the risk before sending your API token over HTTP.",
      });
      return;
    }

    const normalizedKey = normalizeApiKey(apiKey);

    let authResult: Awaited<ReturnType<typeof testAPIKeyDetailed>>;
    // temp for apple login demo, will do nothing
    if (
      server === "https://appledemo.login.ieouiudhmpac.com" &&
      normalizedKey === "WlEB2D3t4fdash89LQW65KDsaD9oq0d2npso78uJolmOod2jp7"
    ) {
      authResult = { ok: true };
    } else {
      authResult = await testAPIKeyDetailed(server, normalizedKey);
    }

    if (!authResult.ok) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Connection Failed",
        text2: authResult.message || "Check your API key and try again.",
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
      apiKey: normalizedKey,
      addedOn: new Date().toISOString(),
      version: parseVersion(headscaleVersion)
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
      ...parsed.filter((item: { name: string }) => item.name !== newEntry.name),
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
    headscaleVersion,
    setHeadscaleVersion,
    showInfo,
    toggleInfo,
    loading,
    checkForPreviousKey,
    handleLogin,
    httpRisk,
  };
}