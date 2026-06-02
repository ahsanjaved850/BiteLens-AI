import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { FloatingAvatar, FloatingCircle } from "./FloatingCircle";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Replace with your bundled assets when ready
const AVATAR_WOMAN = {
  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop",
};
const AVATAR_MAN = {
  uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop",
};

interface Props {
  isActive: boolean;
}

export const Slide2: React.FC<Props> = ({ isActive }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFB627", "#FFC73D", "#FFD86B", "#FFE89A"]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glowOuter} pointerEvents="none" />
      <View style={styles.glowMiddle} pointerEvents="none" />
      <View style={styles.glowInner} pointerEvents="none" />

      {/* Decorative circles  only orange family, drifting slowly */}
      <FloatingCircle
        size={240}
        color="#FF8A1F"
        style={{ bottom: -120, right: -80 }}
        driftRange={8}
        duration={5200}
        opacity={0.85}
      />
      <FloatingCircle
        size={140}
        color="#FF7A0F"
        style={{ bottom: SCREEN_H * 0.06, left: -60 }}
        driftRange={10}
        duration={4400}
        opacity={0.75}
      />
      <FloatingCircle
        size={32}
        color="#FFFFFF"
        style={{ top: SCREEN_H * 0.32, right: SCREEN_W * 0.12 }}
        driftRange={14}
        duration={3200}
        opacity={0.55}
      />
      <FloatingCircle
        size={18}
        color="#FFFFFF"
        style={{ top: SCREEN_H * 0.55, left: SCREEN_W * 0.18 }}
        driftRange={10}
        duration={2800}
        opacity={0.6}
      />

      <FloatingAvatar
        size={110}
        source={AVATAR_WOMAN}
        style={{ top: SCREEN_H * 0.08, left: SCREEN_W * 0.06 }}
        driftRange={12}
        duration={4600}
      />
      <FloatingAvatar
        size={95}
        source={AVATAR_MAN}
        style={{ top: SCREEN_H * 0.18, right: SCREEN_W * 0.08 }}
        driftRange={14}
        duration={4000}
      />

      {/* Headline */}
      {isActive && (
        <View style={styles.textBlock}>
          <Animated.Text
            entering={FadeInDown.duration(600).delay(150)}
            style={styles.headlineLine1}
          >
            Join people
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.duration(700).delay(300)}
            style={styles.headlineAccent}
          >
            Losing Weight
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.duration(600).delay(500)}
            style={styles.headlineLine3}
          >
            the healthiest way
          </Animated.Text>

          {/* Subtle underline accent  visual punctuation */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(700)}
            style={styles.accentBar}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  // Soft radial glow stack  concentric translucent circles
  glowOuter: {
    position: "absolute",
    width: SCREEN_W * 1.4,
    height: SCREEN_W * 1.4,
    borderRadius: 9999,
    backgroundColor: "#FFE89A",
    opacity: 0.4,
  },
  glowMiddle: {
    position: "absolute",
    width: SCREEN_W * 1.0,
    height: SCREEN_W * 1.0,
    borderRadius: 9999,
    backgroundColor: "#FFF1B8",
    opacity: 0.45,
  },
  glowInner: {
    position: "absolute",
    width: SCREEN_W * 0.7,
    height: SCREEN_W * 0.7,
    borderRadius: 9999,
    backgroundColor: "#FFF8DC",
    opacity: 0.5,
  },

  textBlock: {
    paddingHorizontal: 28,
    alignItems: "center",
    zIndex: 10,
  },
  headlineLine1: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0A1A3D",
    letterSpacing: 0.3,
    marginBottom: 4,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  headlineAccent: {
    fontSize: 54,
    fontWeight: "700",
    color: "#FC6146",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 58,
  },
  headlineLine3: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0A1A3D",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 32,
    marginTop: 6,
  },
  accentBar: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FC6146",
    marginTop: 18,
    opacity: 0.85,
  },
});
