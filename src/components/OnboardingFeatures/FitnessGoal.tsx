import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export const FitnessGoal: React.FC = () => {
  const [goal, setGoal] = useState<string>("");

  const handlePress = (selectedGoal: string) => {
    setGoal(selectedGoal);
  };
  const options = (label: string) => {
    const isSelected = goal === label;
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
  console.log(goal);
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>
          Choose What is your fitness goal?
        </Text>
        <Text style={introstyle.introLine}>
          This helps us generate a personalize plan for your calories intake.
        </Text>
      </View>
      <View style={formstyle.dataForm}>
        {options("Gain")}
        {options("Maintain")}
        {options("Maintain")}
      </View>
    </View>
  );
};
