import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, 
 Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDeviceDetail } from "../funcs/deviceDetail";
import { formatDate, getTimeAgo, copyToClipboard } from "../utils/deviceUtils";
import { isNullExpiry } from "../utils/registrationUtils";
import { InfoRow } from "../components/InfoRow";
import { UserSelectionModal } from "../components/UserSelectionModal";
import { TagsModal } from "../components/TagsModal";
import { RoutesModal } from "../components/RoutesModal";
import { useTheme } from "@/theme";

export default function DeviceDetailScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { device: deviceData } = useLocalSearchParams<{ device: string }>();
  const router = useRouter();
  const [scrollY] = useState(() => new Animated.Value(0));
  
  const {
    device,
    users,
    editingField,
    setEditingField,
    tempValue,
    setTempValue,
    showUserModal,
    setShowUserModal,
    showTagsModal,
    setShowTagsModal,
    showRoutesModal,
    setShowRoutesModal,
    selectedRoutes,
    setSelectedRoutes,
    newTags,
    setNewTags,
    handleRename,
    handleChangeUser,
    handleAddTags,
    handleApproveRoutes,
    handleRemoveRoute,
    handleDelete,
    canChangeUser,
  } = useDeviceDetail(deviceData);
  const appliedTags = device?.tags || device?.validTags || [];

  const handleDeleteWithNavigation = async () => {
    await handleDelete();
    router.push("/(tabs)/devices");
  };

  // Animated header values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  if (!device) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <MaterialIcons name="devices-other" size={64} color={colors.muted} />
        <Text className="mt-4" style={{ color: colors.text }}>Loading device details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Sticky Header */}
      <Animated.View 
        style={{ 
          height: headerHeight,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        className="px-4 justify-center"
      >
        {/* Top bar with back button and status */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.push("/(tabs)/devices")}
            className="flex-row items-center"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            <Text className="text-lg font-semibold ml-2" style={{ color: colors.text }}>Back</Text>
          </TouchableOpacity>
          
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: device.online ? colors.successSoft : colors.errorSoft }}
          >
            <Text className="text-sm font-semibold" style={{ color: device.online ? colors.success : colors.error }}>
              {device.online ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>
        </View>

        {/* Expanded header info - fades out on scroll */}
        <Animated.View 
          style={{ 
            opacity: headerOpacity,
            transform: [{ scale: headerScale }]
          }}
          className="items-center"
        >
          <Text className="text-xl font-bold" style={{ color: colors.text }} numberOfLines={1}>
            {device.givenName || device.name}
          </Text>
          <Text className="text-sm" style={{ color: colors.textMuted }} numberOfLines={1}>
            {device.user?.name} • {device.ipAddresses?.[0]}
          </Text>
        </Animated.View>

        {/* Compact header info - fades in on scroll */}
        <Animated.View 
          style={{ 
            opacity: compactHeaderOpacity,
            position: 'absolute',
            left: 120,
            right: 120,
          }}
          className="items-center"
        >
          <Text className="font-semibold text-base" style={{ color: colors.text }} numberOfLines={1}>
            {device.givenName || device.name}
          </Text>
          <Text className="text-xs" style={{ color: colors.textMuted }} numberOfLines={1}>
            {device.ipAddresses?.[0]}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView 
        className="flex-1 px-4"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View className="pt-4 ">
          {/* Basic Information */}
          <View className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Basic Information</Text>
            
            {editingField === "name" ? (
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1" style={{ color: colors.textMuted }}>Device Name:</Text>
                <View className="flex-row space-x-2">
                  <TextInput
                    className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.surfaceMuted, color: colors.text }}
                    value={tempValue}
                    onChangeText={setTempValue}
                    placeholder="Enter device name"
                    placeholderTextColor={colors.textMuted}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleRename} className="px-4 py-3 rounded-lg" style={{ backgroundColor: colors.success }}>
                    <MaterialIcons name="check" size={16} color={colors.onPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingField(null)} className="px-4 py-3 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                    <MaterialIcons name="close" size={16} color={colors.onSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <InfoRow 
                label="Device Name" 
                value={device.givenName || device.name}
                onEdit={() => {
                  setTempValue(device.givenName || device.name);
                  setEditingField("name");
                }}
              />
            )}
            
            <InfoRow label="Device ID" value={device.id} copyable />
            {device.name && device.givenName && device.name !== device.givenName && (
              <InfoRow label="Hostname" value={device.name} />
            )}
            <InfoRow label="IP Address" value={device.ipAddresses?.join(", ") || "N/A"} copyable />
            <InfoRow label="Last Seen" value={`${formatDate(device.lastSeen)} (${getTimeAgo(device.lastSeen)})`} />
            <InfoRow label="Created" value={formatDate(device.createdAt)} />
            <InfoRow label="Registration Method" value={device.registerMethod?.replace('REGISTER_METHOD_', '').replace('_', ' ') || "Unknown"} />
            {!isNullExpiry(device.expiry) ? (
              <InfoRow label="Expires" value={formatDate(device.expiry!)} />
            ) : (
              <InfoRow label="Expires" value="Never" />
            )}
          </View>

          {/* User Information */}
          <View className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold" style={{ color: colors.text }}>User Assignment</Text>
              {canChangeUser ? (
                <TouchableOpacity onPress={() => setShowUserModal(true)} className="px-3 py-1 rounded" style={{ backgroundColor: colors.primary }}>
                  <Text className="text-sm" style={{ color: colors.onPrimary }}>Change</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-xs" style={{ color: colors.muted }}>Fixed at registration (v0.28+)</Text>
              )}
            </View>
            
            <InfoRow label="User Name" value={device.user?.name || "Unknown"} />
            <InfoRow label="User ID" value={device.user?.id || "N/A"} />
            {device.user?.displayName && (
              <InfoRow label="Display Name" value={device.user.displayName} />
            )}
            {device.user?.email && (
              <InfoRow label="Email" value={device.user.email} />
            )}
          </View>

          {/* Network Keys */}
          <View className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Network Keys</Text>
            <InfoRow label="Machine Key" value={device.machineKey} copyable />
            <InfoRow label="Node Key" value={device.nodeKey} copyable />
            <InfoRow label="Disco Key" value={device.discoKey} copyable />
          </View>

          {/* Routes */}
          <View className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold" style={{ color: colors.text }}>Route Management</Text>
              {device.availableRoutes?.length > 0 && (
                <TouchableOpacity onPress={() => setShowRoutesModal(true)} className="px-3 py-1 rounded" style={{ backgroundColor: colors.success }}>
                  <Text className="text-sm" style={{ color: colors.onPrimary }}>Approve Routes</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Approved Routes */}
            {device.approvedRoutes?.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>Approved Routes:</Text>
                <View className="rounded-lg p-3" style={{ backgroundColor: colors.surfaceMuted }}>
                  {device.approvedRoutes.map((route, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="font-mono text-sm flex-1" style={{ color: colors.success }}>{route}</Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                          <MaterialIcons name="content-copy" size={16} color={colors.primaryMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveRoute(route)}>
                          <MaterialIcons name="close" size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Available Routes */}
            {device.availableRoutes?.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>Available Routes:</Text>
                <View className="rounded-lg p-3" style={{ backgroundColor: colors.surfaceMuted }}>
                  {device.availableRoutes.map((route, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="font-mono text-sm flex-1" style={{ color: colors.warning }}>{route}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                        <MaterialIcons name="content-copy" size={16} color={colors.primaryMuted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Text className="text-xs mt-2" style={{ color: colors.muted }}>
                  Tap "Approve Routes" to move available routes to approved routes
                </Text>
              </View>
            )}

            {/* Subnet Routes */}
            {device.subnetRoutes?.length > 0 && (
              <View>
                <Text className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>Subnet Routes:</Text>
                <View className="rounded-lg p-3" style={{ backgroundColor: colors.surfaceMuted }}>
                  {device.subnetRoutes.map((route, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="font-mono text-sm flex-1" style={{ color: colors.primaryMuted }}>{route}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                        <MaterialIcons name="content-copy" size={16} color={colors.primaryMuted} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {(!device.approvedRoutes?.length && !device.availableRoutes?.length && !device.subnetRoutes?.length) && (
              <Text className="text-center py-4" style={{ color: colors.textMuted }}>No routes configured</Text>
            )}
          </View>

          {/* Tags */}
          <View className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold" style={{ color: colors.text }}>Tags</Text>
              <TouchableOpacity onPress={() => setShowTagsModal(true)} className="px-3 py-1 rounded" style={{ backgroundColor: colors.warning }}>
                <Text className="text-sm" style={{ color: colors.onPrimary }}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {appliedTags.length > 0 && (
              <InfoRow label="Tags" value={appliedTags.join(", ")} />
            )}
            {(device.forcedTags?.length ?? 0) > 0 && (
              <InfoRow label="Forced Tags" value={(device.forcedTags || []).join(", ")} />
            )}
            {(device.invalidTags?.length ?? 0) > 0 && (
              <InfoRow label="Invalid Tags" value={(device.invalidTags || []).join(", ")} />
            )}
            
            {(!appliedTags.length && !device.forcedTags?.length && !device.invalidTags?.length) && (
              <Text className="text-center py-4" style={{ color: colors.textMuted }}>No tags assigned</Text>
            )}
          </View>

          {/* Pre-Auth Key Info */}
          {device.preAuthKey && (
            <View className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
              <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Pre-Auth Key</Text>
              <InfoRow label="Key ID" value={device.preAuthKey.id} />
              <InfoRow label="Key" value={device.preAuthKey.key} copyable />
              <InfoRow label="Reusable" value={device.preAuthKey.reusable ? "Yes" : "No"} />
              <InfoRow label="Used" value={device.preAuthKey.used ? "Yes" : "No"} />
              <InfoRow label="Created" value={formatDate(device.preAuthKey.createdAt)} />
              <InfoRow label="Expires" value={formatDate(device.preAuthKey.expiration)} />
            </View>
          )}

          {/* Actions */}
          <View className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Actions</Text>
            <TouchableOpacity 
              className="py-3 rounded-lg flex-row items-center justify-center" style={{ backgroundColor: colors.error }}
              onPress={handleDeleteWithNavigation}
            >
              <MaterialIcons name="delete" size={20} color={colors.onPrimary} />
              <Text className="font-semibold ml-2" style={{ color: colors.onPrimary }}>Delete Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Modals */}
      <UserSelectionModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        users={users}
        onSelectUser={handleChangeUser}
      />
      <TagsModal
        visible={showTagsModal}
        onClose={() => {
          setShowTagsModal(false);
          setNewTags("");
        }}
        newTags={newTags}
        setNewTags={setNewTags}
        onAddTags={handleAddTags}
      />
      <RoutesModal
        visible={showRoutesModal}
        onClose={() => {
          setShowRoutesModal(false);
          setSelectedRoutes([]);
        }}
        availableRoutes={device?.availableRoutes || []}
        selectedRoutes={selectedRoutes}
        setSelectedRoutes={setSelectedRoutes}
        onApproveRoutes={handleApproveRoutes}
      />
    </SafeAreaView>
  );
}