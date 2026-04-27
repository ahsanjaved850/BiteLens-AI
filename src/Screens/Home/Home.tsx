import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
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
    handleRefresh,
    handleAddMealPress,
    handleModalClose,
    handleMealSuccess,
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
    iconBgColor: string,
  ) => {
    const percentage = Math.min((value / goal) * 100, 100);
    const progressColor = getProgressColor(value, goal);

    return (
      <View style={homeStyles.nutrientsCard} key={label}>
        <View
          style={[homeStyles.nutrientIcon, { backgroundColor: iconBgColor }]}
        >
          <Ionicons name={iconName as any} size={18} color={iconColor} />
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

  // Calorie helpers
  const calorieGoal = initialDetails?.calories || 0;
  const caloriesConsumed = Math.round(todayNutrition.calories);
  const caloriesRemaining = Math.max(0, calorieGoal - caloriesConsumed);
  const caloriePercent =
    calorieGoal > 0
      ? Math.min((caloriesConsumed / calorieGoal) * 100, 100)
      : 0;

  const ringColor =
    caloriePercent < 50
      ? "#E8E4DD"
      : caloriePercent < 80
      ? "#F5A623"
      : caloriePercent < 100
      ? "#2ECC71"
      : "#EF4444";

  if (loading) {
    return (
      <View style={homeStyles.container}>
        <View style={homeStyles.loadingOverlay}>
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
            <Text style={homeStyles.loadingText}>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={homeStyles.container} edges={["top"]}>
      {/* ── Header ── */}
      <View style={homeStyles.headerContainer}>
        <View style={homeStyles.headerRow}>
          <View style={homeStyles.logoContainer}>
            <Image
              source={require("@/assets/images/nutritrack-app-icon-1024.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
            <Text style={homeStyles.logoName}>BiteLens AI</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={homeStyles.body}
        contentContainerStyle={homeStyles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#F5A623"
            colors={["#F5A623"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Calorie Card ── */}
        <View style={homeStyles.dailySummaryCard}>
          {/* Card Header */}
          <View style={homeStyles.summaryHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={homeStyles.summaryTitleEmoji}>🔥</Text>
              <Text style={homeStyles.summaryTitle}>Calorie</Text>
            </View>
         
          </View>

          {/* Calorie Ring — centered, clean */}
          <View style={homeStyles.progressContainer}>
            <View
              style={[
                homeStyles.calorieRingOuter,
                {
                  borderColor: caloriePercent > 5 ? ringColor : "#E8E4DD",
                },
              ]}
            >
              <View style={homeStyles.calorieRingInner}>
                <Text style={homeStyles.calorieCount}>{caloriesRemaining}</Text>
                <Text style={homeStyles.calorieCanEatLabel}>Can Eat</Text>
              </View>
            </View>

            {/* Consumed / Goal underneath the ring */}
            <View style={homeStyles.calorieSubRow}>
              <View style={homeStyles.calorieSubItem}>
                <Text style={homeStyles.calorieSubValue}>
                  {caloriesConsumed}
                </Text>
                <Text style={homeStyles.calorieSubLabel}>Consumed</Text>
              </View>
              <View style={homeStyles.calorieSubDivider} />
              <View style={homeStyles.calorieSubItem}>
                <Text style={homeStyles.calorieSubValue}>{calorieGoal}</Text>
                <Text style={homeStyles.calorieSubLabel}>Goal</Text>
              </View>
            </View>
          </View>

          {/* Macro Summary Row (Fat, Carbs, Protein) */}
          <View style={homeStyles.macroSummaryRow}>
            {/* Fat */}
            <View style={homeStyles.macroSummaryItem}>
              <Text style={homeStyles.macroSummaryLabel}>Fat</Text>
              <View style={homeStyles.macroSummaryBar}>
                <View
                  style={[
                    homeStyles.macroSummaryBarFill,
                    {
                      width: `${Math.min(
                        (todayNutrition.fat / (initialDetails?.fat || 1)) * 100,
                        100
                      )}%`,
                      backgroundColor: "#F59E0B",
                    },
                  ]}
                />
              </View>
              <View style={homeStyles.macroSummaryDotRow}>
                <View
                  style={[
                    homeStyles.macroSummaryDot,
                    { backgroundColor: "#F59E0B" },
                  ]}
                />
                <Text style={homeStyles.macroSummaryValue}>
                  {Math.round(todayNutrition.fat)}/
                  {Math.round(initialDetails?.fat || 0)}g
                </Text>
              </View>
            </View>

            {/* Net Carbs */}
            <View style={homeStyles.macroSummaryItem}>
              <Text style={homeStyles.macroSummaryLabel}>Net Carbs</Text>
              <View style={homeStyles.macroSummaryBar}>
                <View
                  style={[
                    homeStyles.macroSummaryBarFill,
                    {
                      width: `${Math.min(
                        (todayNutrition.carbs /
                          (initialDetails?.carbs || 1)) *
                          100,
                        100
                      )}%`,
                      backgroundColor: "#2ECC71",
                    },
                  ]}
                />
              </View>
              <View style={homeStyles.macroSummaryDotRow}>
                <View
                  style={[
                    homeStyles.macroSummaryDot,
                    { backgroundColor: "#2ECC71" },
                  ]}
                />
                <Text style={homeStyles.macroSummaryValue}>
                  {Math.round(todayNutrition.carbs)}/
                  {Math.round(initialDetails?.carbs || 0)}g
                </Text>
              </View>
            </View>

            {/* Protein */}
            <View style={homeStyles.macroSummaryItem}>
              <Text style={homeStyles.macroSummaryLabel}>Protein</Text>
              <View style={homeStyles.macroSummaryBar}>
                <View
                  style={[
                    homeStyles.macroSummaryBarFill,
                    {
                      width: `${Math.min(
                        (todayNutrition.protein /
                          (initialDetails?.protein || 1)) *
                          100,
                        100
                      )}%`,
                      backgroundColor: "#3B82F6",
                    },
                  ]}
                />
              </View>
              <View style={homeStyles.macroSummaryDotRow}>
                <View
                  style={[
                    homeStyles.macroSummaryDot,
                    { backgroundColor: "#3B82F6" },
                  ]}
                />
                <Text style={homeStyles.macroSummaryValue}>
                  {Math.round(todayNutrition.protein)}/
                  {Math.round(initialDetails?.protein || 0)}g
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Other Nutrients (Sugar, Sodium, Fiber only) ── */}
        <View style={[homeStyles.dailySummaryCard, { marginTop: 16 }]}>
          <View style={homeStyles.macroSection}>
            <Text style={homeStyles.macroHeader}>Other Nutrients</Text>
            <View style={homeStyles.macroNutrients}>
              {renderMacroCard(
                MACRO_CARDS_CONFIG.SUGAR.label,
                todayNutrition.sugar,
                initialDetails?.sugar || 0,
                MACRO_CARDS_CONFIG.SUGAR.iconName,
                MACRO_CARDS_CONFIG.SUGAR.iconColor,
                MACRO_CARDS_CONFIG.SUGAR.iconBgColor,
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.SODIUM.label,
                todayNutrition.sodium,
                initialDetails?.sodium || 0,
                MACRO_CARDS_CONFIG.SODIUM.iconName,
                MACRO_CARDS_CONFIG.SODIUM.iconColor,
                MACRO_CARDS_CONFIG.SODIUM.iconBgColor,
              )}
              {renderMacroCard(
                MACRO_CARDS_CONFIG.FIBER.label,
                todayNutrition.fiber,
                initialDetails?.fiber || 0,
                MACRO_CARDS_CONFIG.FIBER.iconName,
                MACRO_CARDS_CONFIG.FIBER.iconColor,
                MACRO_CARDS_CONFIG.FIBER.iconBgColor,
              )}
            </View>
          </View>
        </View>

        {/* ── Daily Log ── */}
        <View style={homeStyles.mealHistorySection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>Daily Log</Text>
          </View>

          {meals.length === 0 ? (
            <View style={homeStyles.emptyStateContainer}>
              <Text style={homeStyles.emptyStateIcon}>🍽️</Text>
              <Text style={homeStyles.emptyStateTitle}>
                You haven't logged any food.
              </Text>
              <Text style={homeStyles.emptyStateText}>
                Tap the AI Scan button below to track your first meal.
              </Text>
            </View>
          ) : (
            meals.map((meal, index) => {
              const mealKey =
                meal.id ??
                `${meal.created_at ?? "no-date"}-${meal.name ?? "meal"}-${index}`;

              return (
                <TouchableOpacity
                  key={mealKey}
                  style={homeStyles.mealItem}
                  onPress={() => handleMealPress(meal)}
                  activeOpacity={0.7}
                >
                  <View style={homeStyles.mealItemContent}>
                    <View style={homeStyles.mealImageContainer}>
                      {meal.meal_image ? (
                        <Image
                          source={{ uri: meal.meal_image }}
                          style={homeStyles.mealImage}
                        />
                      ) : (
                        <View style={homeStyles.mealPlaceholder}>
                          <Ionicons
                            name="restaurant"
                            size={28}
                            color="#9CA8B7"
                          />
                        </View>
                      )}
                    </View>

                    <View style={homeStyles.mealInfo}>
                      <Text style={homeStyles.mealTime}>
                        {meal.created_at
                          ? formatFullDateTime(meal.created_at)
                          : "Unknown time"}
                      </Text>
                      <Text style={homeStyles.mealName}>{meal.name}</Text>
                      <Text style={homeStyles.mealCalories}>
                        {Math.round(meal.calories)} kcal
                      </Text>

                      <View style={homeStyles.macrosInline}>
                        <View style={homeStyles.macroInlineItem}>
                          <View
                            style={[
                              homeStyles.macroDot,
                              { backgroundColor: "#EF4444" },
                            ]}
                          />
                          <Text style={homeStyles.macroInlineText}>
                            {Math.round(meal.protein)}g protein
                          </Text>
                        </View>

                        <View style={homeStyles.macroInlineItem}>
                          <View
                            style={[
                              homeStyles.macroDot,
                              { backgroundColor: "#3B82F6" },
                            ]}
                          />
                          <Text style={homeStyles.macroInlineText}>
                            {Math.round(meal.carbs)}g carbs
                          </Text>
                        </View>

                        <View style={homeStyles.macroInlineItem}>
                          <View
                            style={[
                              homeStyles.macroDot,
                              { backgroundColor: "#F59E0B" },
                            ]}
                          />
                          <Text style={homeStyles.macroInlineText}>
                            {Math.round(meal.fat)}g fats
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ── Floating AI Scan Button — sticky bottom ── */}
      <View style={homeStyles.floatingButtonWrap}>
        <TouchableOpacity
          style={homeStyles.floatingAiButton}
          onPress={handleAddMealPress}
          activeOpacity={0.85}
        >
          <View style={homeStyles.floatingAiIconWrap}>
            <Ionicons name="camera" size={22} color="#FFFFFF" />
          </View>
          <Text style={homeStyles.floatingAiText}>AI Scan</Text>
        </TouchableOpacity>
      </View>

      {/* ── Modal (unchanged) ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={loadingAI ? undefined : handleModalClose}
      >
        <TouchableOpacity
          style={homeStyles.modalOverlay}
          activeOpacity={1}
          onPress={loadingAI ? undefined : handleModalClose}
          disabled={loadingAI}
        >
          <TouchableOpacity
            style={homeStyles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Loading Overlay (unchanged) ── */}
      {loadingAI && !modalVisible && (
        <View style={homeStyles.loadingOverlay}>
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#F5A623" />
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