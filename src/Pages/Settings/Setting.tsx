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
          <Text style={settingStyles.itemName}>Gender</Text>
          <Text style={settingStyles.itemName}>Male</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Age</Text>
          <Text style={settingStyles.itemName}>25</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Height</Text>
          <Text style={settingStyles.itemName}>6ft</Text>
        </View>
      </View>
      <View style={dataStyles.section}>
        <View style={settingStyles.everyitem}>
          <Text style={dataStyles.sectionHeading}>Personal Details</Text>
          <Ionicons name="chevron-forward" size={14} color="#333" />
        </View>
      </View>
      <View style={dataStyles.section}>
        <View>
          <Text style={dataStyles.sectionHeading}>Legal</Text>
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Terms and Conditions</Text>
          <Ionicons name="chevron-forward" size={14} color="#333" />
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={14} color="#333" />
        </View>
        <View style={settingStyles.everyitem}>
          <Text style={settingStyles.itemName}>Delete Account?</Text>
          <Ionicons name="chevron-forward" size={14} color="#333" />
        </View>
      </View>
    </ScrollView>
  );
};
