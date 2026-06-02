import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface FloatingCircleProps {
  size: number;
  color: string;
  style: ViewStyle;
  driftRange?: number; // px of vertical drift
  duration?: number;
  delay?: number;
  opacity?: number;
}

export const FloatingCircle: React.FC<FloatingCircleProps> = ({
  size,
  color,
  style,
  driftRange = 12,
  duration = 3500,
  delay = 0,
  opacity = 1,
}) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(driftRange, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [translateY, driftRange, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
        },
        style,
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  );
};

export const FloatingAvatar: React.FC<{
  size: number;
  source: { uri: string } | number;
  style: ViewStyle;
  driftRange?: number;
  duration?: number;
}> = ({ size, source, style, driftRange = 10, duration = 4000 }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(driftRange, {
        duration,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [translateY, driftRange, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.avatarShadow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.avatarInner,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Animated.Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
  },
  avatarShadow: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInner: {
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
