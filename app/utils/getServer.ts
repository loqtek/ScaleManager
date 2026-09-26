import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeApiKey } from "./apiKeyUtils";

export async function getServerConfig() {
  const selectedName = await AsyncStorage.getItem("selectedServer");
  const serversJson = await AsyncStorage.getItem("servers");
  //console.log(serversJson)
  if (!selectedName || !serversJson) return null;

  try {
    const servers = JSON.parse(serversJson);
    const config = servers.find((s: { name: string }) => s.name === selectedName);
    if (!config) return null;
    return {
      ...config,
      apiKey: normalizeApiKey(config.apiKey ?? ""),
    };
  } catch (err) {
    console.error("Error parsing server config:", err);
    return null;
  }
}


export function parseVersion(version: string): string {
  return version.replace(/^v/, "")        // drop leading "v"
                .replace(/\.$/, "")       // drop trailing "."
                .split(".")               // split parts
                .slice(0, 2)              // keep major.minor
                .join(".");
}
