import { dataAnalysis } from "@/src/utils/dataAnalysis";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../Home/Home.style";
import { dataStyles } from "./Data.style";

export const DataOverview = () => {
  const [bmiScored, setBmiScored] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await dataAnalysis(90, 175, 25);
      setBmiScored(result);
    };
    fetchData();
  }, [bmiScored]);

  return (
    <ScrollView style={homeStyles.body}>
      <View style={homeStyles.heading}>
        <Text style={homeStyles.logoName}>Overview</Text>
      </View>
      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Goal Weight</Text>
        <View style={dataStyles.cardStyle}>
          <Text style={homeStyles.impDetails}>70Kg</Text>
          <TouchableOpacity style={dataStyles.updateButton}>
            <Text style={dataStyles.update}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Current Weight</Text>
        <View>
          <View style={dataStyles.cardStyle}>
            <Text style={homeStyles.impDetails}>80kg</Text>
            <TouchableOpacity style={dataStyles.updateButton}>
              <Text style={dataStyles.update}>Log Weight</Text>
            </TouchableOpacity>
          </View>
          <Text style={homeStyles.notesDetails}>
            Try to update once a week so we can adjust your plan to ensure you
            hit goal!
          </Text>
        </View>
      </View>
      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Your BMI</Text>
        <Text>Your BMI score: {bmiScored?.BMI}</Text>
        <Text>Category: {bmiScored?.Category}</Text>
      </View>
    </ScrollView>
  );
};
