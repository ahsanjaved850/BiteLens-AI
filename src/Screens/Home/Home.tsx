import React, { JSX, useState } from "react";

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
import { homeStyles } from "./Home.style";

export const Home = (): JSX.Element => {
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);

  const handleNutritionResult = (data: NutritionData) => {
    setNutrition(data);
  };

  return (
    <ScrollView style={homeStyles.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={homeStyles.heading}>
        <Image
          source={require("@/assets/images/Logo.png")}
          style={homeStyles.logo}
        />
        <Text style={homeStyles.logoName}>VeganCal</Text>
      </View>

      <View style={homeStyles.dailyDetails}>
        <View style={homeStyles.userProfile}>
          <Text style={homeStyles.impDetails}>Hi Ahsan,</Text>
          <Text>{new Date().toDateString()}</Text>
        </View>

        <View style={homeStyles.caloriesCard}>
          <Text style={homeStyles.impDetails}>Calories</Text>
          <Text>
            {nutrition?.calories ? nutrition.calories : "No data yet"}
          </Text>
        </View>

        <View style={homeStyles.macroNutrients}>
          <Text style={homeStyles.nutrientsCard}>
            Protein: {nutrition?.protein || "--"}
          </Text>
          <Text style={homeStyles.nutrientsCard}>
            Carbs: {nutrition?.carbs || "--"}
          </Text>
          <Text style={homeStyles.nutrientsCard}>
            Fats: {nutrition?.fats || "--"}
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
