import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mealDetailStyles } from "./mealDetails.style";

interface MealEntry {
  id: string;
  name: string;
  image: string;
  time: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  sugar: string;
  sodium: string;
  fiber: string;
  ingredients: string[];
  expanded: boolean;
}

export const MealDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const meal = route.params?.meal as MealEntry;

  const handleBack = () => {
    Vibration.vibrate(10);
    navigation.goBack();
  };

  if (!meal) {
    return (
      <SafeAreaView style={mealDetailStyles.container}>
        <View style={mealDetailStyles.errorContainer}>
          <Text style={mealDetailStyles.errorText}>Meal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={mealDetailStyles.container}>
      {/* Header */}
      <View style={mealDetailStyles.header}>
        <TouchableOpacity
          style={mealDetailStyles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={mealDetailStyles.headerTitle}>Meal Details</Text>
        <TouchableOpacity
          style={mealDetailStyles.deleteButton}
          onPress={() => {
            Vibration.vibrate(10);
            // Add delete functionality here
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={mealDetailStyles.scrollView}
        contentContainerStyle={mealDetailStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal Image */}
        <View style={mealDetailStyles.imageContainer}>
          {meal.image ? (
            <Image
              source={{ uri: meal.image }}
              style={mealDetailStyles.mealImage}
            />
          ) : (
            <View style={mealDetailStyles.imagePlaceholder}>
              <Ionicons name="image-outline" size={64} color="#94A3B8" />
            </View>
          )}
        </View>

        {/* Meal Info Card */}
        <View style={mealDetailStyles.infoCard}>
          <Text style={mealDetailStyles.mealName}>{meal.name}</Text>
          <View style={mealDetailStyles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={mealDetailStyles.timeText}>{meal.time}</Text>
          </View>
        </View>

        {/* Calories Card */}
        <View style={mealDetailStyles.caloriesCard}>
          <View style={mealDetailStyles.caloriesIconContainer}>
            <Ionicons name="flame" size={32} color="#6366F1" />
          </View>
          <View style={mealDetailStyles.caloriesInfo}>
            <Text style={mealDetailStyles.caloriesLabel}>Total Calories</Text>
            <Text style={mealDetailStyles.caloriesValue}>{meal.calories}</Text>
          </View>
        </View>

        {/* Macronutrients Section */}
        <View style={mealDetailStyles.section}>
          <Text style={mealDetailStyles.sectionTitle}>Macronutrients</Text>
          <View style={mealDetailStyles.macroGrid}>
            <View style={mealDetailStyles.macroCard}>
              <View
                style={[
                  mealDetailStyles.macroIcon,
                  { backgroundColor: "#FEE2E2" },
                ]}
              >
                <Ionicons name="fitness" size={24} color="#EF4444" />
              </View>
              <Text style={mealDetailStyles.macroLabel}>Protein</Text>
              <Text style={mealDetailStyles.macroValue}>{meal.protein}g</Text>
            </View>

            <View style={mealDetailStyles.macroCard}>
              <View
                style={[
                  mealDetailStyles.macroIcon,
                  { backgroundColor: "#DBEAFE" },
                ]}
              >
                <Ionicons name="flame" size={24} color="#3B82F6" />
              </View>
              <Text style={mealDetailStyles.macroLabel}>Carbs</Text>
              <Text style={mealDetailStyles.macroValue}>{meal.carbs}g</Text>
            </View>

            <View style={mealDetailStyles.macroCard}>
              <View
                style={[
                  mealDetailStyles.macroIcon,
                  { backgroundColor: "#FEF3C7" },
                ]}
              >
                <Ionicons name="water" size={24} color="#F59E0B" />
              </View>
              <Text style={mealDetailStyles.macroLabel}>Fats</Text>
              <Text style={mealDetailStyles.macroValue}>{meal.fats}g</Text>
            </View>
          </View>
        </View>

        {/* Additional Nutrients Section */}
        <View style={mealDetailStyles.section}>
          <Text style={mealDetailStyles.sectionTitle}>
            Additional Nutrients
          </Text>
          <View style={mealDetailStyles.nutrientsList}>
            <View style={mealDetailStyles.nutrientRow}>
              <View style={mealDetailStyles.nutrientLeft}>
                <View
                  style={[
                    mealDetailStyles.nutrientIconSmall,
                    { backgroundColor: "#FDE2E4" },
                  ]}
                >
                  <Ionicons name="sparkles" size={18} color="#E11D48" />
                </View>
                <Text style={mealDetailStyles.nutrientLabel}>Sugar</Text>
              </View>
              <Text style={mealDetailStyles.nutrientValue}>{meal.sugar}g</Text>
            </View>

            <View style={mealDetailStyles.nutrientRow}>
              <View style={mealDetailStyles.nutrientLeft}>
                <View
                  style={[
                    mealDetailStyles.nutrientIconSmall,
                    { backgroundColor: "#E0E7FF" },
                  ]}
                >
                  <Ionicons name="diamond" size={18} color="#4F46E5" />
                </View>
                <Text style={mealDetailStyles.nutrientLabel}>Sodium</Text>
              </View>
              <Text style={mealDetailStyles.nutrientValue}>
                {meal.sodium}mg
              </Text>
            </View>

            <View style={mealDetailStyles.nutrientRow}>
              <View style={mealDetailStyles.nutrientLeft}>
                <View
                  style={[
                    mealDetailStyles.nutrientIconSmall,
                    { backgroundColor: "#D1FAE5" },
                  ]}
                >
                  <Ionicons name="leaf" size={18} color="#059669" />
                </View>
                <Text style={mealDetailStyles.nutrientLabel}>Fiber</Text>
              </View>
              <Text style={mealDetailStyles.nutrientValue}>{meal.fiber}g</Text>
            </View>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={mealDetailStyles.section}>
          <View style={mealDetailStyles.ingredientsHeader}>
            <Ionicons name="list" size={22} color="#6366F1" />
            <Text style={mealDetailStyles.sectionTitle}>Ingredients</Text>
          </View>
          <View style={mealDetailStyles.ingredientsContainer}>
            {meal.ingredients && meal.ingredients.length > 0 ? (
              meal.ingredients.map((ingredient, index) => (
                <View key={index} style={mealDetailStyles.ingredientItem}>
                  <View style={mealDetailStyles.ingredientBullet} />
                  <Text style={mealDetailStyles.ingredientText}>
                    {ingredient}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={mealDetailStyles.noIngredientsText}>
                No ingredients available
              </Text>
            )}
          </View>
        </View>

        {/* AI Notice */}
        <View style={mealDetailStyles.aiNotice}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#6366F1"
          />
          <Text style={mealDetailStyles.aiNoticeText}>
            Nutritional information and ingredients are AI-generated estimates
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
