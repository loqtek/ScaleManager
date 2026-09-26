import { Platform, ViewStyle } from "react-native";

type ShadowToken = ViewStyle;

function elevation(height: number, opacity: number, radius: number, android: number): ShadowToken {
  return Platform.select({
    ios: {
      shadowColor: "#18181b",
      shadowOffset: { width: 0, height },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation: android },
    default: {
      shadowColor: "#18181b",
      shadowOffset: { width: 0, height },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  }) as ShadowToken;
}

export const shadows = {
  none: {} as ShadowToken,
  sm: elevation(1, 0.06, 3, 1),
  md: elevation(2, 0.08, 8, 3),
  lg: elevation(6, 0.12, 16, 6),
};
