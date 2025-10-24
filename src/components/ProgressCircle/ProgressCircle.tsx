import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ProgressCircleProps {
  progress?: number;
  message?: string;
}

export const ProgressCircle = ({
  progress = 65,
  message = "Processing...",
}: ProgressCircleProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const safeProgress = Math.max(0, Math.min(100, progress || 0));
    Animated.timing(animatedValue, {
      toValue: safeProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "360deg"],
  });

  const safeProgress = Math.max(0, Math.min(100, Math.round(progress || 0)));

  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        {/* Background circle */}
        <View style={styles.backgroundCircle} />

        {/* Animated progress circle */}
        <Animated.View
          style={[
            styles.progressCircle,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <View style={styles.progressArc} />
        </Animated.View>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={styles.text}>{`${safeProgress}%`}</Text>
        </View>
      </View>
      <Text style={styles.label}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  circleWrapper: {
    width: 120,
    height: 120,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backgroundCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: "#E0E0E0",
  },
  progressCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 80,
  },
  progressArc: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: "#24a75a",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: "white",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
});
