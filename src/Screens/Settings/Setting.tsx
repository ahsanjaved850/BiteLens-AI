import { getProfile } from "@/backend/getData";
import { Ionicons } from "@expo/vector-icons";
import { JSX, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { dataStyles } from "../Data/Data.style";
import { homeStyles } from "../Home/Home.style";
import { settingStyles } from "./Setting.style";

export const Setting = (): JSX.Element => {
  const [profile, setProfile] = useState<any>(null);
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
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemDetails}>Delete Account?</Text>
          <Ionicons name="chevron-forward" />
        </View>
      </View>
    </ScrollView>
  );
};
