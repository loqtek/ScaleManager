import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/theme";
import { installFrontendLogger } from "./utils/frontendLog";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  type ToastConfig,
} from "react-native-toast-message";
import "../global.css";

installFrontendLogger();

function ThemedChrome() {
  const { theme } = useTheme();
  const toastBaseStyle = {
    height: null as unknown as number,
    minHeight: 60,
    paddingVertical: theme.spacing.md,
    width: "90%" as const,
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 4,
  };

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={[toastBaseStyle, { borderLeftColor: theme.colors.success }]}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
        text1Style={{ color: theme.colors.text }}
        text2Style={{ flexWrap: "wrap", color: theme.colors.textSecondary }}
        text1NumberOfLines={2}
        text2NumberOfLines={0}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={[toastBaseStyle, { borderLeftColor: theme.colors.error }]}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
        text1Style={{ color: theme.colors.text }}
        text2Style={{ flexWrap: "wrap", color: theme.colors.textSecondary }}
        text1NumberOfLines={2}
        text2NumberOfLines={0}
      />
    ),
    info: (props) => (
      <InfoToast
        {...props}
        style={[toastBaseStyle, { borderLeftColor: theme.colors.primaryMuted }]}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
        text1Style={{ color: theme.colors.text }}
        text2Style={{ flexWrap: "wrap", color: theme.colors.textSecondary }}
        text1NumberOfLines={2}
        text2NumberOfLines={0}
      />
    ),
  };

  return (
    <>
      <StatusBar style={theme.scheme === "dark" ? "light" : "dark"} />
      <Slot />
      <Toast
        config={toastConfig}
        position="top"
        topOffset={80}
        visibilityTime={5000}
        autoHide={true}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedChrome />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
