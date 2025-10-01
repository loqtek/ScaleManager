import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoRowProps } from "../types";
import { copyToClipboard } from "../utils/deviceUtils";

export const InfoRow: React.FC<InfoRowProps> = ({ 
  label, 
  value, 
  copyable = false, 
  onEdit 
}) => (
  <View className="mb-4">
    <View className="flex-row justify-between items-center mb-1">
      <Text className="text-slate-400 text-sm font-medium">{label}:</Text>
      <View className="flex-row space-x-2">
        {copyable && (
          <TouchableOpacity onPress={() => copyToClipboard(value, label)}>
            <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
          </TouchableOpacity>
        )}
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <MaterialIcons name="edit" size={16} color="#60a5fa" />
          </TouchableOpacity>
        )}
      </View>
    </View>
    <View className="bg-zinc-700 p-3 rounded-lg">
      <Text className="text-white font-mono text-sm" selectable>
        {value || "N/A"}
      </Text>
    </View>
  </View>
);
