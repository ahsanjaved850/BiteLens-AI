import { signOut } from "@/backend/auth";
import { deleteUserData, getProfile } from "@/backend/getData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JSX, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { dataStyles } from "../Data/Data.style";
import { homeStyles } from "../Home/Home.style";
import { settingStyles } from "./Setting.style";

export const Setting = (): JSX.Element => {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await deleteUserData();
      await signOut();
      router.replace("/auth/login");
    } catch (err) {
      console.log("Error deleting account: ", err);
    }
  };
  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ]
    );
  };
  return (
    <ScrollView style={homeStyles.body}>
      <View style={homeStyles.heading}>
        <Text style={homeStyles.logoName}>Settings</Text>
      </View>
      <View style={dataStyles.section}>
        <View style={settingStyles.everyitem}>
          <Text style={dataStyles.sectionHeading}>Personal Details</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Name</Text>
          <Text style={settingStyles.itemDetails}>{profile?.full_name}</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Age (years)</Text>
          <Text style={settingStyles.itemDetails}>{profile?.age}</Text>
        </View>
      </View>
      <View style={dataStyles.section}>
        <View style={settingStyles.everyitem}>
          <Text style={dataStyles.sectionHeading}>Physical Details</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Gender</Text>
          <Text style={settingStyles.itemDetails}>{profile?.gender}</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Weight (kg)</Text>
          <Text style={settingStyles.itemDetails}>{profile?.weight}</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Height (cm)</Text>
          <Text style={settingStyles.itemDetails}>{profile?.height}</Text>
        </View>
      </View>

      <View style={dataStyles.section}>
        <View>
          <Text style={dataStyles.sectionHeading}>Legal</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemDetails}>Terms and Conditions</Text>
          <Ionicons name="chevron-forward" />
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemDetails}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" />
        </View>
        <TouchableOpacity
          style={settingStyles.everyitem}
          onPress={confirmDelete}
        >
          <Text style={settingStyles.itemDetails}>Delete Account?</Text>
          <Ionicons name="chevron-forward" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
