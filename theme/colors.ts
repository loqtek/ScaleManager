export type ThemeColors = {
  primary: string;
  primaryPressed: string;
  primaryMuted: string;
  primarySoft: string;
  onPrimary: string;
  secondary: string;
  secondaryPressed: string;
  onSecondary: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  error: string;
  errorSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  muted: string;
  overlay: string;
  skeleton: string;
  tabBar: string;
  tabBarBorder: string;
  tabBarInactive: string;
};

const blue = {
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
} as const;

const zinc = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
} as const;

const slate = {
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
} as const;

export const darkColors: ThemeColors = {
  primary: blue[600],
  primaryPressed: blue[700],
  primaryMuted: blue[400],
  primarySoft: "rgba(37, 99, 235, 0.16)",
  onPrimary: "#ffffff",
  secondary: zinc[700],
  secondaryPressed: zinc[600],
  onSecondary: slate[200],
  background: zinc[900],
  surface: zinc[800],
  surfaceMuted: zinc[700],
  text: "#ffffff",
  textSecondary: slate[300],
  textMuted: slate[400],
  border: zinc[700],
  error: "#f87171",
  errorSoft: "rgba(248, 113, 113, 0.16)",
  success: "#10b981",
  successSoft: "rgba(16, 185, 129, 0.16)",
  warning: "#fbbf24",
  muted: slate[500],
  overlay: "rgba(0, 0, 0, 0.5)",
  skeleton: zinc[700],
  tabBar: zinc[800],
  tabBarBorder: zinc[700],
  tabBarInactive: zinc[400],
};

export const lightColors: ThemeColors = {
  primary: blue[600],
  primaryPressed: blue[700],
  primaryMuted: blue[500],
  primarySoft: "rgba(37, 99, 235, 0.1)",
  onPrimary: "#ffffff",
  secondary: zinc[100],
  secondaryPressed: zinc[200],
  onSecondary: zinc[900],
  background: zinc[100],
  surface: "#ffffff",
  surfaceMuted: zinc[100],
  text: zinc[900],
  textSecondary: slate[600],
  textMuted: slate[500],
  border: zinc[200],
  error: "#dc2626",
  errorSoft: "rgba(220, 38, 38, 0.1)",
  success: "#059669",
  successSoft: "rgba(5, 150, 105, 0.1)",
  warning: "#d97706",
  muted: slate[400],
  overlay: "rgba(24, 24, 27, 0.4)",
  skeleton: zinc[200],
  tabBar: "#ffffff",
  tabBarBorder: zinc[200],
  tabBarInactive: zinc[400],
};
