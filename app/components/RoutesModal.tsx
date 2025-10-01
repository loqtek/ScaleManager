import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
      <View className="flex-1 justify-center items-center bg-black/20">
        <View className="bg-zinc-800 rounded-xl p-4 w-4/5 max-h-120">
          <Text className="text-white text-lg font-semibold mb-4">Approve Routes</Text>
          <Text className="text-slate-400 text-sm mb-4">
            Select routes to approve from available routes:
          </Text>
          
          <ScrollView className="mb-4">
            {availableRoutes?.map((route, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRouteToggle(route)}
                className={`flex-row items-center justify-between py-3 px-3 mb-2 rounded-lg ${
                  selectedRoutes.includes(route) ? 'bg-green-600/20 border border-green-500' : 'bg-zinc-700'
                }`}
              >
                <Text className={`font-mono text-sm flex-1 ${
                  selectedRoutes.includes(route) ? 'text-green-400' : 'text-white'
                }`}>
                  {route}
                </Text>
                <MaterialIcons 
                  name={selectedRoutes.includes(route) ? "check-box" : "check-box-outline-blank"} 
                  size={20} 
                  color={selectedRoutes.includes(route) ? "#10b981" : "#6b7280"} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedRoutes.length > 0 && (
            <View className="bg-zinc-700 p-3 rounded-lg mb-4">
              <Text className="text-slate-400 text-sm mb-1">Selected routes ({selectedRoutes.length}):</Text>
              <Text className="text-green-400 text-sm font-mono">
                {selectedRoutes.join(", ")}
              </Text>
            </View>
          )}
          
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={onApproveRoutes}
              disabled={selectedRoutes.length === 0}
              className={`flex-1 py-3 rounded-lg mx-2 ${
                selectedRoutes.length > 0 ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              <Text className="text-white font-semibold text-center">
                Approve {selectedRoutes.length > 0 ? `(${selectedRoutes.length})` : ''}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-gray-600 py-3 rounded-lg mx-2"
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
