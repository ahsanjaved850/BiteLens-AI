import {
  COLORS,
  modernStyles,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

const APP_CONTENT = {
  title: "GreenBite AI",
  headerTitle: "Your Personal AI Nutrition Assistant",
  features: [
    { emoji: "🥗", text: "Vegan Friendly" },
    { emoji: "📸", text: "Snap & Track" },
    { emoji: "📊", text: "Smart Insights" },
  ],
  image: require("@/assets/images/vegan.jpg"),
} as const;

export const AppIntro: React.FC = () => {
  return (
    <View style={modernStyles.safeArea}>
      <View style={modernStyles.screenContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <View style={modernStyles.contentContainer}>
          {/* Logo Container */}
          <View style={modernStyles.logoContainer}>
            <Text style={modernStyles.appTitle}>{APP_CONTENT.title}</Text>
          </View>

          {/* Hero Section */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.headerTitle}>
              {APP_CONTENT.headerTitle}
            </Text>
          </View>

          {/* Main Image */}
          <View style={modernStyles.imageLarge}>
            <Image
              source={APP_CONTENT.image}
              style={modernStyles.image}
              resizeMode="cover"
            />
          </View>

          {/* Feature Badges */}
          <View style={modernStyles.featureTagsContainer}>
            {APP_CONTENT.features.map((feature, index) => (
              <View key={index} style={modernStyles.featureTag}>
                <Text style={modernStyles.featureTagText}>
                  {feature.emoji} {feature.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
