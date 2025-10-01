import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { User } from "../types";

interface UserSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (userName: string) => void;
}

export const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  visible,
  onClose,
  users,
  onSelectUser,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/20">
        <View className="bg-zinc-800 rounded-xl p-4 w-4/5 max-h-96">
          <Text className="text-white text-lg font-semibold mb-4">Select User</Text>
          <ScrollView>
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => onSelectUser(user.name)}
                className="py-3 border-b border-zinc-700"
              >
                <Text className="text-white">{user.name}</Text>
                {user.displayName && (
                  <Text className="text-slate-400 text-sm">{user.displayName}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            className="bg-gray-600 py-2 rounded mt-4"
          >
            <Text className="text-white text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
