
import { useEffect, useState } from "react";
import { getServerRoutes, disableRoute, enableRoute } from "../api/routes";
import Toast from "react-native-toast-message";



export function useRoutes() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    try {
      const data = await getServerRoutes();
      if (data?.routes) {
        setRoutes(data.routes);
      } else {
        console.error("No routes found in response");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDisableRoute = async (routeid: string) => {
    const result = await disableRoute(routeid);

    if (result.code) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Failed to Disable Route",
        text2: result.message,
      });
    }
    else if (result) {
        Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Route Disabled",
        text2: "Route Disabled Successfully",
      });
      fetchRoutes();

    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Failed to Disable Route",
        text2: "Failed to disable that route.",
      });
    }

  };

  const handleEnableRoute = async (routeid: string) => {
    const result = await enableRoute(routeid);
    if (result.code) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Failed to Enable Route",
        text2: result.message,
      });
    }
    else if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Route Enabled",
        text2: "Route Enabled Successfully",
      });
      fetchRoutes();
    }
    else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Failed to Enable Route",
        text2: "Failed to Enable that route.",
      });
    }
  };


  return {
    handleDisableRoute,
    handleEnableRoute,
    routes,
    setRoutes,
    loading,
    setLoading,
    fetchRoutes
  };
}
