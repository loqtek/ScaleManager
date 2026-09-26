import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { User } from "../types";
import { useTheme } from "@/theme";

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
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.overlay }}>
        <View className="rounded-xl p-4 w-4/5 max-h-96" style={{ backgroundColor: colors.surface }}>
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Select User</Text>
          <ScrollView>
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => onSelectUser(user.name)}
                activeOpacity={0.7}
                className="py-3 border-b"
                style={{ borderBottomColor: colors.border }}
              >
                <Text style={{ color: colors.text }}>{user.name}</Text>
                {user.displayName && (
                  <Text className="text-sm" style={{ color: colors.textMuted }}>{user.displayName}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="py-2 rounded mt-4"
            style={{ backgroundColor: colors.secondary }}
          >
            <Text className="text-center" style={{ color: colors.onSecondary }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
