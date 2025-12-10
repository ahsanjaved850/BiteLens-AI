import { getInitialDetails } from "@/backend/getData";
import { updateDailyIntake } from "@/backend/sendData";
import {
  fetchUserMeals,
  getTodayNutrition,
  MealData,
} from "@/src/utils/supabase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import {
  DailyNutrition,
  INITIAL_NUTRITION_STATE,
  PROGRESS_COLORS,
  PROGRESS_THRESHOLDS,
} from "./Home.static";

export const useHome = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDetails, setInitialDetails] = useState<DailyNutrition>();
  const [meals, setMeals] = useState<MealData[]>([]);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition>(
    INITIAL_NUTRITION_STATE
  );
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  const loadMeals = async () => {
    try {
      setLoading(true);
      const fetchedMeals = await fetchUserMeals();
      setMeals(fetchedMeals);
      const details = await getInitialDetails();
      setInitialDetails(details);
      const nutrition = await getTodayNutrition();
      setTodayNutrition(nutrition);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMeals();
  };

  const handleAddMealPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleMealSuccess = async (mealData: MealData) => {
    try {
      await updateDailyIntake(
        mealData.calories,
        mealData.protein,
        mealData.carbs,
        mealData.fat,
        mealData.sugar || 0,
        mealData.sodium || 0,
        mealData.fiber || 0
      );
      setModalVisible(false);
      loadMeals();
    } catch (error) {
      console.error("Error updating daily intake:", error);
      setModalVisible(false);
      loadMeals();
    }
  };

  const handleToggleMealExpansion = (mealId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  };

  const handleMealPress = (meal: MealData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation as any).navigate("mealDetails", { meal });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `Today at ${time}`;
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return `Yesterday at ${time}`;
    } else {
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
      return `${dateStr} at ${time}`;
    }
  };

  const getProgressColor = (value: number, goal: number) => {
    const percentage = (value / goal) * 100;
    if (percentage < PROGRESS_THRESHOLDS.LOW) return PROGRESS_COLORS.LOW;
    if (percentage < PROGRESS_THRESHOLDS.MEDIUM) return PROGRESS_COLORS.MEDIUM;
    if (percentage < PROGRESS_THRESHOLDS.HIGH) return PROGRESS_COLORS.HIGH;
    return PROGRESS_COLORS.EXCEEDED;
  };

  return {
    modalVisible,
    loadingAI,
    refreshing,
    loading,
    initialDetails,
    meals,
    todayNutrition,
    expandedMeals,
    handleRefresh,
    handleAddMealPress,
    handleModalClose,
    handleMealSuccess,
    handleToggleMealExpansion,
    handleMealPress,
    formatTime,
    formatDate,
    formatFullDateTime,
    getProgressColor,
    setLoadingAI,
  };
};
