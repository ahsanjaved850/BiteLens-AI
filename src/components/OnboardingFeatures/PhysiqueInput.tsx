import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useState } from "react";
import { StatusBar, Text, TextInput, View } from "react-native";

export const PhysiqueInput: React.FC = () => {
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");

  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>Write Age, Height & Weight</Text>
        <Text style={introstyle.introLine}>
          This will help us to understand about you physique.
        </Text>
      </View>
      <View style={formstyle.dataForm}>
        <TextInput
          placeholder="Age (years)"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />
        <TextInput
          placeholder="Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />

        <TextInput
          placeholder="Weight (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />
        <TextInput
          placeholder="Target Weight (kg)"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />
      </View>
    </View>
  );
};
