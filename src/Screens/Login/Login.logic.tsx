import { signIn, signUp } from "@/backend/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard } from "react-native";
import {
  ALERT_MESSAGES,
  ERROR_MESSAGES,
  LoginScreenProps,
  VALIDATION_RULES,
  ValidationErrors,
} from "./Login.static";

export const useLogin = ({ onLogin, mode = "signin" }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // Initialize from mode prop — signup screen starts locked to signup
  const [newUser, setNewUser] = useState<boolean>(mode === "signup");
  const [loading, setLoading] = useState<boolean>(false);
  // True from the moment a signup submit starts until navigation unmounts
  // this screen. Only cleared on error (or safety timeout) — on success it
  // stays true so the overlay covers signup → data sync → navigation.
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety net: never leave the overlay stuck if something hangs silently
  useEffect(() => {
    if (signingUp) {
      safetyTimer.current = setTimeout(() => setSigningUp(false), 30000);
    } else if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
    return () => {
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, [signingUp]);

  const validateEmail = useCallback((email: string): boolean => {
    return VALIDATION_RULES.EMAIL_REGEX.test(email);
  }, []);

  const validatePassword = useCallback((password: string): boolean => {
    return password.length >= VALIDATION_RULES.MIN_PASSWORD_LENGTH;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email.trim()) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!validateEmail(email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    if (!password.trim()) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    } else if (newUser && !validatePassword(password)) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, newUser, validateEmail, validatePassword]);

  const handleSignInSignUp = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    if (newUser) setSigningUp(true);

    try {
      if (newUser) {
        await signUp(email, password);
        // After signup Supabase fires onAuthStateChange which handles navigation.
        // Call onLogin so parent can also react if needed.
        // NOTE: signingUp intentionally stays true here — the overlay keeps
        // covering the screen while data syncs and navigation completes.
        onLogin();
      } else {
        await signIn(email, password);
        onLogin();
      }
    } catch (err: any) {
      setSigningUp(false);
      Alert.alert(
        newUser
          ? ALERT_MESSAGES.SIGNUP_FAILED.title
          : ALERT_MESSAGES.LOGIN_FAILED.title,
        err.message ||
          (newUser
            ? ALERT_MESSAGES.SIGNUP_FAILED.fallback
            : ALERT_MESSAGES.LOGIN_FAILED.fallback),
        [
          {
            text: newUser
              ? ALERT_MESSAGES.SIGNUP_FAILED.button
              : ALERT_MESSAGES.LOGIN_FAILED.button,
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  // Apple/social auth has its own async flow inside <Auth />.
  // Start the same signup overlay before Supabase/finalize API calls begin.
  const handleSocialAuthStart = () => {
    if (newUser) setSigningUp(true);
  };

  // Clear the overlay only when the Apple/social flow fails or is cancelled.
  // On success, keep it visible until navigation unmounts this screen.
  const handleSocialAuthError = () => {
    setSigningUp(false);
  };

  const handleToggleSignInForm = () => {
    setNewUser((prev) => !prev);
    setErrors({});
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const isFormValid = email.trim() && password.trim() && !loading;

  return {
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
  };
};
