import React, { JSX, useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { NutritionData } from "@/src/utils/sendImageToAI";
import { dataStyles } from "../Data/Data.style";
import { introstyle } from "../Onboarding/Onboarding.style";
import { homeStyles } from "./Home.style";

export const Home = (): JSX.Element => {
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<NutritionData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      // const result = await dataAnalysis(90, 175, 25);
      // setDailyNutrition(result);
    };
    fetchData();
  }, []);

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
          <Text style={homeStyles.impDetails}>Hi Ahsan,</Text>
          <Text>{new Date().toDateString()}</Text>
        </View>

        <View style={homeStyles.caloriesCard}>
          <Text style={homeStyles.impDetails}>
            Calories {dailyNutrition?.calories}
          </Text>
          <Text>
            {nutrition?.calories ? nutrition.calories : "No data yet"}
          </Text>
        </View>

        <View style={homeStyles.macroNutrients}>
          <Text style={homeStyles.nutrientsCard}>
            Protein: {dailyNutrition?.protein || "--"}
          </Text>
          <Text style={homeStyles.nutrientsCard}>
            Carbs: {dailyNutrition?.carbs || "--"}
          </Text>
          <Text style={homeStyles.nutrientsCard}>
            Fats: {dailyNutrition?.fats || "--"}
          </Text>
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
