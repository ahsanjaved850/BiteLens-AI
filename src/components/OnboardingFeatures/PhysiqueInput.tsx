import { updatePhysique } from "@/backend/sendData";
import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";

export const PhysiqueInput: React.FC = () => {
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");

  useEffect(() => {
    updatePhysique(age, height, weight, targetWeight);
  }, [targetWeight]);

  const handleAge = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    setAge(e.nativeEvent.text);
  };
  const handleHeight = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setHeight(e.nativeEvent.text);
  };
  const handleWeight = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setWeight(e.nativeEvent.text);
  };
  const handleTargetWeight = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setTargetWeight(e.nativeEvent.text);
  };

  console.log(age, height, weight, targetWeight);
  return (
    <ScrollView style={formstyle.body}>
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
          defaultValue={age}
          onEndEditing={handleAge}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />
        <TextInput
          placeholder="Height (cm)"
          defaultValue={height}
          onEndEditing={handleHeight}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />

        <TextInput
          placeholder="Weight (kg)"
          defaultValue={weight}
          onEndEditing={handleWeight}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />
        <TextInput
          placeholder="Target Weight (kg)"
          defaultValue={targetWeight}
          onEndEditing={handleTargetWeight}
          keyboardType="numeric"
          style={formstyle.DataDetails}
        />
      </View>
    </ScrollView>
  );
};
