import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getServerConfig() {
  const selectedName = await AsyncStorage.getItem("selectedServer");
  const serversJson = await AsyncStorage.getItem("servers");
  console.log(serversJson)
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

// takes 1d, 1m, 1y etc into google protobuf timestamp
export function generateTimestamp(
  duration: string, 
  fromDate: Date = new Date()
): { seconds: string; nanos: number } {
  // Parse the duration string
  const match = duration.match(/^(\d+)([smhdy])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}. Use format like "1d", "30m", "2y"`);
  }

  const amount = parseInt(match[1]);
  const unit = match[2];

  // Calculate milliseconds to add based on unit
  let millisecondsToAdd: number;
  
  switch (unit) {
    case 's': // seconds
      millisecondsToAdd = amount * 1000;
      break;
    case 'm': // minutes
      millisecondsToAdd = amount * 60 * 1000;
      break;
    case 'h': // hours
      millisecondsToAdd = amount * 60 * 60 * 1000;
      break;
    case 'd': // days
      millisecondsToAdd = amount * 24 * 60 * 60 * 1000;
      break;
    case 'y': // years (approximate - 365.25 days)
      millisecondsToAdd = amount * 365.25 * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error(`Unsupported unit: ${unit}. Use s, m, h, d, or y`);
  }

  // Calculate the target date
  const targetDate = new Date(fromDate.getTime() + millisecondsToAdd);
  
  // Convert to protobuf timestamp format
  const seconds = Math.floor(targetDate.getTime() / 1000);
  const nanos = (targetDate.getTime() % 1000) * 1000000; // Convert remaining ms to nanoseconds

  return {
    seconds: seconds.toString(),
    nanos: nanos
  };
}