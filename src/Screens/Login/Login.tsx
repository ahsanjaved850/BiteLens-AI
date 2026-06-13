import { Auth } from "@/src/utils/auth/auth.native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "./Login.logic";
import {
  BUTTON_LABELS,
  FORM_LABELS,
  FORM_SUBTITLES,
  FORM_TITLES,
  KEYBOARD_CONFIG,
  LoginScreenProps,
  PASSWORD_TOGGLE_ICONS,
  PLACEHOLDERS,
  SIGNUP_PROGRESS,
  TOGGLE_LINKS,
  TOGGLE_TEXTS,
} from "./Login.static";
import { COLORS, loginStyles } from "./login.style";

// ─── Signup progress overlay ──────────────────────────────────────────────────
// Covers the gap between signup submit → API calls / onboarding-data sync →
// navigation to Home. The Modal is ALWAYS mounted (visibility toggled via the
// `visible` prop) so it reliably appears above the keyboard and nav stack.
const RING = 96;

const SignupProgressOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
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

        <Text style={ols.wordmark}>orca</Text>

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

const ols = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: COLORS.gradientTop,
  },
  wordmark: {
    fontSize: 38,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -1.5,
    marginBottom: 36,
  },
  ringWrap: {
    width: RING,
    height: RING,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  ringGlow: {
    position: "absolute",
    width: RING + 40,
    height: RING + 40,
    borderRadius: (RING + 40) / 2,
    backgroundColor: "rgba(244,123,32,0.12)",
  },
  ringTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING / 2,
    borderWidth: 4.5,
    borderColor: "rgba(244,123,32,0.14)",
  },
  ringArc: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING / 2,
    borderWidth: 4.5,
    borderTopColor: COLORS.primary,
    borderRightColor: "rgba(244,123,32,0.45)",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  step: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 18,
    minHeight: 20,
    textAlign: "center",
  },
  dotsRow: { flexDirection: "row", gap: 7, marginBottom: 22 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(244,123,32,0.18)",
  },
  dotActive: { backgroundColor: COLORS.primary },
  caption: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textLight,
  },
});

export function LoginScreen({ onLogin, mode = "signin" }: LoginScreenProps) {
  const router = useRouter();
  const {
    email,
    password,
    newUser,
    loading,
    signingUp,
    showPassword,
    focusedField,
    errors,
    isFormValid,
    setEmail,
    setPassword,
    handleSignInSignUp,
    handleSocialAuthStart,
    handleSocialAuthError,
    handleToggleSignInForm,
    handleTogglePasswordVisibility,
    handleFocus,
    handleBlur,
  } = useLogin({ onLogin, mode });

  return (
    <SafeAreaView style={loginStyles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gradientTop} />

      <LinearGradient
        colors={[COLORS.gradientTop, COLORS.gradientMid, COLORS.gradientBottom]}
        locations={[0, 0.4, 1]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={loginStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? KEYBOARD_CONFIG.IOS_OFFSET
              : KEYBOARD_CONFIG.ANDROID_OFFSET
          }
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={loginStyles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={loginStyles.contentContainer}>
                {/* Back button — sign-in screen only, routes to WelcomeScreen */}
                {mode === "signin" && (
                  <TouchableOpacity
                    style={loginStyles.backButton}
                    onPress={() => router.replace("/auth/welcome")}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={loginStyles.backButtonText}>←</Text>
                  </TouchableOpacity>
                )}

                {/* Logo */}
                <View style={loginStyles.logoContainer}>
                  <Text style={loginStyles.wordmark}>orca</Text>
                </View>

                {/* Form */}
                <View style={loginStyles.formContainer}>
                  <Text style={loginStyles.formTitle}>
                    {newUser ? FORM_TITLES.SIGN_UP : FORM_TITLES.SIGN_IN}
                  </Text>
                  <Text style={loginStyles.formSubtitle}>
                    {newUser ? FORM_SUBTITLES.SIGN_UP : FORM_SUBTITLES.SIGN_IN}
                  </Text>

                  {/* Email */}
                  <View style={loginStyles.inputContainer}>
                    <Text style={loginStyles.inputLabel}>
                      {FORM_LABELS.EMAIL}
                    </Text>
                    <View style={loginStyles.inputWrapper}>
                      <TextInput
                        placeholder={PLACEHOLDERS.EMAIL}
                        placeholderTextColor={COLORS.textLight}
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        style={[
                          loginStyles.input,
                          focusedField === "email" && loginStyles.inputFocused,
                          errors.email && loginStyles.inputError,
                        ]}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        returnKeyType="next"
                        editable={!loading}
                      />
                    </View>
                    {errors.email && (
                      <Text style={loginStyles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password */}
                  <View style={loginStyles.inputContainer}>
                    <Text style={loginStyles.inputLabel}>
                      {FORM_LABELS.PASSWORD}
                    </Text>
                    <View style={loginStyles.inputWrapper}>
                      <TextInput
                        placeholder={
                          newUser
                            ? PLACEHOLDERS.PASSWORD_SIGNUP
                            : PLACEHOLDERS.PASSWORD_LOGIN
                        }
                        placeholderTextColor={COLORS.textLight}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => handleFocus("password")}
                        onBlur={handleBlur}
                        secureTextEntry={!showPassword}
                        style={[
                          loginStyles.input,
                          focusedField === "password" &&
                            loginStyles.inputFocused,
                          errors.password && loginStyles.inputError,
                        ]}
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSignInSignUp}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        style={loginStyles.inputIcon}
                        onPress={handleTogglePasswordVisibility}
                        activeOpacity={0.7}
                      >
                        <Text style={loginStyles.passwordToggleText}>
                          {showPassword
                            ? PASSWORD_TOGGLE_ICONS.SHOW
                            : PASSWORD_TOGGLE_ICONS.HIDE}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text style={loginStyles.errorText}>
                        {errors.password}
                      </Text>
                    )}
                  </View>

                  {/* Submit */}
                  <TouchableOpacity
                    style={[
                      loginStyles.submitButton,
                      !isFormValid && loginStyles.submitButtonDisabled,
                    ]}
                    onPress={handleSignInSignUp}
                    disabled={!isFormValid}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <Text
                        style={[
                          loginStyles.submitButtonText,
                          !isFormValid && loginStyles.submitButtonTextDisabled,
                        ]}
                      >
                        {newUser
                          ? BUTTON_LABELS.SIGN_UP
                          : BUTTON_LABELS.SIGN_IN}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Divider + Apple */}
                  <View style={loginStyles.dividerContainer}>
                    <View style={loginStyles.dividerLine} />
                    <Text style={loginStyles.dividerText}>or</Text>
                    <View style={loginStyles.dividerLine} />
                  </View>

                  <View style={loginStyles.appleButtonContainer}>
                    <Auth
                      onAuthStart={handleSocialAuthStart}
                      onAuthError={handleSocialAuthError}
                      onLogin={onLogin}
                      mode={newUser ? "signup" : "signin"}
                    />
                  </View>

                  {/* Toggle — hidden when mode is locked to signin or signup */}
                  {!mode && (
                    <View style={loginStyles.toggleContainer}>
                      <Text style={loginStyles.toggleText}>
                        {newUser
                          ? TOGGLE_TEXTS.TO_SIGN_IN
                          : TOGGLE_TEXTS.TO_SIGN_UP}
                      </Text>
                      <TouchableOpacity
                        onPress={handleToggleSignInForm}
                        activeOpacity={0.7}
                      >
                        <Text style={loginStyles.toggleLink}>
                          {newUser
                            ? TOGGLE_LINKS.SIGN_IN
                            : TOGGLE_LINKS.SIGN_UP}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* Full-screen progress overlay — only ever triggered by signup paths */}
      <SignupProgressOverlay visible={signingUp} />
    </SafeAreaView>
  );
}
