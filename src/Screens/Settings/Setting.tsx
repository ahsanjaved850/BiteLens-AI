import { Ionicons } from "@expo/vector-icons";
import { JSX } from "react";
import { ScrollView, Text, View } from "react-native";
import { dataStyles } from "../Data/Data.style";
import { homeStyles } from "../Home/Home.style";
import { settingStyles } from "./Setting.style";

export const Setting = (): JSX.Element => {
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
          <Text style={settingStyles.itemDetails}>Ahsan Javed</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Birthday</Text>
          <Text style={settingStyles.itemDetails}>April 05</Text>
        </View>
      </View>
      <View style={dataStyles.section}>
        <View style={settingStyles.everyitem}>
          <Text style={dataStyles.sectionHeading}>Physical Details</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Gender</Text>
          <Text style={settingStyles.itemDetails}>Male</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Age</Text>
          <Text style={settingStyles.itemDetails}>25</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Height</Text>
          <Text style={settingStyles.itemDetails}>6ft</Text>
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
