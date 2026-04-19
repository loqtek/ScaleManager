import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <Toast
        position="top"
        topOffset={80}
        visibilityTime={5000}
        autoHide={true}
      />
    </SafeAreaProvider>
  )
}
