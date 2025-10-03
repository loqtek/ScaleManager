import React, { useRef } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, SafeAreaView, 
  ScrollView, Animated
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Device } from "../types";
import { useDeviceDetail } from "../funcs/deviceDetail";
import { formatDate, getTimeAgo, copyToClipboard } from "../utils/deviceUtils";
import { InfoRow } from "../components/InfoRow";
import { UserSelectionModal } from "../components/UserSelectionModal";
import { TagsModal } from "../components/TagsModal";
import { RoutesModal } from "../components/RoutesModal";

export default function DeviceDetailScreen() {
  const { device: deviceData } = useLocalSearchParams<{ device: string }>();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
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
  } = useDeviceDetail(deviceData);

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
      <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
        <MaterialIcons name="devices-other" size={64} color="#6b7280" />
        <Text className="text-white mt-4">Loading device details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {/* Sticky Header */}
      <Animated.View 
        style={{ 
          height: headerHeight,
          backgroundColor: '#18181b',
          borderBottomWidth: 1,
          borderBottomColor: '#3f3f46',
          shadowColor: '#000',
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
            <MaterialIcons name="arrow-back" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">Back</Text>
          </TouchableOpacity>
          
          <View className={`px-3 py-1 rounded-full ${
            device.online ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Text className={`text-sm font-semibold ${
              device.online ? 'text-green-400' : 'text-red-400'
            }`}>
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
          <Text className="text-white text-xl font-bold" numberOfLines={1}>
            {device.givenName || device.name}
          </Text>
          <Text className="text-slate-400 text-sm" numberOfLines={1}>
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
          <Text className="text-white font-semibold text-base" numberOfLines={1}>
            {device.givenName || device.name}
          </Text>
          <Text className="text-slate-400 text-xs" numberOfLines={1}>
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
          <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
            <Text className="text-white text-lg font-semibold mb-4">Basic Information</Text>
            
            {editingField === "name" ? (
              <View className="mb-4">
                <Text className="text-slate-400 text-sm font-medium mb-1">Device Name:</Text>
                <View className="flex-row space-x-2">
                  <TextInput
                    className="flex-1 bg-zinc-700 text-white p-3 rounded-lg"
                    value={tempValue}
                    onChangeText={setTempValue}
                    placeholder="Enter device name"
                    placeholderTextColor="#94a3b8"
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleRename} className="bg-green-600 px-4 py-3 rounded-lg">
                    <MaterialIcons name="check" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingField(null)} className="bg-gray-600 px-4 py-3 rounded-lg">
                    <MaterialIcons name="close" size={16} color="white" />
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
            <InfoRow label="IP Address" value={device.ipAddresses?.join(", ") || "N/A"} copyable />
            <InfoRow label="Last Seen" value={`${formatDate(device.lastSeen)} (${getTimeAgo(device.lastSeen)})`} />
            <InfoRow label="Created" value={formatDate(device.createdAt)} />
            <InfoRow label="Registration Method" value={device.registerMethod.replace('REGISTER_METHOD_', '').replace('_', ' ')} />
            {device.expiry && device.expiry !== "0001-01-01T00:00:00Z" && (
              <InfoRow label="Expires" value={formatDate(device.expiry)} />
            )}
          </View>

          {/* User Information */}
          <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">User Assignment</Text>
              <TouchableOpacity onPress={() => setShowUserModal(true)} className="bg-blue-600 px-3 py-1 rounded">
                <Text className="text-white text-sm">Change</Text>
              </TouchableOpacity>
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
          <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
            <Text className="text-white text-lg font-semibold mb-4">Network Keys</Text>
            <InfoRow label="Machine Key" value={device.machineKey} copyable />
            <InfoRow label="Node Key" value={device.nodeKey} copyable />
            <InfoRow label="Disco Key" value={device.discoKey} copyable />
          </View>

          {/* Routes */}
          <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">Route Management</Text>
              {device.availableRoutes?.length > 0 && (
                <TouchableOpacity onPress={() => setShowRoutesModal(true)} className="bg-green-600 px-3 py-1 rounded">
                  <Text className="text-white text-sm">Approve Routes</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Approved Routes */}
            {device.approvedRoutes?.length > 0 && (
              <View className="mb-4">
                <Text className="text-slate-400 text-sm font-medium mb-2">Approved Routes:</Text>
                <View className="bg-zinc-700 rounded-lg p-3">
                  {device.approvedRoutes.map((route, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="text-green-400 font-mono text-sm flex-1">{route}</Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                          <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveRoute(route)}>
                          <MaterialIcons name="close" size={16} color="#f87171" />
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
                <Text className="text-slate-400 text-sm font-medium mb-2">Available Routes:</Text>
                <View className="bg-zinc-700 rounded-lg p-3">
                  {device.availableRoutes.map((route, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="text-yellow-400 font-mono text-sm flex-1">{route}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                        <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Text className="text-slate-500 text-xs mt-2">
                  Tap "Approve Routes" to move available routes to approved routes
                </Text>
              </View>
            )}

            {/* Subnet Routes */}
            {device.subnetRoutes?.length > 0 && (
              <View>
                <Text className="text-slate-400 text-sm font-medium mb-2">Subnet Routes:</Text>
                <View className="bg-zinc-700 rounded-lg p-3">
                  {device.subnetRoutes.map((route, index) => (
                    <View key={index} className="flex-row justify-between items-center py-1">
                      <Text className="text-blue-400 font-mono text-sm flex-1">{route}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(route, "Route")}>
                        <MaterialIcons name="content-copy" size={16} color="#60a5fa" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {(!device.approvedRoutes?.length && !device.availableRoutes?.length && !device.subnetRoutes?.length) && (
              <Text className="text-slate-400 text-center py-4">No routes configured</Text>
            )}
          </View>

          {/* Tags */}
          <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">Tags</Text>
              <TouchableOpacity onPress={() => setShowTagsModal(true)} className="bg-yellow-600 px-3 py-1 rounded">
                <Text className="text-white text-sm">Add</Text>
              </TouchableOpacity>
            </View>
            
            {device.validTags?.length > 0 && (
              <InfoRow label="Valid Tags" value={device.validTags.join(", ")} />
            )}
            {device.forcedTags?.length > 0 && (
              <InfoRow label="Forced Tags" value={device.forcedTags.join(", ")} />
            )}
            {device.invalidTags?.length > 0 && (
              <InfoRow label="Invalid Tags" value={device.invalidTags.join(", ")} />
            )}
            
            {(!device.validTags?.length && !device.forcedTags?.length && !device.invalidTags?.length) && (
              <Text className="text-slate-400 text-center py-4">No tags assigned</Text>
            )}
          </View>

          {/* Pre-Auth Key Info */}
          {device.preAuthKey && (
            <View className="bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-700">
              <Text className="text-white text-lg font-semibold mb-4">Pre-Auth Key</Text>
              <InfoRow label="Key ID" value={device.preAuthKey.id} />
              <InfoRow label="Key" value={device.preAuthKey.key} copyable />
              <InfoRow label="Reusable" value={device.preAuthKey.reusable ? "Yes" : "No"} />
              <InfoRow label="Used" value={device.preAuthKey.used ? "Yes" : "No"} />
              <InfoRow label="Created" value={formatDate(device.preAuthKey.createdAt)} />
              <InfoRow label="Expires" value={formatDate(device.preAuthKey.expiration)} />
            </View>
          )}

          {/* Actions */}
          <View className="bg-zinc-800 rounded-xl p-4 mb-6 border border-zinc-700">
            <Text className="text-white text-lg font-semibold mb-4">Actions</Text>
            <TouchableOpacity 
              className="bg-red-600 py-3 rounded-lg flex-row items-center justify-center"
              onPress={handleDeleteWithNavigation}
            >
              <MaterialIcons name="delete" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Delete Device</Text>
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