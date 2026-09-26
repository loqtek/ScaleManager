import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/theme";

interface RoutesModalProps {
  visible: boolean;
  onClose: () => void;
  availableRoutes: string[];
  selectedRoutes: string[];
  setSelectedRoutes: (routes: string[]) => void;
  onApproveRoutes: () => void;
}

export const RoutesModal: React.FC<RoutesModalProps> = ({
  visible,
  onClose,
  availableRoutes,
  selectedRoutes,
  setSelectedRoutes,
  onApproveRoutes,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;

  const handleRouteToggle = (route: string) => {
    if (selectedRoutes.includes(route)) {
      setSelectedRoutes(selectedRoutes.filter(r => r !== route));
    } else {
      setSelectedRoutes([...selectedRoutes, route]);
    }
  };

  const handleClose = () => {
    setSelectedRoutes([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.overlay }}>
        <View className="rounded-xl p-4 w-4/5 max-h-120" style={{ backgroundColor: colors.surface }}>
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Approve Routes</Text>
          <Text className="text-sm mb-4" style={{ color: colors.textMuted }}>
            Select routes to approve from available routes:
          </Text>

          <ScrollView className="mb-4">
            {availableRoutes?.map((route, index) => {
              const selected = selectedRoutes.includes(route);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRouteToggle(route)}
                  activeOpacity={0.8}
                  className="flex-row items-center justify-between py-3 px-3 mb-2 rounded-lg border"
                  style={{
                    backgroundColor: selected ? colors.successSoft : colors.surfaceMuted,
                    borderColor: selected ? colors.success : "transparent",
                  }}
                >
                  <Text
                    className="font-mono text-sm flex-1"
                    style={{ color: selected ? colors.success : colors.text }}
                  >
                    {route}
                  </Text>
                  <MaterialIcons
                    name={selected ? "check-box" : "check-box-outline-blank"}
                    size={20}
                    color={selected ? colors.success : colors.muted}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedRoutes.length > 0 && (
            <View className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.surfaceMuted }}>
              <Text className="text-sm mb-1" style={{ color: colors.textMuted }}>Selected routes ({selectedRoutes.length}):</Text>
              <Text className="text-sm font-mono" style={{ color: colors.success }}>
                {selectedRoutes.join(", ")}
              </Text>
            </View>
          )}

          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={onApproveRoutes}
              disabled={selectedRoutes.length === 0}
              activeOpacity={0.8}
              className="flex-1 py-3 rounded-lg mx-2"
              style={{ backgroundColor: selectedRoutes.length > 0 ? colors.success : colors.secondary }}
            >
              <Text className="font-semibold text-center" style={{ color: selectedRoutes.length > 0 ? colors.onPrimary : colors.onSecondary }}>
                Approve {selectedRoutes.length > 0 ? `(${selectedRoutes.length})` : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.8}
              className="flex-1 py-3 rounded-lg mx-2"
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
