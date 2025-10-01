import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getServerConfig() {
  const selectedName = await AsyncStorage.getItem("selectedServer");
  const serversJson = await AsyncStorage.getItem("servers");
  //console.log(serversJson)
  if (!selectedName || !serversJson) return null;

  try {
    const servers = JSON.parse(serversJson);
    const config = servers.find(s => s.name === selectedName);
    return config || null;
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
