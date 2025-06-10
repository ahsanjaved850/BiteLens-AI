import { JSX } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Recently eaten</Text>
        <Text
          style={{
            backgroundColor: "#FAF9F6",
            marginTop: 5,
            padding: 10,
            fontSize: 14,
            borderRadius: 10,
          }}
        >
          Click on + to start tracking todays meal by taking a pictures
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
