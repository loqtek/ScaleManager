import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";

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
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/20">
        <View className="bg-zinc-800 rounded-xl p-4 w-4/5">
          <Text className="text-white text-lg font-semibold mb-4">Add Tags</Text>
          <TextInput
            className="bg-zinc-700 text-white p-3 rounded-lg mb-4"
            value={newTags}
            onChangeText={setNewTags}
            placeholder="Enter tags separated by commas or spaces"
            placeholderTextColor="#94a3b8"
            multiline
          />
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={onAddTags}
              className="flex-1 bg-yellow-600 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">Add Tags</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-600 py-3 rounded-lg"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
