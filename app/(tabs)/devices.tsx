import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useDevices } from "@/app/funcs/devices";
import { RegisterDeviceModal } from "@/app/components/RegisterDeviceModal";
import { ScreenLoading } from "@/app/components/ScreenLoading";
import { useTheme } from "@/theme";

export default function DevicesScreen() {
  const { 
    devices, 
    users,
    loading, 
    fetchDevices, 
    handleRegisterDevice, 
    handleDevicePress, 
    getDeviceTypeIcon,
    getLastSeenText,
    getOnlineDevicesCount,
    sortDevices,
    // Modal state and handlers
    showRegisterModal,
    selectedUser,
    deviceKey,
    setSelectedUser,
    setDeviceKey,
    handleModalClose,
    handleModalRegister,
    handleModalApprove,
    handleModalReject,
    serverVersion,
  } = useDevices();
  const { theme } = useTheme();
  const { colors } = theme;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOnline, setFilterOnline] = useState<"all" | "online" | "offline">("all");
  const [sortBy, setSortBy] = useState<"name" | "lastSeen" | "user">("name");

  const filteredAndSortedDevices = sortDevices(
    devices
      .filter(device => {
        const matchesSearch = device.givenName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            device.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filterOnline === "all" || 
                            (filterOnline === "online" && device.online) ||
                            (filterOnline === "offline" && !device.online);
        
        return matchesSearch && matchesFilter;
      }),
    sortBy
  );

  const onRefresh = () => {
    fetchDevices();
  };


  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1" style={{ backgroundColor: colors.background }}>
      {loading ? (
        <ScreenLoading label="Loading Devices..." />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
        >
          {/* Header */}
          <View className="mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>Devices</Text>
              <Text style={{ color: colors.textMuted }}>
                {getOnlineDevicesCount()} online • {devices.length} total
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={fetchDevices} className="p-2" activeOpacity={0.7}>
                <MaterialIcons name="refresh" size={24} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleRegisterDevice}
                activeOpacity={0.8}
                className="py-2 px-4 rounded-lg flex-row items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <MaterialIcons name="add" size={16} color={colors.onPrimary} />
                <Text className="font-semibold ml-1" style={{ color: colors.onPrimary }}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search and Filter */}
          <View className="mb-4 space-y-3">
            {/* Search Bar */}
            <View className="rounded-lg flex-row items-center px-3 py-2" style={{ backgroundColor: colors.surface }}>
              <MaterialIcons name="search" size={20} color={colors.textMuted} />
              <TextInput
                className="flex-1 ml-2"
                style={{ color: colors.text }}
                placeholder="Search devices..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
                  <MaterialIcons name="clear" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter and Sort Controls */}
            <View className="flex-row space-x-2">
              {/* Status Filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                <View className="flex-row space-x-2 pt-2">
                  {[
                    { key: "all", label: "All", count: devices.length },
                    { key: "online", label: "Online", count: devices.filter(d => d.online).length },
                    { key: "offline", label: "Offline", count: devices.filter(d => !d.online).length },
                  ].map((filter) => (
                    <TouchableOpacity
                      key={filter.key}
                      onPress={() => setFilterOnline(filter.key as any)}
                      activeOpacity={0.8}
                      className="px-3 mr-2 py-2 rounded-lg"
                      style={{ backgroundColor: filterOnline === filter.key ? colors.primary : colors.surfaceMuted }}
                    >
                      <Text className="text-sm font-medium" style={{ color: filterOnline === filter.key ? colors.onPrimary : colors.textSecondary }}>
                        {filter.label} ({filter.count})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {/* Sort Button */}
              <TouchableOpacity
                onPress={() => {
                  const nextSort = sortBy === "name" ? "lastSeen" : sortBy === "lastSeen" ? "user" : "name";
                  setSortBy(nextSort);
                }}
                activeOpacity={0.8}
                className="px-3 mt-2 rounded-lg flex-row items-center"
                style={{ backgroundColor: colors.surfaceMuted }}
              >
                <MaterialIcons name="sort" size={16} color={colors.text} />
                <Text className="text-sm ml-1 capitalize" style={{ color: colors.text }}>{sortBy}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Devices List */}
          {filteredAndSortedDevices.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="devices-other" size={64} color={colors.muted} />
              <Text className="text-lg mt-4 text-center" style={{ color: colors.textMuted }}>
                {searchQuery ? "No devices match your search" : "No Devices Found"}
              </Text>
              <Text className="text-center mt-2" style={{ color: colors.muted }}>
                {searchQuery ? "Try adjusting your search terms" : "Register your first device to get started"}
              </Text>
            </View>
          ) : (
            filteredAndSortedDevices.map((device) => {
              const displayTags = device.tags ?? device.validTags ?? [];
              return (
              <TouchableOpacity
                key={device.id}
                onPress={() => handleDevicePress(device)}
                className="rounded-xl p-4 mb-3 border"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                activeOpacity={0.7}
              >
                {/* Device Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: device.online ? colors.success : colors.secondaryPressed }}
                    >
                      <MaterialIcons 
                        name={getDeviceTypeIcon(device.name || device.givenName)} 
                        size={20} 
                        color={device.online ? colors.onPrimary : colors.text} 
                      />
                    </View>
                    
                    <View className="ml-3 flex-1">
                      <Text className="text-lg font-semibold" style={{ color: colors.text }}>
                        {device.givenName || device.name || "Unnamed Device"}
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textMuted }}>
                        {device.user?.name || "Unknown User"}
                      </Text>
                    </View>
                  </View>

                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: device.online ? colors.successSoft : colors.errorSoft }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: device.online ? colors.success : colors.error }}>
                      {device.online ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                  </View>
                </View>

                {/* Device Details */}
                <View className="space-y-2">
                  <View className="flex-row">
                    <Text className="font-mono" style={{ color: colors.textSecondary }}>
                     IP: {device.ipAddresses?.[0] || "N/A"}
                    </Text>
                  </View>
                  
                  <View className="flex-row">
                    <Text className="font-mono" style={{ color: colors.textSecondary }}>
                      Last Seen: {getLastSeenText(device.lastSeen)}
                    </Text>
                  </View>

                  {device.registerMethod && (
                    <View className="flex-row">
                      <Text className="font-mono" style={{ color: colors.textSecondary }}>
                        Method: {device.registerMethod.replace('REGISTER_METHOD_', '').replace('_', ' ')}
                      </Text>
                    </View>
                  )}

                  {/* Routes Info */}
                  {(device.approvedRoutes?.length > 0 || device.availableRoutes?.length > 0) && (
                    <View className="mt-2 pt-2 border-t" style={{ borderTopColor: colors.border }}>
                      {device.approvedRoutes?.length > 0 && (
                        <View className="flex-row mb-1">
                          <Text className="w-20" style={{ color: colors.textMuted }}>Routes:</Text>
                          <Text className="flex-1" style={{ color: colors.primaryMuted }}>
                            {device.approvedRoutes.slice(0, 2).join(', ')}
                            {device.approvedRoutes.length > 2 && ` +${device.approvedRoutes.length - 2} more`}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Tags */}
                  {displayTags.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                      {displayTags.slice(0, 3).map((tag, index) => (
                        <View key={index} className="px-2 py-1 rounded mr-2 mb-1" style={{ backgroundColor: colors.surfaceMuted }}>
                          <Text className="text-xs" style={{ color: colors.textSecondary }}>{tag}</Text>
                        </View>
                      ))}
                      {displayTags.length > 3 && (
                        <View className="px-2 py-1 rounded" style={{ backgroundColor: colors.surfaceMuted }}>
                          <Text className="text-xs" style={{ color: colors.textSecondary }}>
                            +{displayTags.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* Tap to View Indicator */}
                <View className="flex-row justify-end mt-3">
                  <Text className="text-xs" style={{ color: colors.muted }}>Tap for details</Text>
                  <MaterialIcons name="chevron-right" size={16} color={colors.muted} />
                </View>
              </TouchableOpacity>
            )})
          )}
        </ScrollView>
      )}
      
      {/* Register Modal */}
      <RegisterDeviceModal
        visible={showRegisterModal}
        onClose={handleModalClose}
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        deviceKey={deviceKey}
        onKeyChange={setDeviceKey}
        onRegister={handleModalRegister}
        serverVersion={serverVersion}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />
    </SafeAreaView>
  );
}