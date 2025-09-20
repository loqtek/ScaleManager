import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDevices } from "@/app/funcs/devices";

export default function DevicesScreen() {
  const { 
    devices, 
    loading, 
    fetchDevices, 
    handleRegisterDevice, 
    handleDevicePress, 
    getDeviceTypeIcon,
    getLastSeenText,
    getOnlineDevicesCount,
    sortDevices,
  } = useDevices();

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Loading Devices...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        >
          {/* Header */}
          <View className="mb-4 flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Devices</Text>
              <Text className="text-slate-400">
                {getOnlineDevicesCount()} online • {devices.length} total
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity onPress={fetchDevices} className="p-2">
                <MaterialIcons name="refresh" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleRegisterDevice}
                className="bg-blue-600 py-2 px-4 rounded-lg flex-row items-center"
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-white font-semibold ml-1">Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search and Filter */}
          <View className="mb-4 space-y-3">
            {/* Search Bar */}
            <View className="bg-zinc-800 rounded-lg flex-row items-center px-3 py-2">
              <MaterialIcons name="search" size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 text-white ml-2"
                placeholder="Search devices..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <MaterialIcons name="clear" size={20} color="#94a3b8" />
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
                      className={`px-3 mr-2 py-2 rounded-lg ${
                        filterOnline === filter.key ? 'bg-blue-600' : 'bg-zinc-700'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        filterOnline === filter.key ? 'text-white' : 'text-slate-300'
                      }`}>
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
                className="bg-zinc-700 px-3 mt-2 rounded-lg flex-row items-center"
              >
                <MaterialIcons name="sort" size={16} color="white" />
                <Text className="text-white text-sm ml-1 capitalize">{sortBy}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Devices List */}
          {filteredAndSortedDevices.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="devices-other" size={64} color="#6b7280" />
              <Text className="text-slate-400 text-lg mt-4 text-center">
                {searchQuery ? "No devices match your search" : "No Devices Found"}
              </Text>
              <Text className="text-slate-500 text-center mt-2">
                {searchQuery ? "Try adjusting your search terms" : "Register your first device to get started"}
              </Text>
            </View>
          ) : (
            filteredAndSortedDevices.map((device) => (
              <TouchableOpacity
                key={device.id}
                onPress={() => handleDevicePress(device)}
                className="bg-zinc-800 rounded-xl p-4 mb-3 border border-zinc-700"
                activeOpacity={0.7}
              >
                {/* Device Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${
                      device.online ? 'bg-green-600' : 'bg-zinc-600'
                    }`}>
                      <MaterialIcons 
                        name={getDeviceTypeIcon(device.name || device.givenName)} 
                        size={20} 
                        color="white" 
                      />
                    </View>
                    
                    <View className="ml-3 flex-1">
                      <Text className="text-white text-lg font-semibold">
                        {device.givenName || device.name || "Unnamed Device"}
                      </Text>
                      <Text className="text-slate-400 text-sm">
                        {device.user?.name || "Unknown User"}
                      </Text>
                    </View>
                  </View>

                  {/* Online Status Badge */}
                  <View className={`px-3 py-1 rounded-full ${
                    device.online ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <Text className={`text-xs font-semibold ${
                      device.online ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {device.online ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                  </View>
                </View>

                {/* Device Details */}
                <View className="space-y-2">
                  <View className="flex-row">
                    <Text className="text-slate-300 font-mono">
                     IP: {device.ipAddresses?.[0] || "N/A"}
                    </Text>
                  </View>
                  
                  <View className="flex-row">
                    <Text className="text-slate-300 font-mono">
                      Last Seen: {getLastSeenText(device.lastSeen)}
                    </Text>
                  </View>

                  {device.registerMethod && (
                    <View className="flex-row">
                      <Text className="text-slate-300 font-mono">
                        Method: {device.registerMethod.replace('REGISTER_METHOD_', '').replace('_', ' ')}
                      </Text>
                    </View>
                  )}

                  {/* Routes Info */}
                  {(device.approvedRoutes?.length > 0 || device.availableRoutes?.length > 0) && (
                    <View className="mt-2 pt-2 border-t border-zinc-700">
                      {device.approvedRoutes?.length > 0 && (
                        <View className="flex-row mb-1">
                          <Text className="text-slate-400 w-20">Routes:</Text>
                          <Text className="text-blue-400 flex-1">
                            {device.approvedRoutes.slice(0, 2).join(', ')}
                            {device.approvedRoutes.length > 2 && ` +${device.approvedRoutes.length - 2} more`}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Tags */}
                  {device.validTags?.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                      {device.validTags.slice(0, 3).map((tag, index) => (
                        <View key={index} className="bg-zinc-700 px-2 py-1 rounded mr-2 mb-1">
                          <Text className="text-slate-300 text-xs">{tag}</Text>
                        </View>
                      ))}
                      {device.validTags.length > 3 && (
                        <View className="bg-zinc-700 px-2 py-1 rounded">
                          <Text className="text-slate-300 text-xs">
                            +{device.validTags.length - 3}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* Tap to View Indicator */}
                <View className="flex-row justify-end mt-3">
                  <Text className="text-slate-500 text-xs">Tap for details</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#6b7280" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}