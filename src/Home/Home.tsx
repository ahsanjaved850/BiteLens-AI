import { JSX } from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { styles } from "./Home.style";

export const Home = (): JSX.Element => {
  return (
    <ScrollView style={styles.body}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.heading}>
        <Image
          source={require("@/assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.logoName}>VeganCal</Text>
      </View>
      <View style={styles.dailyDetails}>
        <View style={styles.userProfile}>
          <Text style={{ fontWeight: "semibold", fontSize: 25 }}>
            Hi Ahsan,
          </Text>
          <Text style={{ fontWeight: "normal", fontSize: 15 }}>30 May</Text>
        </View>

        <View style={styles.caloriesCard}>
          <Text>Calories</Text>
          <Text>Calories Left</Text>
        </View>
        <View style={styles.macroNutrients}>
          <Text style={styles.nutrientsCard}>Protein</Text>
          <Text style={styles.nutrientsCard}>Carbs</Text>
          <Text style={styles.nutrientsCard}>Fats</Text>
        </View>
      </View>
    </ScrollView>
  );
};
