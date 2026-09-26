import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme";

function Bar({ width }: { width: `${number}%` }) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height: 12,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.colors.skeleton,
          marginBottom: theme.spacing.sm,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ScreenLoading({ label }: { label: string }) {
  const { theme } = useTheme();
  const { colors, radii, spacing } = theme;

  return (
    <View className="flex-1 justify-center px-4">
      {[0, 1, 2].map((item) => (
        <View
          key={item}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: radii.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
          }}
        >
          <Bar width="46%" />
          <Bar width="72%" />
        </View>
      ))}
      <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: spacing.sm }}>
        {label}
      </Text>
    </View>
  );
}
