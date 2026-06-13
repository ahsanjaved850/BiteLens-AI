import { ImageExamine } from "@/src/components/ImageExamine/ImageExamine";
import { imageExamineStyles } from "@/src/components/ImageExamine/imageExamine.style";
import { WeekStrip } from "@/src/Screens/Home/WeekStrip";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useHome } from "./Home.logic";
import { MACRO_CARDS_CONFIG, NUTRITION_ICONS } from "./Home.static";
import { GRADIENT, homeStyles } from "./Home.style";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CalorieProgressRing: React.FC<{
  percentage: number;
  color: string;
  children: React.ReactNode;
}> = ({ percentage, color, children }) => {
  const animatedProgress = React.useRef(new Animated.Value(0)).current;

  const size = 170;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const safePercentage = Math.max(0, Math.min(percentage, 100));

  React.useEffect(() => {
    const listenerId = animatedProgress.addListener(({ value }) => {
      // setDotProgress(value);
    });

    Animated.timing(animatedProgress, {
      toValue: safePercentage,
      duration: 900,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedProgress.removeListener(listenerId);
    };
  }, [safePercentage, animatedProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={homeStyles.calorieRingOuter}>
      <Svg width={size} height={size} style={homeStyles.calorieRingSvg}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#F0DED0"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated progress ring */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          originX={center}
          originY={center}
        />

        {/* Moving circle on ring edge */}
      </Svg>

      <View style={homeStyles.calorieRingContent}>{children}</View>
    </View>
  );
};

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
    selectedDate,
    isToday,
    formattedSelectedDate,
    handleDateChange,
  } = useHome();

  const insets = useSafeAreaInsets();

  const renderMacroCard = (
    label: string,
    value: number,
    goal: number,
    iconKey: keyof typeof NUTRITION_ICONS,
    unit: string = "g",
  ) => {
    const percentage = Math.min((value / goal) * 100, 100);
    const progressColor = getProgressColor(value, goal);

    return (
      <View style={homeStyles.nutrientsCard} key={label}>
        <Image
          source={NUTRITION_ICONS[iconKey]}
          style={homeStyles.nutrientIcon3d}
          resizeMode="contain"
        />
        <Text style={homeStyles.nutrientsLabel}>{label}</Text>
        <Text style={homeStyles.nutrientsValue}>{Math.round(value)}</Text>
        <Text style={homeStyles.nutrientsTotal}>
          of {Math.round(goal)}
          {unit}
        </Text>
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
    calorieGoal > 0 ? Math.min((caloriesConsumed / calorieGoal) * 100, 100) : 0;

  const ringColor =
    caloriePercent < 25
      ? "#F5A623" // brand orange when just starting out
      : caloriePercent < 50
        ? "#F47B20" // warm amber mid-way
        : caloriePercent < 75
          ? "#2ECC71" // green when nearly at goal
          : "#EF4444"; // red if exceeded

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={homeStyles.loadingOverlay}>
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#F47B20" />
            <Text style={homeStyles.loadingText}>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaView style={homeStyles.container} edges={["top"]}>
        {/* ── Header: gradient background, 3D logo ── */}
        <LinearGradient
          colors={[GRADIENT.top, GRADIENT.mid, GRADIENT.bottom]}
          locations={[0, 0.5, 1]}
          style={homeStyles.headerContainer}
        >
          <View style={homeStyles.headerRow}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "900",
                color: "#0F1A22",
                letterSpacing: -2,
                includeFontPadding: false,
                lineHeight: 48,
              }}
            >
              Orca
            </Text>
          </View>
        </LinearGradient>

        {/* ── Week strip calendar ── */}
        <WeekStrip
          selectedDate={selectedDate}
          onSelectDate={(date) => handleDateChange(date)}
        />

        <ScrollView
          style={homeStyles.body}
          contentContainerStyle={homeStyles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#F47B20"
              colors={["#F47B20"]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* ── Calorie Card ── */}
          <View style={homeStyles.dailySummaryCard}>
            <View style={homeStyles.summaryHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Image
                  source={NUTRITION_ICONS.calories}
                  style={{ width: 45, height: 45 }}
                  resizeMode="contain"
                />
                <Text style={homeStyles.summaryTitle}>Calories</Text>
              </View>
            </View>

            {/* Ring */}
            <View style={homeStyles.progressContainer}>
              <CalorieProgressRing
                percentage={caloriePercent}
                color={caloriePercent > 5 ? ringColor : "#F47B20"}
              >
                <View style={homeStyles.calorieRingInner}>
                  <Text style={homeStyles.calorieCount}>
                    {caloriesRemaining}
                  </Text>
                  <Text style={homeStyles.calorieCanEatLabel}>Can Eat</Text>
                </View>
              </CalorieProgressRing>

              {/* Consumed / Goal */}
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

            {/* Macro bars (Fat / Net Carbs / Protein) */}
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
                          (todayNutrition.fat / (initialDetails?.fat || 1)) *
                            100,
                          100,
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
                          100,
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
                          100,
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

          {/* ── Other Nutrients Card ── */}
          <View style={[homeStyles.dailySummaryCard, { marginTop: 16 }]}>
            <View style={homeStyles.macroSection}>
              <Text style={homeStyles.macroHeader}>Other Nutrients</Text>
              <View style={homeStyles.macroNutrients}>
                {renderMacroCard(
                  MACRO_CARDS_CONFIG.SUGAR.label,
                  todayNutrition.sugar,
                  initialDetails?.sugar || 0,
                  MACRO_CARDS_CONFIG.SUGAR.iconKey,
                )}
                {renderMacroCard(
                  MACRO_CARDS_CONFIG.SODIUM.label,
                  todayNutrition.sodium,
                  initialDetails?.sodium || 0,
                  MACRO_CARDS_CONFIG.SODIUM.iconKey,
                  "mg",
                )}
                {renderMacroCard(
                  MACRO_CARDS_CONFIG.FIBER.label,
                  todayNutrition.fiber,
                  initialDetails?.fiber || 0,
                  MACRO_CARDS_CONFIG.FIBER.iconKey,
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
                <Text style={homeStyles.emptyStateIcon}>
                  <Image
                    style={{
                      width: 85,
                      height: 58,
                    }}
                    source={NUTRITION_ICONS.food}
                  />
                </Text>
                <Text style={homeStyles.emptyStateTitle}>
                  You haven't logged any food.
                </Text>
                <Text style={homeStyles.emptyStateText}>
                  Tap the AI Scan button to track your first meal.
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
                    activeOpacity={0.75}
                  >
                    <View style={homeStyles.mealItemContent}>
                      {/*
                       * Left orange accent bar — a designer detail that
                       * ties each meal card back to the brand orange.
                       * Creates visual rhythm down the list.
                       */}
                      <View style={homeStyles.mealAccentBar} />

                      {/* Food image / placeholder with 3D shadow */}
                      <View style={homeStyles.mealImageContainer}>
                        {meal.meal_image ? (
                          <Image
                            source={{ uri: meal.meal_image }}
                            style={homeStyles.mealImage}
                          />
                        ) : (
                          <View style={homeStyles.mealPlaceholder}>
                            {/*
                             * 3D icon effect: coloured icon on a warm bg
                             * inside a rounded square with inner shadow.
                             */}
                            <View
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                backgroundColor: "#FFF3E8",
                                alignItems: "center",
                                justifyContent: "center",
                                shadowColor: "#F47B20",
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.2,
                                shadowRadius: 6,
                                elevation: 3,
                              }}
                            >
                              <Ionicons
                                name="restaurant"
                                size={22}
                                color="#F47B20"
                              />
                            </View>
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

        {/* ── Floating AI Scan FAB — only on today ── */}
        {isToday && (
          <View
            style={[
              homeStyles.floatingButtonWrap,
              { bottom: insets.bottom > 0 ? insets.bottom + 16 : 32 },
            ]}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              style={homeStyles.floatingAiButton}
              onPress={handleAddMealPress}
              activeOpacity={0.8}
              accessibilityLabel="Scan meal with AI camera"
              accessibilityRole="button"
            >
              <View style={homeStyles.floatingAiIconWrap}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
              <Text style={homeStyles.floatingAiText}>AI Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Modal ── */}
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
                  style={[
                    imageExamineStyles.cancelButton,
                    loadingAI && imageExamineStyles.cancelButtonDisabled,
                  ]}
                  onPress={handleModalClose}
                  disabled={loadingAI}
                >
                  <Text
                    style={[
                      imageExamineStyles.cancelButtonText,
                      loadingAI && imageExamineStyles.cancelButtonTextDisabled,
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* ── AI Loading Overlay ── */}
        {loadingAI && !modalVisible && (
          <View style={homeStyles.loadingOverlay}>
            <View style={homeStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#F47B20" />
              <Text style={homeStyles.loadingText}>Analyzing Your Meal</Text>
              <Text style={homeStyles.loadingSubtext}>
                This may take a few moments...
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};
