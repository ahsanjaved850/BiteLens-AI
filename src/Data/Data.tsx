import { JSX } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { homeStyles } from "../Home/Home.style";
import { dataStyles } from "./Data.style";

export const DataOverview = (): JSX.Element => {
  return (
    <ScrollView style={homeStyles.body}>
      <View style={homeStyles.heading}>
        <Text style={homeStyles.logoName}>Overview</Text>
      </View>
      <View
        style={{ backgroundColor: "#FAF9F6", borderRadius: 10, padding: 10 }}
      >
        <Text style={dataStyles.headings}>Goal Weight</Text>
        <View style={dataStyles.cardStyle}>
          <Text style={{ fontSize: 28, fontWeight: "bold", marginRight: 10 }}>
            70Kg
          </Text>
          <TouchableOpacity style={dataStyles.updateButton}>
            <Text style={dataStyles.update}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#FAF9F6",
          borderRadius: 10,
          padding: 10,
          marginVertical: 10,
        }}
      >
        <Text style={dataStyles.headings}>Current Weight</Text>
        <View>
          <View style={dataStyles.cardStyle}>
            <Text style={{ fontSize: 28, fontWeight: "bold", marginRight: 10 }}>
              80kg
            </Text>
            <TouchableOpacity style={dataStyles.updateButton}>
              <Text style={dataStyles.update}>Log Weight</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginVertical: 6, fontSize: 12 }}>
            Try to update once a week so we can adjust your plan to ensure you
            hit goal!
          </Text>
        </View>
      </View>
      <View
        style={{ backgroundColor: "#FAF9F6", borderRadius: 10, padding: 10 }}
      >
        <Text style={dataStyles.headings}>Your BMI</Text>
        <Text>Your BMI score: 26</Text>
        <Text>BMI Chart will be displayed here</Text>
      </View>
    </ScrollView>
  );
};
