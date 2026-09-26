import { TextStyle } from "react-native";

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export type TypeToken = Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">;

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeight.bold,
  },
  subheading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight.regular,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeight.medium,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
  },
} as const satisfies Record<string, TypeToken>;
