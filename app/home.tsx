import { JSX } from "react";
import { Text, View } from "react-native";

export default function HomeScreen(): JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}
