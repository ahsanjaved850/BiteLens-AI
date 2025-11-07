import { JSX, useCallback, useEffect, useRef, useState } from "react";

import {
  Animated,
  Image,
  Modal,
  PanResponder,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";

import { getInitialDetails, getProfile } from "@/backend/getData";
import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { LoadingState } from "@/src/components/LoadingState/LoadingState";
import { ProgressCircle } from "@/src/components/ProgressCircle/ProgressCircle";
import { NutritionData } from "@/src/utils/sendImageToAI";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeStyles } from "./Home.style";

interface MealEntry {
  id: string;
  image: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  sugar: string; // ADDED
  sodium: string; // ADDED
  fiber: string; // ADDED
  expanded: boolean;
}

export const Home = (): JSX.Element => {
  const [profile, setProfile] = useState<any>(null);
  const [initialDetails, setInitialDetails] = useState<any>(null);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [calorieProgress, setCalorieProgress] = useState(0);
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);

  // Animation values
  const scaleAnim = new Animated.Value(1);
  const modalSlideAnim = useRef(new Animated.Value(0)).current;

  // Pan responder for swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalSlideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Swipe down more than 100px closes the modal
          closeModalWithAnimation();
        } else {
          // Snap back to original position
          Animated.spring(modalSlideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeModalWithAnimation = () => {
    Vibration.vibrate(10);
    Animated.timing(modalSlideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      modalSlideAnim.setValue(0);
    });
  };

  const handleModalClose = () => {
    Vibration.vibrate(10);
    setModalVisible(false);
  };

  // Fetch data function
  const fetchData = useCallback(
    async (showRefreshing = false) => {
      try {
        if (showRefreshing) setRefreshing(true);
        else setPageLoading(true);

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
          sugar: "50", // ADDED - default daily limit
          sodium: "2300", // ADDED - default daily limit
          fiber: "30", // ADDED - default daily target
        });

        // Initialize nutrition as zero/empty only if it's not set
        if (!nutrition) {
          setNutrition({
            calories: "0",
            protein: "0",
            carbs: "0",
            fats: "0",
            // sugar: "0", // ADDED
            // sodium: "0", // ADDED
            // fiber: "0", // ADDED
          });
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
      } finally {
        if (showRefreshing) setRefreshing(false);
        else setPageLoading(false);
      }
    },
    [nutrition]
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const refreshInitialDetails = async () => {
        try {
          const initialDetailsData = await getInitialDetails();

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
              sugar: "50", // ADDED
              sodium: "2300", // ADDED
              fiber: "30", // ADDED
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
    // Haptic feedback for success
    Vibration.vibrate(50);

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
      sugar: "10", // ADDED - with default
      sodium: "200", // ADDED - with default
      fiber: "3", // ADDED - with default
      expanded: false,
    };

    setMealHistory([newMeal, ...mealHistory]);

    // Update total nutrition consumed
    const previousCalories = Number(nutrition?.calories || 0);
    const previousProtein = Number(nutrition?.protein || 0);
    const previousCarbs = Number(nutrition?.carbs || 0);
    const previousFats = Number(nutrition?.fats || 0);
    const previousSugar = Number(0); // ADDED
    const previousSodium = Number(0); // ADDED
    const previousFiber = Number(0); // ADDED

    setNutrition({
      calories: (previousCalories + Number(data.calories)).toString(),
      protein: (previousProtein + Number(data.protein)).toString(),
      carbs: (previousCarbs + Number(data.carbs)).toString(),
      fats: (previousFats + Number(data.fats)).toString(),
      // sugar: (previousSugar + Number(newMeal.sugar)).toString(), // ADDED
      // sodium: (previousSodium + Number(newMeal.sodium)).toString(), // ADDED
      // fiber: (previousFiber + Number(newMeal.fiber)).toString(), // ADDED
    });

    handleModalClose();
  };

  const toggleMealExpanded = (id: string) => {
    Vibration.vibrate(10);
    setMealHistory(
      mealHistory.map((meal) =>
        meal.id === id ? { ...meal, expanded: !meal.expanded } : meal
      )
    );
  };

  const handleButtonPressIn = () => {
    Vibration.vibrate(10);
    setButtonPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    setButtonPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleModalOpen = () => {
    Vibration.vibrate(10);
    setModalVisible(true);
  };

  if (pageLoading) {
    return <LoadingState />;
  }

  // Calculate remaining nutrients
  const caloriesRemaining = Math.max(
    0,
    Number(dailyNutrition?.calories || 0) - Number(nutrition?.calories || 0)
  );
  const proteinRemaining = Math.max(
    0,
    Number(dailyNutrition?.protein || 0) - Number(nutrition?.protein || 0)
  );
  const carbsRemaining = Math.max(
    0,
    Number(dailyNutrition?.carbs || 0) - Number(nutrition?.carbs || 0)
  );
  const fatsRemaining = Math.max(
    0,
    Number(dailyNutrition?.fats || 0) - Number(nutrition?.fats || 0)
  );
  // ADDED - Calculate remaining for new nutrients
  const sugarRemaining = Math.max(
    0,
    Number(dailyNutrition?.sugar || 50) - Number(0)
  );
  const sodiumRemaining = Math.max(
    0,
    Number(dailyNutrition?.sodium || 2300) - Number(0)
  );
  const fiberRemaining = Math.max(
    0,
    Number(dailyNutrition?.fiber || 30) - Number(0)
  );

  // Calculate progress percentages
  const proteinProgress = Math.min(
    ((Number(dailyNutrition?.protein || 0) - proteinRemaining) /
      Number(dailyNutrition?.protein || 1)) *
      100,
    100
  );
  const carbsProgress = Math.min(
    ((Number(dailyNutrition?.carbs || 0) - carbsRemaining) /
      Number(dailyNutrition?.carbs || 1)) *
      100,
    100
  );
  const fatsProgress = Math.min(
    ((Number(dailyNutrition?.fats || 0) - fatsRemaining) /
      Number(dailyNutrition?.fats || 1)) *
      100,
    100
  );
  // ADDED - Calculate progress for new nutrients
  const sugarProgress = Math.min(
    ((Number(dailyNutrition?.sugar || 50) - sugarRemaining) /
      Number(dailyNutrition?.sugar || 50)) *
      100,
    100
  );
  const sodiumProgress = Math.min(
    ((Number(dailyNutrition?.sodium || 2300) - sodiumRemaining) /
      Number(dailyNutrition?.sodium || 2300)) *
      100,
    100
  );
  const fiberProgress = Math.min(
    ((Number(dailyNutrition?.fiber || 30) - fiberRemaining) /
      Number(dailyNutrition?.fiber || 30)) *
      100,
    100
  );

  return (
    <SafeAreaView style={homeStyles.container}>
      {loading && <LoadingState />}

      <ScrollView
        style={homeStyles.body}
        contentContainerStyle={homeStyles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header - UNCHANGED */}
        <View style={homeStyles.headerContainer}>
          <View style={homeStyles.headerRow}>
            <View style={homeStyles.logoContainer}>
              <Image
                source={require("@/assets/images/app_icon.png")}
                style={homeStyles.logo}
              />
              <Text style={homeStyles.logoName}>CalTrack</Text>
            </View>
          </View>

          <View style={homeStyles.greetingContainer}>
            {/* <Text style={homeStyles.dateText}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text> */}
          </View>
        </View>

        {/* Daily Summary Card - UNCHANGED */}
        <View style={homeStyles.dailySummaryCard}>
          <View style={homeStyles.summaryHeader}>
            <Text style={homeStyles.summaryTitle}>Daily Summary</Text>
          </View>

          {/* Progress Circle - UNCHANGED */}
          <View style={homeStyles.progressContainer}>
            <ProgressCircle
              progress={calorieProgress}
              size={160}
              strokeWidth={12}
              color="#3B82F6"
            />
            <Text style={homeStyles.progressLabel}>Calories</Text>
            <Text style={homeStyles.calorieCount}>
              {nutrition?.calories || 0}
              <Text style={homeStyles.calorieTarget}>
                {" "}
                / {dailyNutrition?.calories || 0}
                {" kcal"}
              </Text>
            </Text>
          </View>

          {/* Macro Nutrients Section - UNCHANGED BUT ADDED 3 MORE CARDS */}
          <View style={homeStyles.macroSection}>
            <Text style={homeStyles.macroHeader}>Macros</Text>
            <View style={homeStyles.macroNutrients}>
              {/* Protein Card */}
              <View style={homeStyles.nutrientsCard}>
                <View style={[homeStyles.nutrientIcon, homeStyles.proteinIcon]}>
                  <Ionicons name="fitness" size={20} color="#EF4444" />
                </View>
                <Text style={homeStyles.nutrientsLabel}>Protein</Text>
                <Text style={homeStyles.nutrientsValue}>
                  {dailyNutrition?.protein - proteinRemaining || 0}
                </Text>
                <Text style={homeStyles.nutrientsTotal}>
                  / {dailyNutrition?.protein || 0}g
                </Text>
                <View style={homeStyles.nutrientsProgress}>
                  <View
                    style={[
                      homeStyles.nutrientsProgressBar,
                      {
                        width: `${Math.min(proteinProgress, 100)}%`,
                        backgroundColor: "#EF4444",
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Carbs Card */}
              <View style={homeStyles.nutrientsCard}>
                <View style={[homeStyles.nutrientIcon, homeStyles.carbsIcon]}>
                  <Ionicons name="flame" size={20} color="#3B82F6" />
                </View>
                <Text style={homeStyles.nutrientsLabel}>Carbs</Text>
                <Text style={homeStyles.nutrientsValue}>
                  {dailyNutrition?.carbs - carbsRemaining || 0}
                </Text>
                <Text style={homeStyles.nutrientsTotal}>
                  / {dailyNutrition?.carbs || 0}g
                </Text>
                <View style={homeStyles.nutrientsProgress}>
                  <View
                    style={[
                      homeStyles.nutrientsProgressBar,
                      {
                        width: `${Math.min(carbsProgress, 100)}%`,
                        backgroundColor: "#3B82F6",
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Fats Card */}
              <View style={homeStyles.nutrientsCard}>
                <View style={[homeStyles.nutrientIcon, homeStyles.fatsIcon]}>
                  <Ionicons name="water" size={20} color="#F59E0B" />
                </View>
                <Text style={homeStyles.nutrientsLabel}>Fats</Text>
                <Text style={homeStyles.nutrientsValue}>
                  {dailyNutrition?.fats - fatsRemaining || 0}
                </Text>
                <Text style={homeStyles.nutrientsTotal}>
                  / {dailyNutrition?.fats || 0}g
                </Text>
                <View style={homeStyles.nutrientsProgress}>
                  <View
                    style={[
                      homeStyles.nutrientsProgressBar,
                      {
                        width: `${Math.min(fatsProgress, 100)}%`,
                        backgroundColor: "#F59E0B",
                      },
                    ]}
                  />
                </View>
              </View>

              {/* ============ ADDED: Sugar Card ============ */}
              <View style={homeStyles.nutrientsCard}>
                <View style={[homeStyles.nutrientIcon, homeStyles.sugarIcon]}>
                  <Ionicons name="sparkles" size={20} color="#E11D48" />
                </View>
                <Text style={homeStyles.nutrientsLabel}>Sugar</Text>
                <Text style={homeStyles.nutrientsValue}>
                  {Number(dailyNutrition?.sugar || 50) - sugarRemaining}
                </Text>
                <Text style={homeStyles.nutrientsTotal}>
                  / {dailyNutrition?.sugar || 50}g
                </Text>
                <View style={homeStyles.nutrientsProgress}>
                  <View
                    style={[
                      homeStyles.nutrientsProgressBar,
                      {
                        width: `${Math.min(sugarProgress, 100)}%`,
                        backgroundColor: "#E11D48",
                      },
                    ]}
                  />
                </View>
              </View>

              {/* ============ ADDED: Sodium Card ============ */}
              <View style={homeStyles.nutrientsCard}>
                <View style={[homeStyles.nutrientIcon, homeStyles.sodiumIcon]}>
                  <Ionicons name="diamond" size={20} color="#8B5CF6" />
                </View>
                <Text style={homeStyles.nutrientsLabel}>Sodium</Text>
                <Text style={homeStyles.nutrientsValue}>
                  {Math.round(
                    (Number(dailyNutrition?.sodium || 2300) - sodiumRemaining) /
                      100
                  ) / 10}
                </Text>
                <Text style={homeStyles.nutrientsTotal}>
                  /{" "}
                  {Math.round(Number(dailyNutrition?.sodium || 2300) / 100) /
                    10}
                  g
                </Text>
                <View style={homeStyles.nutrientsProgress}>
                  <View
                    style={[
                      homeStyles.nutrientsProgressBar,
                      {
                        width: `${Math.min(sodiumProgress, 100)}%`,
                        backgroundColor: "#8B5CF6",
                      },
                    ]}
                  />
                </View>
              </View>

              {/* ============ ADDED: Fiber Card ============ */}
              <View style={homeStyles.nutrientsCard}>
                <View style={[homeStyles.nutrientIcon, homeStyles.fiberIcon]}>
                  <Ionicons name="leaf" size={20} color="#059669" />
                </View>
                <Text style={homeStyles.nutrientsLabel}>Fiber</Text>
                <Text style={homeStyles.nutrientsValue}>
                  {Number(dailyNutrition?.fiber || 30) - fiberRemaining}
                </Text>
                <Text style={homeStyles.nutrientsTotal}>
                  / {dailyNutrition?.fiber || 30}g
                </Text>
                <View style={homeStyles.nutrientsProgress}>
                  <View
                    style={[
                      homeStyles.nutrientsProgressBar,
                      {
                        width: `${Math.min(fiberProgress, 100)}%`,
                        backgroundColor: "#059669",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Add Meal Button - UNCHANGED */}
        <View style={homeStyles.addMealContainer}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                homeStyles.addMealButton,
                buttonPressed && homeStyles.addMealButtonPressed,
              ]}
              onPress={handleModalOpen}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
          <Text style={homeStyles.addMealText}>Log Meal</Text>
        </View>

        {/* Meal History Section - UNCHANGED */}
        {mealHistory.length > 0 ? (
          <View style={homeStyles.mealHistorySection}>
            <View style={homeStyles.sectionHeader}>
              <Text style={homeStyles.sectionTitle}>{"Today's Meals"}</Text>
              {mealHistory.length > 3 && (
                <TouchableOpacity>
                  <Text style={homeStyles.viewAllButton}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {mealHistory.map((meal) => (
              <View key={meal.id} style={homeStyles.mealItem}>
                <TouchableOpacity
                  style={homeStyles.mealItemHeader}
                  onPress={() => toggleMealExpanded(meal.id)}
                  activeOpacity={0.7}
                >
                  <View style={homeStyles.mealImageContainer}>
                    {meal.image ? (
                      <Image
                        source={{ uri: meal.image }}
                        style={homeStyles.mealImage}
                      />
                    ) : (
                      <View style={homeStyles.mealPlaceholder}>
                        <Ionicons name="image-outline" size={32} color="#999" />
                      </View>
                    )}
                  </View>

                  <View style={homeStyles.mealHeaderInfo}>
                    <Text style={homeStyles.mealTime}>{meal.time}</Text>
                    <Text style={homeStyles.mealCalories}>{meal.calories}</Text>
                    <Text style={homeStyles.mealCalorieLabel}>calories</Text>
                  </View>

                  <View style={homeStyles.expandButton}>
                    <Ionicons
                      name={meal.expanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </View>
                </TouchableOpacity>

                {meal.expanded && (
                  <View style={homeStyles.mealDetailsContainer}>
                    <View style={homeStyles.macroGrid}>
                      <View style={homeStyles.macroDetailCard}>
                        <Text style={homeStyles.macroDetailLabel}>Protein</Text>
                        <Text style={homeStyles.macroDetailValue}>
                          {meal.protein}
                        </Text>
                        <Text style={homeStyles.macroDetailUnit}>grams</Text>
                      </View>
                      <View style={homeStyles.macroDetailCard}>
                        <Text style={homeStyles.macroDetailLabel}>Carbs</Text>
                        <Text style={homeStyles.macroDetailValue}>
                          {meal.carbs}
                        </Text>
                        <Text style={homeStyles.macroDetailUnit}>grams</Text>
                      </View>
                      <View style={homeStyles.macroDetailCard}>
                        <Text style={homeStyles.macroDetailLabel}>Fats</Text>
                        <Text style={homeStyles.macroDetailValue}>
                          {meal.fats}
                        </Text>
                        <Text style={homeStyles.macroDetailUnit}>grams</Text>
                      </View>
                    </View>
                    {/* ADDED - Show additional nutrients in expanded view */}
                    <View style={[homeStyles.macroGrid, { marginTop: 8 }]}>
                      <View style={homeStyles.macroDetailCard}>
                        <Text style={homeStyles.macroDetailLabel}>Sugar</Text>
                        <Text style={homeStyles.macroDetailValue}>
                          {meal.sugar}
                        </Text>
                        <Text style={homeStyles.macroDetailUnit}>grams</Text>
                      </View>
                      <View style={homeStyles.macroDetailCard}>
                        <Text style={homeStyles.macroDetailLabel}>Sodium</Text>
                        <Text style={homeStyles.macroDetailValue}>
                          {meal.sodium}
                        </Text>
                        <Text style={homeStyles.macroDetailUnit}>mg</Text>
                      </View>
                      <View style={homeStyles.macroDetailCard}>
                        <Text style={homeStyles.macroDetailLabel}>Fiber</Text>
                        <Text style={homeStyles.macroDetailValue}>
                          {meal.fiber}
                        </Text>
                        <Text style={homeStyles.macroDetailUnit}>grams</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={homeStyles.emptyStateContainer}>
            <Text style={homeStyles.emptyStateIcon}>🍽️</Text>
            <Text style={homeStyles.emptyStateTitle}>No meals logged yet</Text>
            <Text style={homeStyles.emptyStateText}>
              Start tracking your nutrition by taking a photo of your meal
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Meal Modal - UNCHANGED */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={homeStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  homeStyles.modalContent,
                  {
                    transform: [{ translateY: modalSlideAnim }],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <View style={homeStyles.modalHandle}>
                  <View style={homeStyles.modalHandleBar} />
                </View>

                <Text style={homeStyles.modalTitle}>Add Meal</Text>

                <ImageExamine
                  onResult={handleNutritionResult}
                  onLoading={setLoading}
                  onClose={handleModalClose}
                />

                <View style={homeStyles.modalButtonContainer}>
                  <TouchableOpacity
                    onPress={handleModalClose}
                    style={homeStyles.cancelButton}
                  >
                    <Text style={homeStyles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};
