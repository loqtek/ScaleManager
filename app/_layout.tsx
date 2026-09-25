import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { installFrontendLogger } from "./utils/frontendLog";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  type ToastConfig,
} from "react-native-toast-message";
import "../global.css";

installFrontendLogger();

// Clear the library's fixed 60px height so long text2 messages can wrap fully.
const toastBaseStyle = {
  height: null as unknown as number,
  minHeight: 60,
  paddingVertical: 12,
  width: "90%" as const,
};

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={[toastBaseStyle, { borderLeftColor: "#69C779" }]}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1NumberOfLines={2}
      text2NumberOfLines={0}
      text2Style={{ flexWrap: "wrap" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={[toastBaseStyle, { borderLeftColor: "#FE6301" }]}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1NumberOfLines={2}
      text2NumberOfLines={0}
      text2Style={{ flexWrap: "wrap" }}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      style={[toastBaseStyle, { borderLeftColor: "#87CEFA" }]}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1NumberOfLines={2}
      text2NumberOfLines={0}
      text2Style={{ flexWrap: "wrap" }}
    />
  ),
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <Toast
        config={toastConfig}
        position="top"
        topOffset={80}
        visibilityTime={5000}
        autoHide={true}
      />
    </SafeAreaProvider>
  );
}
