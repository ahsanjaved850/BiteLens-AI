import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

export const MotivationalSlide: React.FC = () => {
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>Healthy Life ∞ Happy Life</Text>
        <Text style={introstyle.introLine}>
          A healthy body leads to a healthy and happy life. Lets do it.
        </Text>
        <View style={introstyle.imageContainer}>
          <Image
            source={require("@/assets/images/happy.jpg")}
            style={introstyle.image}
          />
        </View>
      </View>
    </View>
  );
};
