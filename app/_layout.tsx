import { Slot } from "expo-router";
import "../global.css";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Slot />
      <Toast
        position="top"
        topOffset={80}
        visibilityTime={5000}
        autoHide={true}
      />
    </>
  )
}
