import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoRowProps } from "../types";
import { copyToClipboard } from "../utils/deviceUtils";
import { useTheme } from "@/theme";

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  copyable = false,
  onEdit
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-sm font-medium" style={{ color: colors.textMuted }}>{label}:</Text>
        <View className="flex-row space-x-2">
          {copyable && (
            <TouchableOpacity onPress={() => copyToClipboard(value, label)} activeOpacity={0.7}>
              <MaterialIcons name="content-copy" size={16} color={colors.primaryMuted} />
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
              <MaterialIcons name="edit" size={16} color={colors.primaryMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceMuted }}>
        <Text className="font-mono text-sm" style={{ color: colors.text }} selectable>
          {value || "N/A"}
        </Text>
      </View>
    </View>
  );
};
