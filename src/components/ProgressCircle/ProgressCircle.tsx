import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ProgressCircleProps {
  progress: number; // 0-100 percentage
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 160,
  strokeWidth = 12,
  color = "#3B82F6",
  backgroundColor = "#E5E7EB",
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.max(0, Math.min(100, progress || 0));

    Animated.timing(animatedValue, {
      toValue: clampedProgress,
      duration: 1000,
      useNativeDriver: false, // SVG animations don't support native driver
    }).start();
  }, [progress]);

  // Convert progress (0-100) to strokeDashoffset
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Calories Icon in Center */}
      <View style={[styles.iconContainer, { width: size, height: size }]}>
        <Ionicons name="flame" size={size * 0.3} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
