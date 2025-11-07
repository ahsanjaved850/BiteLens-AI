import { signIn, signUp } from "@/backend/auth";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, loginStyles } from "./login.style";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Email validation
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Password validation
  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= 6;
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (newUser && !validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, newUser, validateEmail, validatePassword]);

  // Handle sign in/up
  const handleSignInSignUp = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (newUser) {
        await signUp(email, password);
        Alert.alert(
          "Success! 🎉",
          "Account created! Please verify your email to continue.",
          [{ text: "OK" }]
        );
      } else {
        await signIn(email, password);
        onLogin();
      }
    } catch (err: any) {
      Alert.alert(
        newUser ? "Signup Failed" : "Login Failed",
        err.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle between sign in and sign up
  const toggleSignInForm = () => {
    setNewUser((prev) => !prev);
    setErrors({});
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle field focus
  const handleFocus = (field: string) => {
    setFocusedField(field);
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const isFormValid = email.trim() && password.trim() && !loading;

  return (
    <SafeAreaView style={loginStyles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={loginStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={loginStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={loginStyles.contentContainer}>
              {/* Logo Section */}
              <View style={loginStyles.logoContainer}>
                <View style={loginStyles.logoWrapper}>
                  <Image
                    source={require("@/assets/images/app_icon.png")}
                    style={loginStyles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={loginStyles.appName}>GreenBite AI</Text>
                <Text style={loginStyles.appTagline}>
                  Your AI Nutrition Assistant
                </Text>
              </View>

              {/* Form Section */}
              <View style={loginStyles.formContainer}>
                {/* Form Title */}
                <Text style={loginStyles.formTitle}>
                  {newUser ? "Create Account" : "Welcome Back"}
                </Text>
                <Text style={loginStyles.formSubtitle}>
                  {newUser
                    ? "Sign up to start your wellness journey"
                    : "Sign in to continue your journey"}
                </Text>

                {/* Email Input */}
                <View style={loginStyles.inputContainer}>
                  <Text style={loginStyles.inputLabel}>Email</Text>
                  <View style={loginStyles.inputWrapper}>
                    <TextInput
                      placeholder="your@email.com"
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

                {/* Password Input */}
                <View style={loginStyles.inputContainer}>
                  <Text style={loginStyles.inputLabel}>Password</Text>
                  <View style={loginStyles.inputWrapper}>
                    <TextInput
                      placeholder={
                        newUser ? "Min. 6 characters" : "Enter password"
                      }
                      placeholderTextColor={COLORS.textLight}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      secureTextEntry={!showPassword}
                      style={[
                        loginStyles.input,
                        focusedField === "password" && loginStyles.inputFocused,
                        errors.password && loginStyles.inputError,
                      ]}
                      autoComplete="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSignInSignUp}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={loginStyles.inputIcon}
                      onPress={togglePasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <Text style={loginStyles.passwordToggleText}>
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={loginStyles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Forgot Password (only for sign in) */}
                {/* {!newUser && (
                  <View style={loginStyles.forgotPasswordContainer}>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={loginStyles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                )} */}

                {/* Submit Button */}
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
                      {newUser ? "Create Account" : "Sign In"}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                {/* <View style={loginStyles.dividerContainer}>
                  <View style={loginStyles.dividerLine} />
                  <Text style={loginStyles.dividerText}>or</Text>
                  <View style={loginStyles.dividerLine} />
                </View> */}

                {/* Social Buttons (Optional - can be removed if not needed) */}
                {/* <View style={loginStyles.socialButtonsContainer}>
                  <TouchableOpacity
                    style={loginStyles.socialButton}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text style={loginStyles.socialButtonIcon}>🍎</Text>
                    <Text style={loginStyles.socialButtonText}>
                      Continue with Apple
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={loginStyles.socialButton}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text style={loginStyles.socialButtonIcon}>📧</Text>
                    <Text style={loginStyles.socialButtonText}>
                      Continue with Google
                    </Text>
                  </TouchableOpacity>
                </View> */}
                {/* Toggle Sign In/Up */}
                <View style={loginStyles.toggleContainer}>
                  <Text style={loginStyles.toggleText}>
                    {newUser
                      ? "Already have an account?"
                      : "New to GreenBite AI?"}
                  </Text>
                  <TouchableOpacity
                    onPress={toggleSignInForm}
                    activeOpacity={0.7}
                  >
                    <Text style={loginStyles.toggleLink}>
                      {newUser ? "Sign In" : "Sign Up"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Terms & Privacy */}
                {/* {newUser && (
                  <View style={loginStyles.termsContainer}>
                    <Text style={loginStyles.termsText}>
                      By signing up, you agree to our{" "}
                      <Text style={loginStyles.termsLink}>
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text style={loginStyles.termsLink}>Privacy Policy</Text>
                    </Text>
                  </View>
                )} */}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
