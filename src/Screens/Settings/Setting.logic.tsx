import { signOut } from "@/backend/auth";
import { deleteUserData, getProfile } from "@/backend/getData";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { DELETE_ACCOUNT_ALERT, ProfileData } from "./Setting.static";

export const useSetting = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);

      const data = await getProfile();
      setProfile(data);
    } catch (err: any) {
      console.log(err);
    } finally {
      if (showRefreshing) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchProfile(true);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserData();
      await signOut();
      router.replace("/auth/login");
    } catch (err) {
      console.log("Error deleting account: ", err);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

  const handleConfirmDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(DELETE_ACCOUNT_ALERT.title, DELETE_ACCOUNT_ALERT.message, [
      {
        text: DELETE_ACCOUNT_ALERT.cancelText,
        style: "cancel",
        onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      },
      {
        text: DELETE_ACCOUNT_ALERT.confirmText,
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          handleDeleteAccount();
        },
      },
    ]);
  };

  const handleSettingItemPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return {
    profile,
    refreshing,
    handleRefresh,
    handleConfirmDelete,
    handleSettingItemPress,
    getInitials,
  };
};
