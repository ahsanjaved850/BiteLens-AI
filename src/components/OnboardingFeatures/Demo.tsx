import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

export const Demo: React.FC = () => {
  const nutritionData = [
    { label: "Calories", value: "320 kcal", color: "#FF6B6B" },
    { label: "Carbs", value: "54g", color: "#4ECDC4" },
    { label: "Protein", value: "13g", color: "#45B7D1" },
    { label: "Fats", value: "5g", color: "#FFA07A" },
  ];

  return (
    <View style={modernStyles.safeArea}>
      <View style={modernStyles.screenContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <View style={modernStyles.contentContainer}>
          {/* Header Section */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.headerTitle}>Snap Your Meal</Text>
            <Text style={modernStyles.subtitleLight}>
              AI analyzes nutrition in seconds
            </Text>
          </View>

          {/* Food Image with Border */}
          <View
            style={[
              modernStyles.imageContainer,
              modernStyles.imageWithBorder,
              { marginTop: SPACING.md },
            ]}
          >
            <Image
              source={require("@/assets/images/vegan.jpg")}
              style={modernStyles.image}
              resizeMode="cover"
            />
          </View>

          {/* Nutrition Card */}
          <View style={[modernStyles.card, modernStyles.cardElevated]}>
            <Text style={modernStyles.cardTitle}>Instant Analysis</Text>

            {nutritionData.map((item, index) => (
              <View
                key={item.label}
                style={[
                  modernStyles.nutritionRow,
                  index === nutritionData.length - 1 &&
                    modernStyles.nutritionRowLast,
                ]}
              >
                <View style={modernStyles.nutritionLabel}>
                  <View
                    style={[
                      modernStyles.nutritionDot,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={modernStyles.nutritionText}>{item.label}</Text>
                </View>
                <Text style={modernStyles.nutritionValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
