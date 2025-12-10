import {
  COLORS,
  modernStyles,
  SPACING,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";

export const Completion: React.FC = () => {
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
          {/* Header */}
          <View style={{ alignItems: "center" }}>
            <Text style={modernStyles.headerTitleLarge}>
              {"You're All Set!"}
            </Text>
            <Text style={modernStyles.subtitleLight}>
              {"Let's start your wellness journey together"}
            </Text>
          </View>

          {/* Completion Image */}
          <View style={[modernStyles.imageXlarge, { marginTop: SPACING.xl }]}>
            <Image
              source={require("@/assets/images/finalpage.png")}
              style={modernStyles.image}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
