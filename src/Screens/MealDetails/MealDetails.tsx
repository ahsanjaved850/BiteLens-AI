import { NUTRITION_ICONS } from "@/src/Screens/Home/Home.static";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMealDetails } from "./MealDetails.logic";
import {
  INGREDIENT_MODAL_TEXT,
  MACROS_CONFIG,
  SECTION_TITLES,
  UI_TEXT,
} from "./MealDetails.static";
import { mealDetailStyles } from "./mealDetails.style";

const MACRO_ACCENT_COLORS: Record<string, string> = {
  protein: "#EF4444",
  carbs: "#3B82F6",
  fat: "#F59E0B",
};

// Cycled per-chip so the ingredient tags read colorful yet on-brand —
// all pulled from the app's existing accent palette.
const INGREDIENT_CHIP_COLORS = [
  "#F47B20",
  "#EF4444",
  "#3B82F6",
  "#F59E0B",
  "#2ECC71",
  "#8B5CF6",
];

export const MealDetails = () => {
  const {
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
  } = useMealDetails();

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
  const ingredients = getIngredients();
  const totalGrams = ingredients.reduce((sum, item) => sum + item.grams, 0);
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
              style={{ width: 32, height: 32 }}
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
            <View style={mealDetailStyles.sectionHeaderLeft}>
              <View style={mealDetailStyles.sectionDot} />
              <Text style={mealDetailStyles.sectionTitle}>
                {SECTION_TITLES.MACRONUTRIENTS}
              </Text>
            </View>
          </View>
          <View style={mealDetailStyles.macroGrid}>
            {MACROS_CONFIG.map((macro) => (
              <View key={macro.key} style={mealDetailStyles.macroCard}>
                <Image
                  source={NUTRITION_ICONS[macro.iconKey]}
                  style={mealDetailStyles.macroIcon3d}
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
            <View style={mealDetailStyles.sectionHeaderLeft}>
              <View style={mealDetailStyles.sectionDot} />
              <Text style={mealDetailStyles.sectionTitle}>
                {SECTION_TITLES.ADDITIONAL_NUTRIENTS}
              </Text>
            </View>
          </View>
          <View style={mealDetailStyles.nutrientsList}>
            {nutrients.map((nutrient, index) => (
              <View key={index} style={mealDetailStyles.nutrientRow}>
                <View style={mealDetailStyles.nutrientLeft}>
                  <Image
                    source={NUTRITION_ICONS[nutrient.iconKey]}
                    style={mealDetailStyles.nutrientIcon3d}
                    resizeMode="contain"
                  />
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

        {/* ── Ingredients ── */}
        <View style={mealDetailStyles.section}>
          <View style={mealDetailStyles.sectionHeader}>
            <View style={mealDetailStyles.sectionHeaderLeft}>
              <View style={mealDetailStyles.sectionDot} />
              <Text style={mealDetailStyles.sectionTitle}>
                {SECTION_TITLES.INGREDIENTS}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {totalGrams > 0 && (
                <View style={mealDetailStyles.ingredientCountPill}>
                  <Text style={mealDetailStyles.ingredientCountText}>
                    {"Total : "}
                    {totalGrams}
                    <Text style={mealDetailStyles.ingredientCountUnit}>g</Text>
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={mealDetailStyles.ingredientEditButton}
                onPress={toggleIngredientEditMode}
                activeOpacity={0.75}
              >
                {ingredientEditMode ? (
                  <FontAwesome5 name="check" size={13} color="#F47B20" solid />
                ) : (
                  <Ionicons name="create-outline" size={22} color="#F47B20" />
                )}
              </TouchableOpacity>
              {ingredientEditMode && (
                <TouchableOpacity
                  style={mealDetailStyles.ingredientEditButton}
                  onPress={openAddIngredientForm}
                  activeOpacity={0.75}
                >
                  <FontAwesome5 name="plus" size={13} color="#F47B20" solid />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={mealDetailStyles.ingredientsContainer}>
            {recalculatingNutrition && (
              <View style={mealDetailStyles.ingredientsRecalcOverlay}>
                <ActivityIndicator size="small" color="#F47B20" />
                <Text style={mealDetailStyles.ingredientsRecalcText}>
                  Updating nutrition...
                </Text>
              </View>
            )}
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    mealDetailStyles.ingredientRow,
                    index === ingredients.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() =>
                    ingredientEditMode && openEditIngredientForm(index)
                  }
                  activeOpacity={ingredientEditMode ? 0.6 : 1}
                >
                  <View style={mealDetailStyles.ingredientLeft}>
                    <View
                      style={[
                        mealDetailStyles.ingredientDot,
                        {
                          backgroundColor:
                            INGREDIENT_CHIP_COLORS[
                              index % INGREDIENT_CHIP_COLORS.length
                            ],
                        },
                      ]}
                    />
                    <Text
                      style={mealDetailStyles.ingredientName}
                      numberOfLines={1}
                    >
                      {ingredient.name}
                    </Text>
                  </View>
                  {ingredient.grams > 0 && (
                    <View
                      style={[
                        mealDetailStyles.ingredientGramPill,
                        ingredientEditMode &&
                          mealDetailStyles.ingredientGramPillEditable,
                      ]}
                    >
                      <Text style={mealDetailStyles.ingredientGramText}>
                        {ingredient.grams}g
                      </Text>
                    </View>
                  )}
                  {ingredientEditMode && (
                    <TouchableOpacity
                      style={mealDetailStyles.ingredientDeleteButton}
                      onPress={() => handleDeleteIngredient(index)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={mealDetailStyles.noIngredientsWrap}>
                <Text style={mealDetailStyles.noIngredientsEmoji}>🥗</Text>
                <Text style={mealDetailStyles.noIngredientsText}>
                  {UI_TEXT.NO_INGREDIENTS}
                </Text>
              </View>
            )}
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

      {/* ── Add / Edit Ingredient Modal ── */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={ingredientFormVisible}
        onRequestClose={closeIngredientForm}
      >
        <View style={mealDetailStyles.modalOverlay}>
          <View style={mealDetailStyles.modalContent}>
            <Text style={mealDetailStyles.modalTitle}>
              {ingredientFormMode === "add"
                ? INGREDIENT_MODAL_TEXT.ADD_TITLE
                : INGREDIENT_MODAL_TEXT.EDIT_TITLE}
            </Text>
            <Text style={mealDetailStyles.modalSubtitle}>
              {ingredientFormMode === "add"
                ? INGREDIENT_MODAL_TEXT.ADD_SUBTITLE
                : INGREDIENT_MODAL_TEXT.EDIT_SUBTITLE}
            </Text>

            <View style={mealDetailStyles.inputContainer}>
              <Text style={mealDetailStyles.inputLabel}>
                {INGREDIENT_MODAL_TEXT.NAME_LABEL}
              </Text>
              <TextInput
                style={[
                  mealDetailStyles.textInput,
                  ingredientNameFocused && mealDetailStyles.textInputFocused,
                ]}
                placeholder={INGREDIENT_MODAL_TEXT.NAME_PLACEHOLDER}
                placeholderTextColor="#B0BECA"
                value={ingredientNameInput}
                onChangeText={setIngredientNameInput}
                onFocus={() => setIngredientNameFocused(true)}
                onBlur={() => setIngredientNameFocused(false)}
                autoFocus
              />
            </View>

            <View style={mealDetailStyles.inputContainer}>
              <Text style={mealDetailStyles.inputLabel}>
                {INGREDIENT_MODAL_TEXT.GRAMS_LABEL}
              </Text>
              <TextInput
                style={[
                  mealDetailStyles.textInput,
                  ingredientGramsFocused && mealDetailStyles.textInputFocused,
                ]}
                placeholder={INGREDIENT_MODAL_TEXT.GRAMS_PLACEHOLDER}
                placeholderTextColor="#B0BECA"
                keyboardType="number-pad"
                value={ingredientGramsInput}
                onChangeText={setIngredientGramsInput}
                onFocus={() => setIngredientGramsFocused(true)}
                onBlur={() => setIngredientGramsFocused(false)}
              />
            </View>

            <View style={mealDetailStyles.modalButtonRow}>
              <TouchableOpacity
                onPress={closeIngredientForm}
                style={mealDetailStyles.modalCancelButton}
                activeOpacity={0.7}
              >
                <Text style={mealDetailStyles.modalCancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveIngredient}
                style={mealDetailStyles.modalConfirmButton}
                activeOpacity={0.75}
              >
                <Text style={mealDetailStyles.modalConfirmButtonText}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
