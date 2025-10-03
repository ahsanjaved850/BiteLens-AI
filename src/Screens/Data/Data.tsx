import { getProfile } from "@/backend/getData";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../Home/Home.style";
import { dataStyles } from "./Data.style";

export const DataOverview = () => {
  const [bmiScored, setBmiScored] = useState<string | undefined>();
  const [profile, setProfile] = useState<any>(null);

  const handleCurrentWeight = () => {};
  const handleGoalWeight = () => {};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        console.log(err);
      }
    };
    //    const fetchData = async () => {
    //     const result = await dataAnalysis(
    //        profile?.weight,
    //        profile?.height,
    //        profile?.age,
    //        profile?.target_weight,
    //        profile?.gender,
    //        profile?.goal
    //      );
    //      setBmiScored(result);
    //    };
    //    fetchData();

    fetchProfile();
  }, [profile, handleCurrentWeight]);

  return (
    <ScrollView style={homeStyles.body}>
      <View style={homeStyles.heading}>
        <Text style={homeStyles.logoName}>Overview</Text>
      </View>
      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Goal Weight</Text>
        <View style={dataStyles.cardStyle}>
          <Text style={homeStyles.impDetails}>{profile?.target_weight}kg</Text>
          <TouchableOpacity
            style={dataStyles.updateButton}
            onPress={handleGoalWeight}
          >
            <Text style={dataStyles.update}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Current Weight</Text>
        <View>
          <View style={dataStyles.cardStyle}>
            <Text style={homeStyles.impDetails}>{profile?.weight}kg</Text>
            <TouchableOpacity
              style={dataStyles.updateButton}
              onPress={handleCurrentWeight}
            >
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
        <Text style={dataStyles.sectionHeading}>BMI</Text>
        <Text>
          Your BMI score:{" "}
          {<Text style={dataStyles.sectionHeading}>{bmiScored?.BMI}</Text>}
        </Text>
        <Text>
          Category:{" "}
          {<Text style={dataStyles.sectionHeading}>{bmiScored?.Category}</Text>}
        </Text>
      </View>
    </ScrollView>
  );
};
