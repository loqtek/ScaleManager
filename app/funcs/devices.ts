import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDevices, registerDevice } from "../api/devices";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data.nodes);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const confirmAndRegister = async (username: string, key: string) => {
    const result = await registerDevice(username, key);

    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Device Registered",
        text2: "Device registered successfully!",
      });
      fetchDevices();
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Registration Failed",
        text2: "Failed to register device.",
      });
    }
  };

  const handleRegisterDevice = () => {
    Alert.prompt(
      "Register Device",
      "Enter The username you want to register the device under.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Next",
          onPress: (input) => {
            if (!input) return;
            let username = "";
            let preAuthKey = "";

            const fullCommandMatch = input.match(
              /headscale nodes register --user ([^\s]+) --key (mkey:[\w\d]+)/i
            );

            if (fullCommandMatch) {
              username = fullCommandMatch[1];
              preAuthKey = fullCommandMatch[2];
              confirmAndRegister(username, preAuthKey);
            } else {
              username = input;
              Alert.prompt(
                "Enter Key",
                "Enter the pre-auth key:",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Register",
                    onPress: async (key) => {
                      if (!key) return;
                      preAuthKey = key;
                      confirmAndRegister(username, preAuthKey);
                    },
                  },
                ],
                "plain-text"
              );
            }
          },
        },
      ],
      "plain-text"
    );
  };


  const handleDevicePress = (device) => {
    router.push({
      pathname: `/customScreens/${device.id}`,
      params: {
        device: JSON.stringify(device),
      },
    });
  };

  return {
    devices,
    loading,
    fetchDevices,
    handleRegisterDevice,
    handleDevicePress,
    router
  };
}