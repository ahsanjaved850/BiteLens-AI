import React, { JSX, useCallback, useEffect, useState } from "react";

import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getInitialDetails, getProfile } from "@/backend/getData";
import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { LoadingState } from "@/src/components/LoadingState/LoadingState";
import { ProgressCircle } from "@/src/components/ProgressCircle/ProgressCircle";
import { NutritionData } from "@/src/utils/sendImageToAI";
import { useFocusEffect } from "@react-navigation/native";
import { introstyle } from "../Onboarding/Onboarding.style";
import { homeStyles } from "./Home.style";

interface MealEntry {
  id: string;
  image: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  expanded: boolean;
}

export const Home = (): JSX.Element => {
  const [profile, setProfile] = useState<any>(null);
  const [initialDetails, setInitialDetails] = useState<any>(null);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calorieProgress, setCalorieProgress] = useState(0);
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setPageLoading(true);
      const profileData = await getProfile();
      const initialDetailsData = await getInitialDetails();

      setProfile(profileData);
      setInitialDetails(initialDetailsData);

      // Set daily nutrition from backend initial_details table
      setDailyNutrition({
        calories: initialDetailsData?.calories?.toString() || "2300",
        protein: initialDetailsData?.protein?.toString() || "180",
        carbs: initialDetailsData?.carbs?.toString() || "230",
        fats: initialDetailsData?.fats?.toString() || "90",
      });

      // Initialize nutrition as zero/empty only if it's not set
      if (!nutrition) {
        setNutrition({
          calories: "0",
          protein: "0",
          carbs: "0",
          fats: "0",
        });
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setPageLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when screen comes into focus (user returns from Data tab)
  useFocusEffect(
    useCallback(() => {
      // Fetch latest initial details when user comes back to Home
      const refreshInitialDetails = async () => {
        try {
          const initialDetailsData = await getInitialDetails();

          // Only update if data actually changed to prevent unnecessary re-renders
          if (
            initialDetailsData?.calories !== initialDetails?.calories ||
            initialDetailsData?.protein !== initialDetails?.protein ||
            initialDetailsData?.carbs !== initialDetails?.carbs ||
            initialDetailsData?.fats !== initialDetails?.fats
          ) {
            setInitialDetails(initialDetailsData);
            setDailyNutrition({
              calories: initialDetailsData?.calories?.toString() || "2300",
              protein: initialDetailsData?.protein?.toString() || "180",
              carbs: initialDetailsData?.carbs?.toString() || "230",
              fats: initialDetailsData?.fats?.toString() || "90",
            });
          }
        } catch (err) {
          console.error("Error refreshing initial details:", err);
        }
      };

      refreshInitialDetails();
    }, [initialDetails])
  );

  // Calculate calorie progress whenever nutrition data changes
  useEffect(() => {
    if (dailyNutrition?.calories && nutrition?.calories) {
      const consumed = Number(nutrition.calories);
      const daily = Number(dailyNutrition.calories);
      const progress = Math.min((consumed / daily) * 100, 100);
      setCalorieProgress(Math.round(progress));
    }
  }, [nutrition, dailyNutrition]);

  const handleNutritionResult = (data: NutritionData, imageUri: string) => {
    // Add meal to history with API result data
    const newMeal: MealEntry = {
      id: Date.now().toString(),
      image: imageUri,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fats: data.fats,
      expanded: true,
    };

    setMealHistory([newMeal, ...mealHistory]);

    // Update total nutrition consumed
    const previousCalories = Number(nutrition?.calories || 0);
    const previousProtein = Number(nutrition?.protein || 0);
    const previousCarbs = Number(nutrition?.carbs || 0);
    const previousFats = Number(nutrition?.fats || 0);

    setNutrition({
      calories: (previousCalories + Number(data.calories)).toString(),
      protein: (previousProtein + Number(data.protein)).toString(),
      carbs: (previousCarbs + Number(data.carbs)).toString(),
      fats: (previousFats + Number(data.fats)).toString(),
    });

    setModalVisible(false);
    setLoading(false);
  };

  const toggleMealExpanded = (id: string) => {
    setMealHistory(
      mealHistory.map((meal) =>
        meal.id === id ? { ...meal, expanded: !meal.expanded } : meal
      )
    );
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const remaining = dailyNutrition?.calories
    ? Number(dailyNutrition.calories) - Number(nutrition?.calories || 0)
    : 0;

  if (pageLoading) {
    return <LoadingState type="setup" message="Loading your dashboard..." />;
  }

  if (loading) {
    return <LoadingState type="analysis" />;
  }

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

        <View style={homeStyles.progressContainer}>
          <ProgressCircle progress={calorieProgress} message="Calories" />
          <Text style={homeStyles.progressLabel}>
            {remaining} kcal remaining
          </Text>
        </View>

        <View style={homeStyles.macroNutrients}>
          <View style={homeStyles.nutrientsCard}>
            <Text style={homeStyles.nutrientsLabel}>Protein</Text>
            <Text style={homeStyles.nutrientsValue}>
              {Number(dailyNutrition?.protein || 0) -
                Number(nutrition?.protein || 0) || "--"}
            </Text>
            <Text style={homeStyles.nutrientsRemaining}>grams remaining</Text>
          </View>
          <View style={homeStyles.nutrientsCard}>
            <Text style={homeStyles.nutrientsLabel}>Carbs</Text>
            <Text style={homeStyles.nutrientsValue}>
              {Number(dailyNutrition?.carbs || 0) -
                Number(nutrition?.carbs || 0) || "--"}
            </Text>
            <Text style={homeStyles.nutrientsRemaining}>grams remaining</Text>
          </View>
          <View style={homeStyles.nutrientsCard}>
            <Text style={homeStyles.nutrientsLabel}>Fats</Text>
            <Text style={homeStyles.nutrientsValue}>
              {Number(dailyNutrition?.fats || 0) -
                Number(nutrition?.fats || 0) || "--"}
            </Text>
            <Text style={homeStyles.nutrientsRemaining}>grams remaining</Text>
          </View>
        </View>
      </View>

      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <TouchableOpacity style={homeStyles.button} onPress={handleModalOpen}>
          <Text style={homeStyles.plus}>+</Text>
        </TouchableOpacity>
      </View>

      {mealHistory.length > 0 && (
        <View style={homeStyles.mealHistorySection}>
          {mealHistory.map((meal) => (
            <View key={meal.id} style={homeStyles.mealItem}>
              <TouchableOpacity
                style={homeStyles.mealItemHeader}
                onPress={() => toggleMealExpanded(meal.id)}
              >
                <View style={homeStyles.mealImageContainer}>
                  <Image
                    source={{ uri: meal.image }}
                    style={homeStyles.mealImage}
                  />
                </View>

                <View style={homeStyles.mealHeaderInfo}>
                  <Text style={homeStyles.mealTime}>{meal.time}</Text>
                  <Text style={homeStyles.mealCalories}>
                    {meal.calories} kcal
                  </Text>
                </View>

                <Text
                  style={[
                    homeStyles.mealArrow,
                    {
                      transform: [
                        {
                          rotate: meal.expanded ? "90deg" : "0deg",
                        },
                      ],
                    },
                  ]}
                >
                  →
                </Text>
              </TouchableOpacity>

              {meal.expanded && (
                <View style={homeStyles.mealDetailsContainer}>
                  <View style={homeStyles.mealDetailRow}>
                    <Text style={homeStyles.mealDetailLabel}>Protein</Text>
                    <Text style={homeStyles.mealDetailValue}>
                      {meal.protein}g
                    </Text>
                  </View>
                  <View style={homeStyles.mealDetailRow}>
                    <Text style={homeStyles.mealDetailLabel}>Carbs</Text>
                    <Text style={homeStyles.mealDetailValue}>
                      {meal.carbs}g
                    </Text>
                  </View>
                  <View style={homeStyles.mealDetailRow}>
                    <Text style={homeStyles.mealDetailLabel}>Fats</Text>
                    <Text style={homeStyles.mealDetailValue}>{meal.fats}g</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {mealHistory.length === 0 && (
        <View style={homeStyles.mealHistorySection}>
          <Text style={homeStyles.emptyMealText}>
            No meals logged yet. Start tracking by taking a picture!
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={homeStyles.modalOverlay}>
          <View style={homeStyles.modalContent}>
            <View style={homeStyles.modalHandle}>
              <View style={homeStyles.modalHandleBar} />
            </View>

            <Text style={homeStyles.modalTitle}>Add Meal</Text>

            <ImageExamine
              onResult={handleNutritionResult}
              onLoading={setLoading}
              onClose={() => setModalVisible(false)}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={homeStyles.cancelButton}
            >
              <Text style={homeStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
