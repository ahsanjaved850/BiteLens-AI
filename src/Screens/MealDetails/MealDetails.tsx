import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMealDetails } from "./MealDetails.logic";
import { MACROS_CONFIG, SECTION_TITLES, UI_TEXT } from "./MealDetails.static";
import { mealDetailStyles } from "./mealDetails.style";

export const MealDetails = () => {
  const { meal, handleBack, formatTime, getNutrients } = useMealDetails();

  if (!meal) {
    return (
      <SafeAreaView style={mealDetailStyles.container}>
        <View style={mealDetailStyles.errorContainer}>
          <Text style={mealDetailStyles.errorText}>
            {UI_TEXT.ERROR_NOT_FOUND}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const nutrients = getNutrients();

  return (
    <SafeAreaView style={mealDetailStyles.container}>
      {/* Header */}
      <View style={mealDetailStyles.header}>
        <TouchableOpacity
          style={mealDetailStyles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#0F1923" />
        </TouchableOpacity>
        <Text style={mealDetailStyles.headerTitle}>
          {SECTION_TITLES.MEAL_DETAILS}
        </Text>
      </View>

      <ScrollView
        style={mealDetailStyles.scrollView}
        contentContainerStyle={mealDetailStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Image */}
        <View style={mealDetailStyles.imageContainer}>
          {meal.meal_image ? (
            <Image
              source={{ uri: meal.meal_image }}
              style={mealDetailStyles.mealImage}
            />
          ) : (
            <View style={mealDetailStyles.imagePlaceholder}>
              <Ionicons name="image-outline" size={64} color="#9CA8B7" />
            </View>
          )}
        </View>

        {/* Meal Info Card — overlaps image */}
        <View style={mealDetailStyles.infoCard}>
          <Text style={mealDetailStyles.mealName}>{meal.name}</Text>
          <View style={mealDetailStyles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#9CA8B7" />
            <Text style={mealDetailStyles.timeText}>
              {formatTime(meal.created_at)}
            </Text>
          </View>
        </View>

        {/* Calories Card */}
        <View style={mealDetailStyles.caloriesCard}>
          <View style={mealDetailStyles.caloriesIconContainer}>
            <Ionicons name="flame" size={28} color="#F5A623" />
          </View>
          <View style={mealDetailStyles.caloriesInfo}>
            <Text style={mealDetailStyles.caloriesLabel}>
              {UI_TEXT.TOTAL_CALORIES}
            </Text>
            <Text style={mealDetailStyles.caloriesValue}>
              {Math.round(meal.calories)}
            </Text>
          </View>
        </View>

        {/* Macronutrients */}
        <View style={mealDetailStyles.section}>
          <Text style={mealDetailStyles.sectionTitle}>
            {SECTION_TITLES.MACRONUTRIENTS}
          </Text>
          <View style={mealDetailStyles.macroGrid}>
            {MACROS_CONFIG.map((macro) => (
              <View key={macro.key} style={mealDetailStyles.macroCard}>
                <View
                  style={[
                    mealDetailStyles.macroIcon,
                    { backgroundColor: macro.iconBgColor },
                  ]}
                >
                  <Ionicons
                    name={macro.icon as any}
                    size={22}
                    color={macro.iconColor}
                  />
                </View>
                <Text style={mealDetailStyles.macroLabel}>{macro.label}</Text>
                <Text style={mealDetailStyles.macroValue}>
                  {Math.round(meal[macro.key])}g
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Nutrients */}
        <View style={mealDetailStyles.section}>
          <Text style={mealDetailStyles.sectionTitle}>
            {SECTION_TITLES.ADDITIONAL_NUTRIENTS}
          </Text>
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
                  <View
                    style={[
                      mealDetailStyles.nutrientIconSmall,
                      { backgroundColor: nutrient.iconBgColor },
                    ]}
                  >
                    <Ionicons
                      name={nutrient.icon as any}
                      size={18}
                      color={nutrient.iconColor}
                    />
                  </View>
                  <Text style={mealDetailStyles.nutrientLabel}>
                    {nutrient.label}
                  </Text>
                </View>
                <Text style={mealDetailStyles.nutrientValue}>
                  {nutrient.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Notice */}
        <View style={mealDetailStyles.aiNotice}>
          <Ionicons name="sparkles" size={16} color="#F5A623" />
          <Text style={mealDetailStyles.aiNoticeText}>
            {UI_TEXT.AI_NOTICE}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};