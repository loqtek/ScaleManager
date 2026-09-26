import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@/theme";

interface TagsModalProps {
  visible: boolean;
  onClose: () => void;
  newTags: string;
  setNewTags: (tags: string) => void;
  onAddTags: () => void;
}

export const TagsModal: React.FC<TagsModalProps> = ({
  visible,
  onClose,
  newTags,
  setNewTags,
  onAddTags,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.overlay }}>
        <View className="rounded-xl p-4 w-4/5" style={{ backgroundColor: colors.surface }}>
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Add Tags</Text>
          <TextInput
            className="p-3 rounded-lg mb-4"
            style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
            value={newTags}
            onChangeText={setNewTags}
            placeholder="Enter tags separated by commas or spaces"
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={onAddTags}
              activeOpacity={0.8}
              className="flex-1 py-3 rounded-lg"
              style={{ backgroundColor: colors.warning }}
            >
              <Text className="font-semibold text-center" style={{ color: colors.background }}>Add Tags</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="flex-1 py-3 rounded-lg"
              style={{ backgroundColor: colors.secondary }}
            >
              <Text className="text-center" style={{ color: colors.onSecondary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
