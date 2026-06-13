import { NUTRITION_ICONS } from "@/src/Screens/Home/Home.static";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMealDetails } from "./MealDetails.logic";
import { MACROS_CONFIG, SECTION_TITLES, UI_TEXT } from "./MealDetails.static";
import { mealDetailStyles } from "./mealDetails.style";

const MACRO_ACCENT_COLORS: Record<string, string> = {
  protein: "#EF4444",
  carbs: "#3B82F6",
  fat: "#F59E0B",
};

const NUTRIENT_SUBLABELS: Record<string, string> = {
  Sugar: "Simple carbs",
  Sodium: "Salt content",
  Fiber: "Dietary",
};

export const MealDetails = () => {
  const { meal, handleBack, handleDelete, formatTime, getNutrients } =
    useMealDetails();

  const insets = useSafeAreaInsets();

  if (!meal) {
    return (
      <View
        style={[mealDetailStyles.container, mealDetailStyles.errorContainer]}
      >
        <Text style={mealDetailStyles.errorText}>
          {UI_TEXT.ERROR_NOT_FOUND}
        </Text>
      </View>
    );
  }

  const nutrients = getNutrients();
  const calorieGoalHint =
    meal.calories > 600
      ? "High calorie"
      : meal.calories > 300
        ? "Moderate calories"
        : "Light meal";

  // Current nutrition shape passed to the sheet
  const currentNutrition = {
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    sugar: meal.sugar,
    sodium: meal.sodium,
    fiber: meal.fiber,
  };

  return (
    <View style={mealDetailStyles.container}>
      <ScrollView
        style={mealDetailStyles.scrollView}
        contentContainerStyle={[
          mealDetailStyles.contentContainer,
          // Extra bottom padding so content clears the Edit Portion button
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Image ── */}
        <View style={mealDetailStyles.imageContainer}>
          {meal.meal_image ? (
            <Image
              source={{ uri: meal.meal_image }}
              style={mealDetailStyles.mealImage}
            />
          ) : (
            <View style={mealDetailStyles.imagePlaceholder}>
              <View style={mealDetailStyles.imagePlaceholderIcon}>
                <Ionicons name="restaurant" size={42} color="#F47B20" />
              </View>
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(15,26,34,0.72)"]}
            style={mealDetailStyles.imageGradientOverlay}
          />
          <View style={mealDetailStyles.heroTextOverlay}>
            <Text style={mealDetailStyles.heroMealName} numberOfLines={2}>
              {meal.name}
            </Text>
            <View style={mealDetailStyles.heroTimeRow}>
              <Ionicons
                name="time-outline"
                size={13}
                color="rgba(255,255,255,0.82)"
              />
              <Text style={mealDetailStyles.heroTimeText}>
                {formatTime(meal.created_at)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Pull-up card ── */}
        <View style={mealDetailStyles.pullUpCard}>
          <View style={mealDetailStyles.pullUpHandle} />
        </View>

        {/* ── Calories Hero Card ── */}
        <View style={mealDetailStyles.caloriesCard}>
          <View style={mealDetailStyles.caloriesIconContainer}>
            <Image
              source={NUTRITION_ICONS.calories}
              style={{ width: 46, height: 46 }}
              resizeMode="contain"
            />
          </View>
          <View style={mealDetailStyles.caloriesInfo}>
            <Text style={mealDetailStyles.caloriesLabel}>
              {UI_TEXT.TOTAL_CALORIES}
            </Text>
            <Text style={mealDetailStyles.caloriesValue}>
              {Math.round(meal.calories)}
              <Text style={mealDetailStyles.caloriesUnit}> kcal</Text>
            </Text>
            <View style={mealDetailStyles.caloriesBadge}>
              <Text style={mealDetailStyles.caloriesBadgeText}>
                {calorieGoalHint}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Macronutrients ── */}
        <View style={mealDetailStyles.section}>
          <View style={mealDetailStyles.sectionHeader}>
            <View style={mealDetailStyles.sectionDot} />
            <Text style={mealDetailStyles.sectionTitle}>
              {SECTION_TITLES.MACRONUTRIENTS}
            </Text>
          </View>
          <View style={mealDetailStyles.macroGrid}>
            {MACROS_CONFIG.map((macro) => (
              <View key={macro.key} style={mealDetailStyles.macroCard}>
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 19,
                    opacity: 0.12,
                    position: "absolute",
                    top: 12,
                  }}
                />
                <Image
                  source={NUTRITION_ICONS[macro.iconKey]}
                  style={[mealDetailStyles.macroIcon3d, { marginTop: 4 }]}
                  resizeMode="contain"
                />
                <Text style={mealDetailStyles.macroLabel}>{macro.label}</Text>
                <Text style={mealDetailStyles.macroValue}>
                  {Math.round(meal[macro.key])}
                  <Text style={mealDetailStyles.macroUnit}>g</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Additional Nutrients ── */}
        <View style={mealDetailStyles.section}>
          <View style={mealDetailStyles.sectionHeader}>
            <View style={mealDetailStyles.sectionDot} />
            <Text style={mealDetailStyles.sectionTitle}>
              {SECTION_TITLES.ADDITIONAL_NUTRIENTS}
            </Text>
          </View>
          <View style={mealDetailStyles.nutrientsList}>
            {nutrients.map((nutrient, index) => (
              <View
                key={index}
                style={[
                  mealDetailStyles.nutrientRow,
                  index === nutrients.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={mealDetailStyles.nutrientLeft}>
                  <View style={mealDetailStyles.nutrientIconWrapper}>
                    <Image
                      source={NUTRITION_ICONS[nutrient.iconKey]}
                      style={mealDetailStyles.nutrientIcon3d}
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <Text style={mealDetailStyles.nutrientLabel}>
                      {nutrient.label}
                    </Text>
                    <Text style={mealDetailStyles.nutrientSubLabel}>
                      {NUTRIENT_SUBLABELS[nutrient.label] ?? ""}
                    </Text>
                  </View>
                </View>
                <View style={mealDetailStyles.nutrientValuePill}>
                  <Text style={mealDetailStyles.nutrientValue}>
                    {nutrient.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── AI Notice — premium badge style ── */}
      </ScrollView>

      {/* ── Back Button ── */}
      <TouchableOpacity
        style={[
          mealDetailStyles.backButton,
          { top: insets.top + 8, backgroundColor: "#F47B20" },
        ]}
        onPress={handleBack}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ── Delete Button ── */}
      <TouchableOpacity
        style={[
          mealDetailStyles.backButton,
          {
            top: insets.top + 8,
            left: undefined,
            right: 16,
            backgroundColor: "#F47B20",
          },
        ]}
        onPress={handleDelete}
        activeOpacity={0.85}
      >
        <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};
