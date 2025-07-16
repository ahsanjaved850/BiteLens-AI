import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

export const AppIntro: React.FC = () => {
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <View style={introstyle.logoContainer}>
          <Image
            style={introstyle.logo}
            source={require("@/assets/images/app_icon.png")}
          />
          <Text style={introstyle.headerName}>GreenBite AI</Text>
        </View>
        <Text style={introstyle.introLine}>
          Welcome to the world of Vegan Calories Monitoring...
        </Text>
        <View style={introstyle.imageContainer}>
          <Image
            source={require("@/assets/images/vegan.jpg")}
            style={introstyle.image}
          />
        </View>
      </View>
    </View>
  );
};
