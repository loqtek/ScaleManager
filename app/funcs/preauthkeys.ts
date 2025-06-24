import { useEffect, useState } from "react";
import { getPreAuthKeys, createPreAuthKey, expirePreAuthKey } from "../api/preauthkeys";
import { getUsers } from "../api/users";
import Toast from "react-native-toast-message";
import { calculateExpirationDate } from "../utils/time";

export const usePreAuthManager = () => {
  const [users, setUsers] = useState([]);
  const [preAuthKeys, setPreAuthKeys] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const usersRes = await getUsers();
    const userList = usersRes.users || [];
    setUsers(userList);

    const allKeys: Record<string, any[]> = {};
    for (const user of userList) {
      const keysRes = await getPreAuthKeys(user.name);
      allKeys[user.name] = keysRes.preAuthKeys || [];
    }
    setPreAuthKeys(allKeys);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExpireKey = async (keyId: string, userName: string) => {
    const result = await expirePreAuthKey(userName, keyId);
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Key Expired",
        text2: `Key ${keyId} expired successfully.`,
      });
      const keysRes = await getPreAuthKeys(userName);
      setPreAuthKeys((prev) => ({ ...prev, [userName]: keysRes.preAuthKeys || [] }));
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to Expire Key",
        text2: `Failed to expire key ${keyId}.`,
      });
    }
  };

  const handleCreateKey = async (userName: string, expireTime: string, reusable: boolean) => {
    const regex = /^(0|[1-9]\d*)([smhd])$/;
    if (!regex.test(expireTime)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Expiration Time",
        text2: "Please enter a valid expiration time (e.g. 24h, 7d)",
      });
      return;
    }

    const expirationDate = calculateExpirationDate(expireTime);

    if (!expirationDate) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "⚠️ Invalid Expiration Time",
        text2: "Failed to calculate expiration date.",
      });
      return;
    }

    const result = await createPreAuthKey(userName, expirationDate, reusable);
    if (result) {
      Toast.show({
        type: "success",
        position: "top",
        text1: "✅ Key Created",
        text2: `Key created successfully for ${userName}.`,
      });
      const keysRes = await getPreAuthKeys(userName);
      setPreAuthKeys((prev) => ({ ...prev, [userName]: keysRes.preAuthKeys || [] }));
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Failed to Create Key",
        text2: `Failed to create key for ${userName}.`,
      });
    }
  };


  return {
    users,
    preAuthKeys,
    loading,
    fetchData,
    setPreAuthKeys,
    handleExpireKey,
    handleCreateKey,
  };
};
