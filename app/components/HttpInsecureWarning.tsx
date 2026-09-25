import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const WAIT_SECONDS = 5;

export function isInsecureHttpUrl(server: string): boolean {
  return server.trim().toLowerCase().startsWith("http://");
}

export function useHttpRiskAck(server: string) {
  const insecure = isInsecureHttpUrl(server);
  const [acknowledged, setAcknowledged] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WAIT_SECONDS);

  useEffect(() => {
    setAcknowledged(false);
    if (!insecure) {
      setSecondsLeft(0);
      return;
    }

    setSecondsLeft(WAIT_SECONDS);
    const started = Date.now();
    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        WAIT_SECONDS - Math.floor((Date.now() - started) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 200);

    return () => clearInterval(timer);
  }, [insecure]);

  const canProceed = !insecure || (acknowledged && secondsLeft === 0);

  const toggleAcknowledged = () => {
    if (secondsLeft > 0) return;
    setAcknowledged((current) => !current);
  };

  return {
    insecure,
    acknowledged,
    secondsLeft,
    canProceed,
    toggleAcknowledged,
  };
}

export function HttpInsecureWarning({
  insecure,
  acknowledged,
  secondsLeft,
  onToggle,
}: {
  insecure: boolean;
  acknowledged: boolean;
  secondsLeft: number;
  onToggle: () => void;
}) {
  if (!insecure) return null;

  const locked = secondsLeft > 0;

  return (
    <View className="mt-3 rounded-md border border-amber-600 bg-amber-950 p-3">
      <Text className="text-sm leading-5 text-amber-100">
        HTTP does not encrypt traffic. By checking this box you understand that
        this risks your admin API token and is insecure. Please only proceed
        with caution and ensure you understand the risks.
      </Text>
      <TouchableOpacity
        onPress={onToggle}
        disabled={locked}
        activeOpacity={locked ? 1 : 0.7}
        className="mt-3 flex-row items-start"
      >
        <MaterialIcons
          name={acknowledged ? "check-box" : "check-box-outline-blank"}
          size={22}
          color={locked ? "#78716c" : "#fbbf24"}
        />
        <Text
          className={`ml-2 flex-1 text-sm ${
            locked ? "text-stone-400" : "text-amber-50"
          }`}
        >
          {locked
            ? `Read the warning before continuing (${secondsLeft}s)`
            : "I understand the risk and want to continue over HTTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
