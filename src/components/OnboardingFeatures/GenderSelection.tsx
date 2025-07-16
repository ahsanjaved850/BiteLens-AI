import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export const GenderSelection: React.FC = () => {
  const [gender, setGender] = useState<string>("");

  const handlePress = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const options = (label: string) => {
    const isSelected = gender === label;
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
  console.log(gender);
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>Choose your Gender</Text>
        <Text style={introstyle.introLine}>
          This will help us develop the customize plan for you.
        </Text>
      </View>
      <View style={formstyle.dataForm}>
        {options("Male")}
        {options("Female")}
        {options("Others")}
      </View>
    </View>
  );
};
