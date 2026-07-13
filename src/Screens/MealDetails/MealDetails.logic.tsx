import { adjustDailyIntakeForMealChange } from "@/backend/sendData";
import { recalculateNutritionFromIngredients } from "@/src/utils/openaicalls/recalculateNutrition";
import {
  deleteMeal,
  Ingredient,
  MealData,
  updateMealNutrition,
} from "@/src/utils/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  ALERT_MESSAGES,
  INGREDIENT_ALERTS,
  NutrientConfig,
  NUTRIENTS_CONFIG,
  UNIT_SUFFIX,
} from "./MealDetails.static";

type IngredientFormMode = "add" | "edit";

export const useMealDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const routeMeal = (route.params as any)?.meal as MealData;

  // Local meal copy — updates immediately on portion edit without re-navigating
  const [meal, setMeal] = useState<MealData>(routeMeal);

  // This screen is registered as a tab screen, so it stays mounted after
  // goBack() instead of unmounting. That means the useState initializer only
  // ever runs once — without this, navigating in with a new meal would keep
  // showing the previously opened (or just-deleted) meal until app restart.
  // Re-sync local state whenever the navigated meal changes.
  useEffect(() => {
    setMeal(routeMeal);
  }, [routeMeal]);

  //  Ingredient editing
  const [ingredientEditMode, setIngredientEditMode] = useState(false);
  const [ingredientFormVisible, setIngredientFormVisible] = useState(false);
  const [ingredientFormMode, setIngredientFormMode] =
    useState<IngredientFormMode>("add");
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<
    number | null
  >(null);
  const [ingredientNameInput, setIngredientNameInput] = useState("");
  const [ingredientGramsInput, setIngredientGramsInput] = useState("");
  const [ingredientNameFocused, setIngredientNameFocused] = useState(false);
  const [ingredientGramsFocused, setIngredientGramsFocused] = useState(false);
  const [recalculatingNutrition, setRecalculatingNutrition] = useState(false);
  // Working copy while edit mode is on — add/edit/delete only touch this
  // local draft. The OpenAI recalculation + DB writes happen once, when the
  // user taps the checkmark to leave edit mode, not on every small change.
  const [draftIngredients, setDraftIngredients] = useState<
    Ingredient[] | null
  >(null);

  // Discard any in-progress ingredient edit when the navigated meal changes.
  useEffect(() => {
    setIngredientEditMode(false);
    setDraftIngredients(null);
  }, [routeMeal]);

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

  // Normalize ingredients into { name, grams } with a capitalized name.
  // Tolerates legacy meals whose ingredients were saved as plain strings.
  const normalizeIngredients = (raw: MealData["ingredients"]): Ingredient[] => {
    if (!Array.isArray(raw)) return [];

    return raw
      .map((item): Ingredient => {
        const parsed =
          typeof item === "string"
            ? { name: item, grams: 0 }
            : { name: item?.name ?? "", grams: Number(item?.grams) || 0 };

        const name = parsed.name.trim();
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          grams: Math.max(0, Math.round(parsed.grams)),
        };
      })
      .filter((item) => item.name.length > 0);
  };

  // While edit mode is active, reads/writes go through the local draft
  // instead of the persisted meal — nothing hits the network until confirm.
  const getIngredients = (): Ingredient[] => {
    if (draftIngredients !== null) return draftIngredients;
    return normalizeIngredients(meal?.ingredients);
  };

  //  Ingredient editing
  // Entering edit mode snapshots the current ingredients into a local draft.
  // Leaving it (tapping the checkmark) is the only point that calls OpenAI
  // and persists — one call for the whole batch of changes, not one per edit.
  const toggleIngredientEditMode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!ingredientEditMode) {
      setDraftIngredients(getIngredients());
      setIngredientEditMode(true);
      return;
    }

    const draft = draftIngredients ?? getIngredients();
    const original = normalizeIngredients(meal?.ingredients);
    const hasChanges = JSON.stringify(draft) !== JSON.stringify(original);

    if (!hasChanges) {
      setIngredientEditMode(false);
      setDraftIngredients(null);
      return;
    }

    setRecalculatingNutrition(true);
    try {
      await recalculateAndPersist(draft);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIngredientEditMode(false);
      setDraftIngredients(null);
    } catch (err) {
      console.log("Error saving ingredient changes:", err);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        INGREDIENT_ALERTS.SAVE_ERROR.title,
        INGREDIENT_ALERTS.SAVE_ERROR.message,
        [{ text: INGREDIENT_ALERTS.SAVE_ERROR.buttonText }],
      );
      // Stay in edit mode so the draft isn't lost — user can retry.
    } finally {
      setRecalculatingNutrition(false);
    }
  };

  const openAddIngredientForm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIngredientFormMode("add");
    setEditingIngredientIndex(null);
    setIngredientNameInput("");
    setIngredientGramsInput("");
    setIngredientFormVisible(true);
  };

  const openEditIngredientForm = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const ingredient = getIngredients()[index];
    if (!ingredient) return;

    setIngredientFormMode("edit");
    setEditingIngredientIndex(index);
    setIngredientNameInput(ingredient.name);
    setIngredientGramsInput(
      ingredient.grams > 0 ? String(ingredient.grams) : "",
    );
    setIngredientFormVisible(true);
  };

  const closeIngredientForm = () => {
    setIngredientFormVisible(false);
  };

  // Recomputes nutrition for the full updated ingredient list via OpenAI,
  // writes the meal's new ingredients + macros/micros to the DB, and
  // reconciles that day's daily_intake totals by the resulting delta.
  const recalculateAndPersist = async (updated: Ingredient[]) => {
    if (!meal) return;

    const nutrition = await recalculateNutritionFromIngredients(
      meal.name,
      updated,
    );

    const delta = {
      calories: nutrition.calories - meal.calories,
      protein: nutrition.protein - meal.protein,
      carbs: nutrition.carbs - meal.carbs,
      fat: nutrition.fat - meal.fat,
      sugar: nutrition.sugar - meal.sugar,
      sodium: nutrition.sodium - meal.sodium,
      fiber: nutrition.fiber - meal.fiber,
    };

    const mealDate = (meal.created_at ?? new Date().toISOString()).split(
      "T",
    )[0];

    await updateMealNutrition(meal.id, updated, nutrition);
    await adjustDailyIntakeForMealChange(mealDate, delta);

    setMeal({ ...meal, ingredients: updated, ...nutrition });
  };

  // Add/edit only touch the local draft — no network call here. The batch
  // is recalculated and persisted once, when edit mode is confirmed.
  const handleSaveIngredient = () => {
    const name = ingredientNameInput.trim();
    if (!name) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("", INGREDIENT_ALERTS.NAME_REQUIRED);
      return;
    }

    const normalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const grams = Math.max(0, Math.round(parseFloat(ingredientGramsInput) || 0));
    const current = getIngredients();

    const updated =
      ingredientFormMode === "edit" && editingIngredientIndex !== null
        ? current.map((item, index) =>
            index === editingIngredientIndex
              ? { name: normalizedName, grams }
              : item,
          )
        : [...current, { name: normalizedName, grams }];

    setDraftIngredients(updated);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeIngredientForm();
  };

  // Removes from the local draft only — persisted along with any other
  // pending edits when the user taps the checkmark to leave edit mode.
  const handleDeleteIngredient = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      INGREDIENT_ALERTS.DELETE_CONFIRM.title,
      INGREDIENT_ALERTS.DELETE_CONFIRM.message,
      [
        { text: INGREDIENT_ALERTS.DELETE_CONFIRM.cancelText, style: "cancel" },
        {
          text: INGREDIENT_ALERTS.DELETE_CONFIRM.confirmText,
          style: "destructive",
          onPress: () => {
            const updated = getIngredients().filter((_, i) => i !== index);
            setDraftIngredients(updated);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  return {
    meal,
    handleBack,
    handleDelete,
    formatTime,
    getNutrients,
    getIngredients,
    ingredientEditMode,
    toggleIngredientEditMode,
    ingredientFormVisible,
    ingredientFormMode,
    openAddIngredientForm,
    openEditIngredientForm,
    closeIngredientForm,
    ingredientNameInput,
    setIngredientNameInput,
    ingredientGramsInput,
    setIngredientGramsInput,
    ingredientNameFocused,
    setIngredientNameFocused,
    ingredientGramsFocused,
    setIngredientGramsFocused,
    recalculatingNutrition,
    handleSaveIngredient,
    handleDeleteIngredient,
  };
};
