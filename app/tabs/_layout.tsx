import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { JSX } from "react";

export default function TabLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "home") iconName = "home";
          else if (route.name === "data") iconName = "bar-chart";
          else if (route.name === "settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "lightgrey",
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="data" options={{ title: "Analytics" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen
        name="mealDetails"
        options={{
          href: null, // This hides it from the tab bar
          title: "Meal Details",
        }}
      />
    </Tabs>
  );
}
