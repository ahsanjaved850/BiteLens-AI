import { signOut } from "@/backend/auth";
import { deleteUserData, getProfile } from "@/backend/getData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JSX, useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { settingStyles } from "./Setting.style";

export const Setting = (): JSX.Element => {
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = () => {
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

  const confirmDelete = () => {
    Vibration.vibrate(10);
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => Vibration.vibrate(10),
        },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: () => {
            Vibration.vibrate([0, 50, 50, 50]);
            handleDeleteAccount();
          },
        },
      ]
    );
  };

  // const handleLogout = () => {
  //   Vibration.vibrate(10);
  //   Alert.alert("Sign Out", "Are you sure you want to sign out?", [
  //     {
  //       text: "Cancel",
  //       style: "cancel",
  //       onPress: () => Vibration.vibrate(10),
  //     },
  //     {
  //       text: "Sign Out",
  //       style: "default",
  //       onPress: async () => {
  //         Vibration.vibrate(50);
  //         try {
  //           await signOut();
  //           router.replace("/auth/login");
  //         } catch (err) {
  //           console.log("Error signing out: ", err);
  //           Alert.alert("Error", "Failed to sign out. Please try again.");
  //         }
  //       },
  //     },
  //   ]);
  // };

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <SafeAreaView style={settingStyles.container}>
      {/* Header */}
      <View style={settingStyles.headerContainer}>
        <Text style={settingStyles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={settingStyles.body}
        contentContainerStyle={settingStyles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={["#3B82F6"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={settingStyles.profileCard}>
          <View style={settingStyles.profileImageContainer}>
            <Text style={settingStyles.profileInitials}>
              {getInitials(profile?.full_name || "")}
            </Text>
          </View>
          <Text style={settingStyles.profileName}>
            {profile?.full_name || "User"}
          </Text>
        </View>

        {/* Personal Information Section */}
        <View style={settingStyles.section}>
          <View style={settingStyles.sectionHeader}>
            <Text style={settingStyles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="person-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Full Name</Text>
                <Text style={settingStyles.settingItemValue}>
                  {profile?.full_name || "Not set"}
                </Text>
              </View>
            </View>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Age</Text>
                <Text style={settingStyles.settingItemValue}>
                  {profile?.age ? `${profile.age} years` : "Not set"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[settingStyles.settingItem, settingStyles.settingItemLast]}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="male-female-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Gender</Text>
                <Text style={settingStyles.settingItemValue}>
                  {profile?.gender || "Not set"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Physical Details Section */}
        <View style={settingStyles.section}>
          <View style={settingStyles.sectionHeader}>
            <Text style={settingStyles.sectionTitle}>Physical Details</Text>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="scale-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Weight</Text>
              </View>
            </View>
            <View style={settingStyles.settingItemRight}>
              <Text style={settingStyles.settingItemValueRight}>
                {profile?.weight ? `${profile.weight} kg` : "--"}
              </Text>
            </View>
          </View>

          <View style={settingStyles.settingItem}>
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="resize-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Height</Text>
              </View>
            </View>
            <View style={settingStyles.settingItemRight}>
              <Text style={settingStyles.settingItemValueRight}>
                {profile?.height ? `${profile.height} cm` : "--"}
              </Text>
            </View>
          </View>

          <View
            style={[settingStyles.settingItem, settingStyles.settingItemLast]}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="flag-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Goal Weight</Text>
              </View>
            </View>
            <View style={settingStyles.settingItemRight}>
              <Text style={settingStyles.settingItemValueRight}>
                {profile?.target_weight ? `${profile.target_weight} kg` : "--"}
              </Text>
            </View>
          </View>
        </View>

        {/* Support & Legal Section */}
        <View style={settingStyles.section}>
          <View style={settingStyles.sectionHeader}>
            <Text style={settingStyles.sectionTitle}>Support & Legal</Text>
          </View>

          <TouchableOpacity
            style={settingStyles.settingItem}
            activeOpacity={0.7}
            onPress={() => Vibration.vibrate(10)}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="help-circle-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>Help Center</Text>
                <Text style={settingStyles.settingItemValue}>
                  Get support and FAQs
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              style={settingStyles.chevronIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={settingStyles.settingItem}
            activeOpacity={0.7}
            onPress={() => Vibration.vibrate(10)}
          >
            <View style={settingStyles.settingItemLeft}>
              <View style={settingStyles.settingIconContainer}>
                <Ionicons name="document-text-outline" size={18} color="#666" />
              </View>
              <View style={settingStyles.settingItemContent}>
                <Text style={settingStyles.settingItemLabel}>
                  Terms & Conditions
                </Text>
                <Text style={settingStyles.settingItemValue}>
                  Legal agreements
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              style={settingStyles.chevronIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={settingStyles.dangerSection}>
          <View style={settingStyles.dangerSectionHeader}>
            <Text style={settingStyles.dangerSectionTitle}>Danger Zone</Text>
          </View>

          <TouchableOpacity
            style={settingStyles.dangerItem}
            onPress={confirmDelete}
            activeOpacity={0.7}
          >
            <View style={settingStyles.dangerItemLeft}>
              <View style={settingStyles.dangerIconContainer}>
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
              </View>
              <Text style={settingStyles.dangerItemLabel}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={settingStyles.appInfoSection}>
          <Image
            style={settingStyles.appLogo}
            source={require("@/assets/images/app_icon.png")}
          />
          <Text style={settingStyles.appVersion}>GreenBite AI v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
