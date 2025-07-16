import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

export const GraphComparison: React.FC = () => {
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>
          Effective & Long Lasting Results
        </Text>
        <Text style={introstyle.introLine}>
          You progress towards your goal will be more consistent.
        </Text>
        <View style={introstyle.imageContainer}>
          <Image
            source={require("@/assets/images/chart.png")}
            style={introstyle.image}
          />
        </View>
      </View>
    </View>
  );
};
