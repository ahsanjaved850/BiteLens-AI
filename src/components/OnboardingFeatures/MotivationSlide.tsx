import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";

const CONTENT = {
  title: "Healthy Step Towards Cause",
  subtitle: "Veganism is a promise to live gently and spare lives..",
  image: require("@/assets/images/motivation.png"),
} as const;

export const MotivationalSlide: React.FC = () => {
  return (
    <View style={modernStyles.safeArea}>
      <View style={modernStyles.screenContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <ScrollView
          contentContainerStyle={modernStyles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={{ alignItems: "center", marginTop: SPACING.md }}>
            <Text style={modernStyles.headerTitleLarge}>{CONTENT.title}</Text>
            <Text style={modernStyles.subtitleLight}>{CONTENT.subtitle}</Text>
          </View>

          {/* Main Image */}
          <View style={[modernStyles.imagemedium, { marginTop: SPACING.xl }]}>
            <Image
              source={CONTENT.image}
              style={modernStyles.image}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
