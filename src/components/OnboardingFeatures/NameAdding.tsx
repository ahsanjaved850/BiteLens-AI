import { updateName } from "@/backend/sendData";
import {
  formstyle,
  introstyle,
} from "@/src/Screens/Onboarding/Onboarding.style";
import React, { useEffect, useState } from "react";
import {
  Image,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";

export const NameAdding: React.FC = () => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (name.trim()) {
      updateName(name);
    }
  }, [name]);

  const handleName = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    setName(e.nativeEvent.text.trim());
  };

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
          {"Hi there! What's your name?"}
        </Text>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TextInput
            placeholder="Your Name"
            defaultValue=""
            onEndEditing={handleName}
            style={formstyle.DataDetails}
          />
        </View>

        <View style={{ height: "100%", marginTop: 20 }}>
          <Image
            source={require("@/assets/images/motivation.png")}
            style={introstyle.image}
          />
        </View>
      </View>
    </View>
  );
};
