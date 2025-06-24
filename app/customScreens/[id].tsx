import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import { renameDevice, deleteDevice, addTags, changeUser } from "../api/devices";

// device type 
type device = {
  createdAt: string;
  discoKey: string;
  expiry: string;
  forcedTags: string[];
  givenName: string;
  id: string;
  invalidTags: string[];
  ipAddresses: string[];
  lastSeen: string;
  machineKey: string;
  name: string;
  online: boolean;
  preAuthKey: any;
  registerMethod: string;
  user: any;
  validTags: string[];
};

export default function DeviceDetailScreen() {
  const { device: deviceData } = useLocalSearchParams<{ device: string }>();

  const [device, setDevice] = useState<device | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (deviceData) {
      try {
        const parsedDevice: device = JSON.parse(deviceData);
        setDevice(parsedDevice); // set device state
      } catch (error) {
        console.error("Failed to parse device data:", error);
      }
    }
  }, [deviceData]);

  const handleRename = async () => {
    const newName = device?.givenName || "New Device Name"; 
    const result = await renameDevice(device?.id || "", newName);
    if (result) {
      setDevice((prevDevice) => ({ ...prevDevice, givenName: newName }));
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Device Renamed",
        text2: `Device has been renamed to ${newName}`,
      });
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Rename Failed",
        text2: "An error occurred while renaming the device.",
      });
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Device", "Are you sure you want to delete this device?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          const result = await deleteDevice(device?.id || "");
          if (result) {
            Toast.show({
              type: "success",
              text1: "Device Deleted",
              text2: "The device has been removed.",
            });
            router.push("/(tabs)/devices");
          } else {
            Toast.show({
              type: "error",
              text1: "Delete Failed",
              text2: "An error occurred while deleting the device.",
            });
          }
        },
      },
    ]);
  };

  const handleChangeUser = async () => {
    const newUser = device?.user || "New User"; 
    const result = await changeUser(device?.id || "", newUser);
    if (result) {
      setDevice((prevDevice) => ({ ...prevDevice, user: newUser }));
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ User Changed",
        text2: `Device user has been changed to ${newUser}`,
      });
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Change User Failed",
        text2: "An error occurred while changing the device user.",
      });
    }
  };

  //const handleAddTags = async () => {
  //  var newTags = device?.validTags || [];
  //  // slpit tags by space or comma, remove duplicates, lowercase them, and remove blanks / spaces
  //  const cleanTags = Array.from(new Set(device?.validTags.join(",").split(/[\s,]+/).map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)));
//
  //  // check if the tags are already present
  //  const existingTags = newTags.filter(tag => cleanTags.includes(tag));
//
  //  if (existingTags.length > 0) {
  //    Toast.show({
  //      type: "error",
  //      position: "top",
  //      text1: "⚠️ Duplicate Tags",
  //      text2: `The following tags already exist: ${existingTags.join(", ")}`,
  //    });
  //    return;
  //  }
  //  // check if input is empty
  //  if (cleanTags.length === 0) {
  //    Toast.show({
  //      type: "error",
  //      position: "top",
  //      text1: "⚠️ Empty Tags",
  //      text2: "Please enter at least one tag.",  
  //    });
  //    return;
  //  }
//
  //  newTags = [...newTags, ...cleanTags];
//
  //  newTags = Array.from(new Set(newTags));
//
  //  const result = await addTags(device?.id || "", cleanTags);
//
  //  if (result) {
  //    setDevice((prevDevice) => ({ ...prevDevice, validTags: newTags }));
  //    Toast.show({
  //      type: "success",
  //      position: "top",
  //      text1: "✅ Tags Added",
  //      text2: `Tags have been added successfully.`,
  //    });
  //  } else {
  //    Toast.show({
  //      type: "error",
  //      position: "top",
  //      text1: "⚠️ Add Tags Failed",
  //      text2: "An error occurred while adding the tags.",
  //    });
  //  }
  //};

  // if device data is still being loaded
  if (!device) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
        <Text className="text-white">Loading device details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-900 px-6 py-6">
      {/* Back Button */}
      <View className="flex-row items-center mb-4 px-4">
        <TouchableOpacity onPress={() => router.push("/(tabs)/devices")} className="mr-4">
          <Text className="text-white text-lg font-semibold">{"< Back"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* device details */}
        <View className="bg-zinc-800 p-6 mb-6 mt-4 rounded-xl border border-zinc-700 shadow-lg">
          <Text className="text-white text-2xl font-semibold mb-4 text-center">Device Details</Text>
          {/* status */}
          <View className="mb-4">
            <Text className="text-white text-lg font-semibold">Status:</Text>
            <Text className={`p-3 rounded-md ${device.online ? "bg-green-600" : "bg-red-600"} text-white`}>
              {device.online ? "Online" : "Offline"}
            </Text>
          </View>

          {/* device ip */}
          <View className="mb-4">
            <Text className="text-white text-lg font-semibold">IP Address:</Text>
            <Text className="bg-zinc-700 text-white p-3 rounded-md">{device.ipAddresses?.[0] || "N/A"}</Text>
          </View>

          {/* device name */}
          <View className="mb-4">
            <Text className="text-white text-lg font-semibold">Device Name:</Text>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md mb-2"
              value={device.givenName !== undefined && device.givenName !== null ? device.givenName : device.name}
              onChangeText={(text) => setDevice({ ...device, givenName: text.toLowerCase() })}
              placeholder="Device name"
              placeholderTextColor="#94a3b8"
            />
          </View>


          {
          /* device tags 
          
          <View className="mb-4">
            <Text className="text-white text-lg font-semibold">Tags:</Text>
            <Text className="text-white text-sm italic">(use spaces or ',' to separate)</Text>
            
            <TextInput
                className="bg-zinc-700 text-white p-3 rounded-md mb-2"
                value={device.validTags.concat(device.forcedTags).join(", ")} // join valid and forced tags
                onChangeText={(text) => {
                
                const updatedTags = text.split(", ").map(tag => tag.trim().toLowerCase());
                setDevice({ ...device, validTags: updatedTags });
                }}
                placeholder="Add tags"
                placeholderTextColor="#94a3b8"
            />

          </View>
          */
          }


          {/* device user */}
          <View className="mb-2">
            <Text className="text-white text-lg font-semibold">Assigned User:</Text>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-md mb-2"
              value={device.user || ""}
              onChangeText={(text) => setDevice({ ...device, user: text.toLowerCase() })}
              placeholder="Change user"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* device last seen */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold">Last Seen:</Text>
            <Text className="bg-zinc-700 text-white p-3 rounded-md">{device.lastSeen || "N/A"}</Text>
          </View>

          {/* device actions */}
          <View className="space-y-4">
            <TouchableOpacity className="bg-blue-600 py-3 rounded-xl mt-2" onPress={handleRename}>
              <Text className="text-white text-center font-bold">Rename Device</Text>
            </TouchableOpacity>

          { /* 
            <TouchableOpacity className="bg-yellow-600 py-3 rounded-xl mt-2" onPress={handleAddTags}>
              <Text className="text-white text-center font-bold">Add Tags</Text>
            </TouchableOpacity>
          */}
            <TouchableOpacity className="bg-green-600 py-3 rounded-xl mt-2" onPress={handleChangeUser}>
              <Text className="text-white text-center font-bold">Change User</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-red-600 py-3 rounded-xl mt-2" onPress={handleDelete}>
              <Text className="text-white text-center font-bold">Delete Device</Text>
            </TouchableOpacity>            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
