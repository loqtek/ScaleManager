import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getServerConfig() {
  const selectedName = await AsyncStorage.getItem("selectedServer");
  const serversJson = await AsyncStorage.getItem("servers");

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
