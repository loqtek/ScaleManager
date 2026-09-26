import React from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Toast from "react-native-toast-message";
import { isV029OrHigher } from "../utils/headscaleVersion";
import { useTheme } from "@/theme";

interface RegisterDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  users: any[];
  selectedUser: any;
  onSelectUser: (user: any) => void;
  deviceKey: string;
  onKeyChange: (key: string) => void;
  onRegister: () => void;
  serverVersion?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({
  visible,
  onClose,
  users,
  selectedUser,
  onSelectUser,
  deviceKey,
  onKeyChange,
  onRegister,
  serverVersion,
  onApprove,
  onReject,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const isV029 = isV029OrHigher(serverVersion);

  const handleRegister = () => {
    if (!selectedUser && !/headscale\s+auth\s+(approve|reject)/i.test(deviceKey)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ No User Selected",
        text2: "Please select a user first",
      });
      return;
    }
    if (!deviceKey.trim()) {
      Toast.show({
        type: "error",
        position: "top",
        text1: isV029 ? "⚠️ No Auth ID" : "⚠️ No Key",
        text2: isV029
          ? "Enter an auth ID or paste a headscale auth command"
          : "Please enter a device key",
      });
      return;
    }
    onRegister();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: colors.overlay }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="w-full max-w-md"
          >
            <View className="rounded-xl p-6" style={{ backgroundColor: colors.surface }}>
              <Text className="text-xl font-bold mb-2 text-center" style={{ color: colors.text }}>
                {isV029 ? "Register / Auth" : "Register Device"}
              </Text>
              {isV029 && (
                <Text className="text-xs text-center mb-4" style={{ color: colors.textMuted }}>
                  v0.29 uses auth IDs. Paste an auth ID or a full{" "}
                  <Text className="font-mono" style={{ color: colors.textSecondary }}>headscale auth …</Text>{" "}
                  command.
                </Text>
              )}

              <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>Select User:</Text>
              {users.length > 0 ? (
                <ScrollView
                  className="max-h-60 mb-4"
                  keyboardShouldPersistTaps="handled"
                >
                  {users.map((user) => {
                    const selected = selectedUser?.id === user.id;
                    return (
                      <TouchableOpacity
                        key={user.id}
                        onPress={() => onSelectUser(user)}
                        activeOpacity={0.8}
                        className="p-3 rounded-lg mb-2"
                        style={{ backgroundColor: selected ? colors.primary : colors.surfaceMuted }}
                      >
                        <Text className="font-medium" style={{ color: selected ? colors.onPrimary : colors.textSecondary }}>
                          {user.name}
                        </Text>
                        <Text className="text-xs" style={{ color: selected ? colors.onPrimary : colors.textMuted }}>
                          ID: {user.id}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <View className="rounded-lg p-3 mb-4" style={{ backgroundColor: colors.surfaceMuted }}>
                  <Text className="text-sm text-center" style={{ color: colors.textMuted }}>
                    No users available. Please add a user first.
                  </Text>
                </View>
              )}

              <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                {isV029 ? "Auth ID or command:" : "Device Key:"}
              </Text>
              <TextInput
                className="p-3 rounded-lg mb-2"
                style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                placeholder={
                  isV029
                    ? "auth-id or: headscale auth register --user … --auth-id …"
                    : "Enter key or full headscale nodes register command"
                }
                placeholderTextColor={colors.textMuted}
                value={deviceKey}
                onChangeText={onKeyChange}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />
              {isV029 && (
                <Text className="text-xs mb-4" style={{ color: colors.muted }}>
                  Examples:{"\n"}
                  headscale auth register --user alice --auth-id …{"\n"}
                  headscale auth approve --auth-id …{"\n"}
                  headscale auth reject --auth-id …
                </Text>
              )}

              <View className="flex-row space-x-3 mb-3">
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.8}
                  className="flex-1 py-3 rounded-lg"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <Text className="text-center font-medium" style={{ color: colors.onSecondary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRegister}
                  activeOpacity={0.8}
                  className="flex-1 py-3 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-center font-medium" style={{ color: colors.onPrimary }}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              {isV029 && onApprove && onReject && (
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={onApprove}
                    activeOpacity={0.8}
                    className="flex-1 py-3 rounded-lg"
                    style={{ backgroundColor: colors.success }}
                  >
                    <Text className="text-center font-medium" style={{ color: colors.onPrimary }}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onReject}
                    activeOpacity={0.8}
                    className="flex-1 py-3 rounded-lg"
                    style={{ backgroundColor: colors.error }}
                  >
                    <Text className="text-center font-medium" style={{ color: colors.onPrimary }}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
