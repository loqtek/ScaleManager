import { useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoutes } from "@/app/funcs/routes";
import { ScreenLoading } from "@/app/components/ScreenLoading";
import { useTheme } from "@/theme";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

export default function RoutesScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const {
    handleDisableRoute,
    handleEnableRoute,
    routes,
    loading,
    fetchRoutes
  } = useRoutes();

  const onRefresh = () => {
    fetchRoutes();
  };

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  if (loading) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
        <ScreenLoading label="Loading Routes..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        <View className="mb-4 flex-row justify-between items-center">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>Routes</Text>
          <TouchableOpacity onPress={fetchRoutes} activeOpacity={0.7}>
            <MaterialIcons name="refresh" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {routes.length === 0 && (
          <Text className="text-center mt-10" style={{ color: colors.textSecondary }}>
            No routes found.
          </Text>
        )}

        {routes.map((route: any) => (
          <View
            key={route.id}
            className="p-4 rounded-xl mb-4 border"
            style={{
              backgroundColor: colors.surface,
              borderColor: route.enabled ? colors.success : colors.border,
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>
              {route.prefix}
            </Text>

            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors.textSecondary }}>Advertised:</Text>
              <Text className="font-semibold" style={{ color: colors.text }}>
                {route.advertised ? "✅ Yes" : "❌ No"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors.textSecondary }}>Enabled:</Text>
              <Text className="font-semibold" style={{ color: colors.text }}>
                {route.enabled ? "✅ Yes" : "❌ No"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors.textSecondary }}>Primary:</Text>
              <Text className="font-semibold" style={{ color: colors.text }}>
                {route.isPrimary ? "🌟 Primary" : "—"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors.textSecondary }}>Created:</Text>
              <Text style={{ color: colors.text }}>
                {formatDate(route.createdAt)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text style={{ color: colors.textSecondary }}>Updated:</Text>
              <Text style={{ color: colors.text }}>
                {formatDate(route.updatedAt)}
              </Text>
            </View>

            <View className="flex-row justify-end gap-4 mt-4">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    "Enable Route",
                    `Are you sure you want to enable ${route.prefix}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Confirm Enable",
                        style: "destructive",
                        onPress: () => handleEnableRoute(route.id),
                      },
                    ]
                  )
                }
              >
                <MaterialIcons name="check-box" size={20} color={colors.primaryMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    "Disable Route",
                    `Are you sure you want to disable ${route.prefix}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Confirm Disable",
                        style: "destructive",
                        onPress: () => handleDisableRoute(route.id),
                      },
                    ]
                  )
                }
              >
                <MaterialIcons name="disabled-by-default" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
