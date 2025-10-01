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

interface RegisterDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  users: any[];
  selectedUser: any;
  onSelectUser: (user: any) => void;
  deviceKey: string;
  onKeyChange: (key: string) => void;
  onRegister: () => void;
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
}) => {
  const handleRegister = () => {
    if (!selectedUser) {
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
        text1: "⚠️ No Key",
        text2: "Please enter a device key",
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
              <Text className="text-white text-xl font-bold mb-4 text-center">
                Register Device
              </Text>

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

              {/* Key Input */}
              <Text className="text-slate-300 text-sm mb-2">Device Key:</Text>
              <TextInput
                className="bg-zinc-700 text-white p-3 rounded-lg mb-4"
                placeholder="Enter pre-auth key or full headscale command"
                placeholderTextColor="#94a3b8"
                value={deviceKey}
                onChangeText={onKeyChange}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Buttons */}
              <View className="flex-row space-x-3">
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
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

