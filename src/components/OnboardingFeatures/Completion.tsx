import { homeStyles } from "@/src/Screens/Home/Home.style";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

export const Completion: React.FC = () => {
  return (
    <View style={formstyle.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View>
        <Text style={homeStyles.logoName}>Do it Together</Text>
        <Text style={introstyle.introLine}>
          Your are all done. Thanks for trusting us.
        </Text>
        <View style={introstyle.imageContainer}>
          <Image
            source={require("@/assets/images/finalpage.png")}
            style={{
              width: "100%",
              height: "80%",
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};
