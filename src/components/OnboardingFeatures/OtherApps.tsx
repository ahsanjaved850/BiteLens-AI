import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export const OtherApps: React.FC = () => {
  const [oldUser, setOldUser] = useState<string>("");

  const handlePress = (selectedOption: string) => {
    setOldUser(selectedOption);
  };

  const options = (label: string) => {
    const isSelected = oldUser === label;
    return (
      <TouchableOpacity
        style={[
          formstyle.DataDetails,
          {
            backgroundColor: isSelected ? "black" : "white",
          },
        ]}
        onPress={() => handlePress(label)}
      >
        <Text
          style={[
            formstyle.formText,
            { color: isSelected ? "white" : "black" },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  console.log(oldUser);
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>About the Past</Text>
        <Text style={introstyle.introLine}>
          Have you tried other calories apps?
        </Text>
      </View>
      <View style={formstyle.dataForm}>
        {options("Yes")}
        {options("No")}
      </View>
    </View>
  );
};
