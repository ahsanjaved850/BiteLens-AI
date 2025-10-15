import React, { JSX, useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getProfile } from "@/backend/getData";
import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { NutritionData } from "@/src/utils/sendImageToAI";
import { dataStyles } from "../Data/Data.style";
import { introstyle } from "../Onboarding/Onboarding.style";
import { homeStyles } from "./Home.style";

export const Home = (): JSX.Element => {
  const [profile, setProfile] = useState<any>(null);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<NutritionData | null>(
    null
  );
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);
  useEffect(() => {
    if (!profile) return;
    const fetchNutrition = async () => {
      try {
        // const dailyData = await dataAnalysis(
        //   profile.weight,
        //   profile.height,
        //   profile.age,
        //   profile.targetWeight,
        //   profile.gender,
        //   profile.goal
        // );
        setDailyNutrition({
          calories: dailyData.calories,
          protein: dailyData.protein,
          carbs: dailyData.carbs,
          fats: dailyData.fats,
        });
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchNutrition();
  }, [profile]);
  console.log("homescreen");
  const handleNutritionResult = (data: NutritionData) => {
    setNutrition(data);
  };
  return (
    <ScrollView style={homeStyles.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={introstyle.logoContainer}>
        <Image
          style={introstyle.logo}
          source={require("@/assets/images/app_icon.png")}
        />
        <Text style={introstyle.headerName}>GreenBite AI</Text>
      </View>

      <View style={homeStyles.dailyDetails}>
        <View style={homeStyles.userProfile}>
          <Text style={homeStyles.impDetails}>Hi {profile?.full_name},</Text>
          <Text>{new Date().toDateString()}</Text>
        </View>

        <View style={homeStyles.caloriesCard}>
          <Text style={homeStyles.impDetails}>Calories</Text>
          <Text style={{ fontSize: 24 }}>
            {dailyNutrition?.calories
              ? Number(dailyNutrition.calories) - Number(nutrition?.calories)
              : "2300"}
          </Text>
        </View>
        <View style={homeStyles.macroNutrients}>
          <View style={homeStyles.nutrientsCard}>
            <Text>Protein</Text>
            <Text style={{ fontSize: 36 }}>
              {Number(dailyNutrition?.protein) - Number(nutrition?.protein) ||
                "180"}
            </Text>
          </View>
          <View style={homeStyles.nutrientsCard}>
            <Text>Carbs</Text>
            <Text style={{ fontSize: 36 }}>
              {Number(dailyNutrition?.carbs) - Number(nutrition?.carbs) ||
                "230"}
            </Text>
          </View>
          <View style={homeStyles.nutrientsCard}>
            <Text>Fats</Text>
            <Text style={{ fontSize: 36 }}>
              {Number(dailyNutrition?.fats) - Number(nutrition?.fats) || "90"}
            </Text>
          </View>
        </View>
      </View>

      <View style={dataStyles.section}>
        <Text style={dataStyles.sectionHeading}>Recently eaten</Text>
        <Text style={homeStyles.notesDetails}>
          Click on + to start tracking today’s meal by taking a picture
        </Text>
      </View>

      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <TouchableOpacity style={homeStyles.button}>
          <Text style={homeStyles.plus}>+</Text>
        </TouchableOpacity>
      </View>
      <ImageExamine onResult={handleNutritionResult} />
    </ScrollView>
  );
};
