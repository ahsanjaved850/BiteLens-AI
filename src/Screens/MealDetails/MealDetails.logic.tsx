import { MealData } from "@/src/utils/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import {
  NutrientConfig,
  NUTRIENTS_CONFIG,
  UNIT_SUFFIX,
} from "./MealDetails.static";

export const useMealDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const meal = (route.params as any)?.meal as MealData;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Unknown time";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getNutrients = (): NutrientConfig[] => {
    if (!meal) return [];

    return NUTRIENTS_CONFIG.map((config) => {
      let value = "";
      let suffix = UNIT_SUFFIX.GRAMS;

      switch (config.label) {
        case "Sugar":
          value = `${Math.round(meal.sugar)}`;
          break;
        case "Sodium":
          value = `${Math.round(meal.sodium)}`;
          break;
        case "Fiber":
          value = `${Math.round(meal.fiber)}`;
          break;
      }

      return {
        ...config,
        value: `${value}${suffix}`,
      };
    });
  };

  return {
    meal,
    handleBack,
    formatTime,
    getNutrients,
  };
};