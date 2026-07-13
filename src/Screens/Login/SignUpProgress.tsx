import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, StyleSheet, Text, View } from "react-native";
import { SIGNUP_PROGRESS } from "./Login.static";
import { COLORS, ols } from "./login.style";

export const SignupProgress: React.FC<{ visible: boolean }> = ({ visible }) => {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(1)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    stepRef.current = 0;
    setStepIndex(0);
    stepFade.setValue(0);

    Animated.timing(stepFade, {
      toValue: 1,
      duration: 350,
      delay: 150,
      useNativeDriver: true,
    }).start();

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    spinLoop.start();
    pulseLoop.start();

    // Cycle through steps every 1.7s, then hold on the last one
    const interval = setInterval(() => {
      if (stepRef.current >= SIGNUP_PROGRESS.STEPS.length - 1) return;
      Animated.timing(stepFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        stepRef.current += 1;
        setStepIndex(stepRef.current);
        Animated.timing(stepFade, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }).start();
      });
    }, 1700);

    return () => {
      clearInterval(interval);
      spinLoop.stop();
      pulseLoop.stop();
      spin.setValue(0);
      pulse.setValue(0);
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={ols.root}>
        <LinearGradient
          colors={[
            COLORS.gradientTop,
            COLORS.gradientMid,
            COLORS.gradientBottom,
          ]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />

        <Text style={ols.wordmark}>Orca</Text>

        <View style={ols.ringWrap}>
          <Animated.View
            style={[
              ols.ringGlow,
              {
                opacity: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1.12],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={ols.ringTrack} />
          <Animated.View
            style={[
              ols.ringArc,
              {
                transform: [
                  {
                    rotate: spin.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        <Text style={ols.title}>{SIGNUP_PROGRESS.TITLE}</Text>

        <Animated.Text style={[ols.step, { opacity: stepFade }]}>
          {SIGNUP_PROGRESS.STEPS[stepIndex]}
        </Animated.Text>

        <View style={ols.dotsRow}>
          {SIGNUP_PROGRESS.STEPS.map((_, i) => (
            <View key={i} style={[ols.dot, i <= stepIndex && ols.dotActive]} />
          ))}
        </View>

        <Text style={ols.caption}>{SIGNUP_PROGRESS.CAPTION}</Text>
      </View>
    </Modal>
  );
};
