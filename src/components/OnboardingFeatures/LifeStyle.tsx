import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export const LifeStyle: React.FC = () => {
  const [lifeStyle, setLifeStyle] = useState<string>("");

  const handlePress = (selectedOption: string) => {
    setLifeStyle(selectedOption);
  };

  const options = (label: string) => {
    const isSelected = lifeStyle === label;

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
  console.log(lifeStyle);
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>Choose Target Life Style?</Text>
        <Text style={introstyle.introLine}>
          What would you like to accomplish?
        </Text>
      </View>
      <View style={formstyle.dataForm}>
        {options("Eat and live healthier")}
        {options("Feel better about my body")}
        {options("Stay consisted and motivated")}
      </View>
    </View>
  );
};
