import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import { FloatingAvatar, FloatingCircle } from "./FloatingCircle";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Replace with your bundled asset when ready
const AVATAR_1 = {
  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop",
};

interface Props {
  isActive: boolean;
}

export const Slide1: React.FC<Props> = ({ isActive }) => {
  return (
    <View style={styles.container}>
      {/*  Decorative floating circles — orange family only  */}
      <FloatingCircle
        size={150}
        color="#FF8A1F"
        style={{ top: SCREEN_H * 0.1, right: -40 }}
        driftRange={14}
        duration={3800}
        opacity={0.95}
      />
      <FloatingCircle
        size={70}
        color="#FF8A1F"
        style={{ top: SCREEN_H * 0.32, left: SCREEN_W * 0.08 }}
        driftRange={12}
        duration={3200}
        opacity={0.85}
      />
      <FloatingCircle
        size={240}
        color="#FF7A0F"
        style={{ bottom: -110, right: -90 }}
        driftRange={10}
        duration={4500}
        opacity={0.9}
      />
      <FloatingCircle
        size={110}
        color="#FF8A1F"
        style={{ bottom: SCREEN_H * 0.08, left: -40 }}
        driftRange={12}
        duration={4000}
        opacity={0.8}
      />

      {/* Tiny white "sparkle" highlights — adds depth without new colors */}
      <FloatingCircle
        size={14}
        color="#FFFFFF"
        style={{ bottom: SCREEN_H * 0.28, right: SCREEN_W * 0.35 }}
        driftRange={10}
        duration={2800}
        opacity={0.7}
      />
      <FloatingCircle
        size={10}
        color="#FFFFFF"
        style={{ top: SCREEN_H * 0.55, right: SCREEN_W * 0.18 }}
        driftRange={8}
        duration={2400}
        opacity={0.7}
      />
      <FloatingCircle
        size={8}
        color="#FFFFFF"
        style={{ top: SCREEN_H * 0.42, left: SCREEN_W * 0.4 }}
        driftRange={6}
        duration={2200}
        opacity={0.6}
      />

      {/* Floating avatar — top left corner */}
      <FloatingAvatar
        size={120}
        source={AVATAR_1}
        style={{ top: SCREEN_H * 0.11, left: -25 }}
        driftRange={12}
        duration={4200}
      />

      {/*  Headline  */}
      {isActive && (
        <View style={styles.textBlock}>
          <Animated.Text
            entering={FadeInUp.duration(600).delay(150)}
            style={styles.kicker}
          >
            WEIGHT LOSS
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.duration(700).delay(300)}
            style={styles.headline}
          >
            in three{"\n"}simple moves
          </Animated.Text>

          {/* Big "1 — 2 — 3" — the visual hook of the slide */}
          <Animated.View
            entering={ZoomIn.duration(800).delay(550)}
            style={styles.numbersRow}
          >
            <View style={styles.numberPill}>
              <Text style={styles.bigNumber}>1</Text>
            </View>
            <View style={styles.connector} />
            <View style={styles.numberPill}>
              <Text style={styles.bigNumber}>2</Text>
            </View>
            <View style={styles.connector} />
            <View style={[styles.numberPill, styles.numberPillAccent]}>
              <Text style={[styles.bigNumber, styles.bigNumberAccent]}>3</Text>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: "#FFDF27", // bright lemon yellow
    overflow: "hidden",
  },

  // Headline block
  textBlock: {
    position: "absolute",
    top: SCREEN_H * 0.4,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  kicker: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A1A3D",
    letterSpacing: 4,
    opacity: 0.55,
    marginBottom: 10,
  },
  headline: {
    fontSize: 38,
    fontWeight: "700",
    color: "#0A1A3D",
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -0.8,
    marginBottom: 32,
  },

  // 1 ─ 2 ─ 3 row
  numbersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  numberPill: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0A1A3D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0A1A3D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  numberPillAccent: {
    backgroundColor: "#FC6146",
    shadowColor: "#FC6146",
    shadowOpacity: 0.4,
    transform: [{ scale: 1.1 }], // step 3 is slightly bigger — destination
  },
  bigNumber: {
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -1,
    lineHeight: 42,
  },
  bigNumberAccent: {
    color: "#FFFFFF",
  },
  connector: {
    width: 18,
    height: 4,
    backgroundColor: "#0A1A3D",
    marginHorizontal: 8,
    borderRadius: 2,
    opacity: 0.4,
  },
});
