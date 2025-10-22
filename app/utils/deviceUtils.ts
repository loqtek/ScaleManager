import { Clipboard } from "react-native";
import Toast from "react-native-toast-message";

export const formatDate = (dateString: string | null) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Never";
  }
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return "Invalid Date";
  }
};

export const getTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return "Unknown";
  }
};

export const copyToClipboard = async (text: string, label: string) => {
  try {
    await Clipboard.setString(text);
    Toast.show({
      type: "success",
      position: "top",
      text1: "Copied!",
      text2: `${label} copied to clipboard`,
    });
  } catch (error) {
    Toast.show({
      type: "error",
      position: "top",
      text1: "Copy Failed",
      text2: "Could not copy to clipboard",
    });
    console.error(error)
  }
};

export const getVersionInfo = async () => {
  const { getApiEndpoints } = await import("./apiUtils");
  const config = await getApiEndpoints();
  if (!config) return null;

  const { serverConf } = config;
  const versionKey = serverConf.version ? `v${serverConf.version.split('.').slice(0, 2).join('.')}` : 'v0.26';
  const isV026OrHigher = versionKey >= 'v0.26';
  
  return { versionKey, isV026OrHigher };
};
