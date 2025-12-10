import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHome } from "./Home.logic";
import { MACRO_CARDS_CONFIG } from "./Home.static";
import { homeStyles } from "./Home.style";

export const Home = () => {
  const {
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
    formatFullDateTime,
    getProgressColor,
    setLoadingAI,
  } = useHome();

  const renderMacroCard = (
    label: string,
    value: number,
    goal: number,
    iconName: string,
    iconColor: string,
    iconBgColor: string
  ) => {
    const percentage = Math.min((value / goal) * 100, 100);
    const progressColor = getProgressColor(value, goal);

    return (
      <View style={homeStyles.nutrientsCard}>
        <View
          style={[homeStyles.nutrientIcon, { backgroundColor: iconBgColor }]}
        >
          <Ionicons name={iconName as any} size={20} color={iconColor} />
        </View>
        <Text style={homeStyles.nutrientsLabel}>{label}</Text>
        <Text style={homeStyles.nutrientsValue}>{Math.round(value)}</Text>
        <Text style={homeStyles.nutrientsTotal}>of {Math.round(goal)}g</Text>
        <View style={homeStyles.nutrientsProgress}>
          <View
            style={[
              homeStyles.nutrientsProgressBar,
              { width: `${percentage}%`, backgroundColor: progressColor },
            ]}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={homeStyles.container}>
        <View style={homeStyles.loadingOverlay}>
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={homeStyles.loadingText}>Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView
        style={homeStyles.body}
        contentContainerStyle={homeStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={homeStyles.headerContainer}>
          <View style={homeStyles.headerRow}>
            <View style={homeStyles.logoContainer}>
              <View style={homeStyles.logo}>
                <Ionicons name="nutrition" size={24} color="#3B82F6" />
              </View>
              <Text style={homeStyles.logoName}>NutriTrack</Text>
            </View>
          </View>
        </View>
        {/* Daily Summary Card */}
        <View style={homeStyles.dailySummaryCard}>
          <View style={homeStyles.summaryHeader}>
            <Text style={homeStyles.summaryTitle}>{"Today's Summary"}</Text>
          </View>

          {/* Calories Progress */}
          <View style={homeStyles.progressContainer}>
            <Text style={homeStyles.progressLabel}>Calories</Text>
            <Text style={homeStyles.calorieCount}>
              {Math.round(todayNutrition.calories)}
            </Text>
            <Text style={homeStyles.calorieTarget}>
              of {initialDetails?.calories} kcal
            </Text>
          </View>

          {/* Macronutrients */}
          <View style={homeStyles.macroSection}>
            <Text style={homeStyles.macroHeader}>Macronutrients</Text>
            <View style={homeStyles.macroNutrients}>
              {renderMacroCard(
                MACRO_CARDS_CONFIG.PROTEIN.label,
                todayNutrition.protein,
                initialDetails?.protein || 0,
                MACRO_CARDS_CONFIG.PROTEIN.iconName,
                MACRO_CARDS_CONFIG.PROTEIN.iconColor,
                MACRO_CARDS_CONFIG.PROTEIN.iconBgColor
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.CARBS.label,
                todayNutrition.carbs,
                initialDetails?.carbs || 0,
                MACRO_CARDS_CONFIG.CARBS.iconName,
                MACRO_CARDS_CONFIG.CARBS.iconColor,
                MACRO_CARDS_CONFIG.CARBS.iconBgColor
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.FATS.label,
                todayNutrition.fat,
                initialDetails?.fat || 0,
                MACRO_CARDS_CONFIG.FATS.iconName,
                MACRO_CARDS_CONFIG.FATS.iconColor,
                MACRO_CARDS_CONFIG.FATS.iconBgColor
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.SUGAR.label,
                todayNutrition.sugar,
                initialDetails?.sugar || 0,
                MACRO_CARDS_CONFIG.SUGAR.iconName,
                MACRO_CARDS_CONFIG.SUGAR.iconColor,
                MACRO_CARDS_CONFIG.SUGAR.iconBgColor
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.SODIUM.label,
                todayNutrition.sodium,
                initialDetails?.sodium || 0,
                MACRO_CARDS_CONFIG.SODIUM.iconName,
                MACRO_CARDS_CONFIG.SODIUM.iconColor,
                MACRO_CARDS_CONFIG.SODIUM.iconBgColor
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.FIBER.label,
                todayNutrition.fiber,
                initialDetails?.fiber || 0,
                MACRO_CARDS_CONFIG.FIBER.iconName,
                MACRO_CARDS_CONFIG.FIBER.iconColor,
                MACRO_CARDS_CONFIG.FIBER.iconBgColor
              )}
            </View>
          </View>
        </View>

        {/* Add Meal Button */}
        <View style={homeStyles.addMealContainer}>
          <TouchableOpacity
            style={homeStyles.addMealButton}
            onPress={handleAddMealPress}
            activeOpacity={0.8}
          >
            <Text style={homeStyles.addMealIcon}>+</Text>
          </TouchableOpacity>
          <Text style={homeStyles.addMealText}>Add Meal</Text>
        </View>

        {/* Meal History Section */}
        <View style={homeStyles.mealHistorySection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Recent Meals</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={homeStyles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          {meals.length === 0 ? (
            <View style={homeStyles.emptyStateContainer}>
              <Text style={homeStyles.emptyStateIcon}>🍽️</Text>
              <Text style={homeStyles.emptyStateTitle}>No Meals Yet</Text>
              <Text style={homeStyles.emptyStateText}>
                Start tracking your nutrition by adding your first meal
              </Text>
            </View>
          ) : (
            meals.map((meal) => {
              const isExpanded = expandedMeals.has(meal.id!);
              return (
                <TouchableOpacity
                  key={meal.id}
                  style={homeStyles.mealItem}
                  onPress={() => handleMealPress(meal)}
                  activeOpacity={0.7}
                >
                  <View style={homeStyles.mealItemHeader}>
                    <View style={homeStyles.mealImageContainer}>
                      {meal.meal_image ? (
                        <Image
                          source={{ uri: meal.meal_image }}
                          style={homeStyles.mealImage}
                        />
                      ) : (
                        <View style={homeStyles.mealPlaceholder}>
                          <Ionicons name="image" size={32} color="#999" />
                        </View>
                      )}
                    </View>

                    <View style={homeStyles.mealHeaderInfo}>
                      <Text style={homeStyles.mealTime}>
                        {meal.created_at
                          ? formatFullDateTime(meal.created_at)
                          : "Unknown time"}
                      </Text>
                      <Text style={homeStyles.mealName}>{meal.name}</Text>
                      <Text style={homeStyles.mealCalories}>
                        {Math.round(meal.calories)}
                        <Text style={homeStyles.mealCalorieLabel}>
                          {" calories"}
                        </Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={homeStyles.expandButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleMealExpansion(meal.id!);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={homeStyles.mealArrow}>
                        {isExpanded ? "−" : "+"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isExpanded && (
                    <View style={homeStyles.mealDetailsContainer}>
                      <View style={homeStyles.macroGrid}>
                        <View style={homeStyles.macroDetailCard}>
                          <Text style={homeStyles.macroDetailLabel}>
                            PROTEIN
                          </Text>
                          <Text style={homeStyles.macroDetailValue}>
                            {Math.round(meal.protein)}
                          </Text>
                          <Text style={homeStyles.macroDetailUnit}>grams</Text>
                        </View>

                        <View style={homeStyles.macroDetailCard}>
                          <Text style={homeStyles.macroDetailLabel}>CARBS</Text>
                          <Text style={homeStyles.macroDetailValue}>
                            {Math.round(meal.carbs)}
                          </Text>
                          <Text style={homeStyles.macroDetailUnit}>grams</Text>
                        </View>

                        <View style={homeStyles.macroDetailCard}>
                          <Text style={homeStyles.macroDetailLabel}>FATS</Text>
                          <Text style={homeStyles.macroDetailValue}>
                            {Math.round(meal.fat)}
                          </Text>
                          <Text style={homeStyles.macroDetailUnit}>grams</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <View style={homeStyles.modalOverlay}>
          <View style={homeStyles.modalContent}>
            <View style={homeStyles.modalHandle}>
              <View style={homeStyles.modalHandleBar} />
            </View>
            <Text style={homeStyles.modalTitle}>Add Meal</Text>

            <ImageExamine
              onSuccess={handleMealSuccess}
              onLoading={setLoadingAI}
              onClose={handleModalClose}
            />

            <View style={homeStyles.modalButtonContainer}>
              <TouchableOpacity
                style={homeStyles.cancelButton}
                onPress={handleModalClose}
                activeOpacity={0.7}
                disabled={loadingAI}
              >
                <Text style={homeStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loadingAI && (
        <View style={homeStyles.loadingOverlay}>
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={homeStyles.loadingText}>Analyzing Your Meal</Text>
            <Text style={homeStyles.loadingSubtext}>
              This may take a few moments...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
