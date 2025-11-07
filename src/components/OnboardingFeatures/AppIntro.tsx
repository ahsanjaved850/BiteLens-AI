import {
  COLORS,
  modernStyles,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

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
            <Text style={modernStyles.appTitle}>GreenBite AI</Text>
          </View>

          {/* Hero Section */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.headerTitle}>
              Your Personal AI Nutrition Assistant
            </Text>
          </View>

          {/* Main Image */}
          <View style={modernStyles.imageLarge}>
            <Image
              source={require("@/assets/images/vegan.jpg")}
              style={modernStyles.image}
              resizeMode="cover"
            />
          </View>

          {/* Feature Badges */}
          <View style={modernStyles.featureTagsContainer}>
            <View style={modernStyles.featureTag}>
              <Text style={modernStyles.featureTagText}>🥗 Vegan Friendly</Text>
            </View>
            <View style={modernStyles.featureTag}>
              <Text style={modernStyles.featureTagText}>📸 Snap & Track</Text>
            </View>
            <View style={modernStyles.featureTag}>
              <Text style={modernStyles.featureTagText}>📊 Smart Insights</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
