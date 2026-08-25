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
        <View className="flex-1 justify-center items-center px-4 bg-black/20">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="w-full max-w-md"
          >
            <View className="bg-zinc-800 rounded-xl p-6">
              <Text className="text-white text-xl font-bold mb-2 text-center">
                {isV029 ? "Register / Auth" : "Register Device"}
              </Text>
              {isV029 && (
                <Text className="text-slate-400 text-xs text-center mb-4">
                  v0.29 uses auth IDs. Paste an auth ID or a full{" "}
                  <Text className="text-slate-200 font-mono">headscale auth …</Text>{" "}
                  command.
                </Text>
              )}

              {/* User Selection */}
              <Text className="text-slate-300 text-sm mb-2">Select User:</Text>
              {users.length > 0 ? (
                <ScrollView
                  className="max-h-40 mb-4"
                  keyboardShouldPersistTaps="handled"
                >
                  {users.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      onPress={() => onSelectUser(user)}
                      className={`p-3 rounded-lg mb-2 ${
                        selectedUser?.id === user.id
                          ? "bg-blue-600"
                          : "bg-zinc-700"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedUser?.id === user.id
                            ? "text-white"
                            : "text-slate-300"
                        }`}
                      >
                        {user.name}
                      </Text>
                      <Text
                        className={`text-xs ${
                          selectedUser?.id === user.id
                            ? "text-blue-200"
                            : "text-slate-400"
                        }`}
                      >
                        ID: {user.id}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View className="bg-zinc-700 rounded-lg p-3 mb-4">
                  <Text className="text-slate-400 text-sm text-center">
                    No users available. Please add a user first.
                  </Text>
                </View>
              )}

              {/* Key / Auth ID Input */}
              <Text className="text-slate-300 text-sm mb-2">
                {isV029 ? "Auth ID or command:" : "Device Key:"}
              </Text>
              <TextInput
                className="bg-zinc-700 text-white p-3 rounded-lg mb-2"
                placeholder={
                  isV029
                    ? "auth-id or: headscale auth register --user … --auth-id …"
                    : "Enter key or full headscale nodes register command"
                }
                placeholderTextColor="#94a3b8"
                value={deviceKey}
                onChangeText={onKeyChange}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />
              {isV029 && (
                <Text className="text-slate-500 text-xs mb-4">
                  Examples:{"\n"}
                  headscale auth register --user alice --auth-id …{"\n"}
                  headscale auth approve --auth-id …{"\n"}
                  headscale auth reject --auth-id …
                </Text>
              )}

              {/* Buttons */}
              <View className="flex-row space-x-3 mb-3">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 bg-zinc-600 py-3 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRegister}
                  className="flex-1 bg-blue-600 py-3 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              {isV029 && onApprove && onReject && (
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={onApprove}
                    className="flex-1 bg-green-700 py-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-medium">
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onReject}
                    className="flex-1 bg-red-700 py-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-medium">
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
