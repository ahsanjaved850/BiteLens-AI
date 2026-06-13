import { deleteMeal, MealData } from "@/src/utils/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Alert } from "react-native";
import {
  ALERT_MESSAGES,
  NutrientConfig,
  NUTRIENTS_CONFIG,
  UNIT_SUFFIX,
} from "./MealDetails.static";

export const useMealDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Local meal copy — updates immediately on portion edit without re-navigating
  const [meal, setMeal] = useState<MealData>(
    (route.params as any)?.meal as MealData,
  );

  //  Navigation
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  //  Delete
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      ALERT_MESSAGES.DELETE_CONFIRM.title,
      ALERT_MESSAGES.DELETE_CONFIRM.message,
      [
        { text: ALERT_MESSAGES.DELETE_CONFIRM.cancelText, style: "cancel" },
        {
          text: ALERT_MESSAGES.DELETE_CONFIRM.confirmText,
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeal(meal);
              Alert.alert(
                ALERT_MESSAGES.DELETE_SUCCESS.title,
                ALERT_MESSAGES.DELETE_SUCCESS.message,
                [
                  {
                    text: ALERT_MESSAGES.DELETE_SUCCESS.buttonText,
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            } catch {
              Alert.alert(
                ALERT_MESSAGES.DELETE_ERROR.title,
                ALERT_MESSAGES.DELETE_ERROR.message,
                [{ text: ALERT_MESSAGES.DELETE_ERROR.buttonText }],
              );
            }
          },
        },
      ],
    );
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
      let suffix: string = UNIT_SUFFIX.GRAMS;

      switch (config.label) {
        case "Sugar":
          value = `${Math.round(meal.sugar)}`;
          break;
        case "Sodium":
          value = `${Math.round(meal.sodium)}`;
          suffix = UNIT_SUFFIX.MILLIGRAMS;
          break;
        case "Fiber":
          value = `${Math.round(meal.fiber)}`;
          break;
      }

      return { ...config, value: `${value}${suffix}` };
    });
  };

  return {
    meal,
    handleBack,
    handleDelete,
    formatTime,
    getNutrients,
  };
};
