import { useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoutes } from "@/app/funcs/routes";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

export default function RoutesScreen() {
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
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading Routes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4">Loading Routes...</Text>
        </View>
      ) : (
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View className="mb-4 flex-row justify-end items-center">

          <TouchableOpacity onPress={fetchRoutes}>
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {routes.length === 0 && (
          <Text className="text-slate-300 text-center mt-10">
            No routes found.
          </Text>
        )}

        {routes.map((route: any) => (
          <View
            key={route.id}
            className={`bg-zinc-800 p-4 rounded-xl mb-4 border ${route.enabled ? "border-green-500" : "border-zinc-700"
              }`}
          >
            <Text className="text-white text-lg font-semibold mb-2">
              {route.prefix}
            </Text>

            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-300">Advertised:</Text>
              <Text className="text-slate-100 font-semibold">
                {route.advertised ? "✅ Yes" : "❌ No"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-300">Enabled:</Text>
              <Text className="text-slate-100 font-semibold">
                {route.enabled ? "✅ Yes" : "❌ No"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-300">Primary:</Text>
              <Text className="text-slate-100 font-semibold">
                {route.isPrimary ? "🌟 Primary" : "—"}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-300">Created:</Text>
              <Text className="text-slate-100">
                {formatDate(route.createdAt)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-1">
              <Text className="text-slate-300">Updated:</Text>
              <Text className="text-slate-100">
                {formatDate(route.updatedAt)}
              </Text>
            </View>

            <View className="flex-row justify-end gap-4 mt-4">
              <TouchableOpacity
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
                <MaterialIcons name="check-box" size={20} color="#60a5fa" />
              </TouchableOpacity>
              <TouchableOpacity
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
                <MaterialIcons name="disabled-by-default" size={20} color="#f87171" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
