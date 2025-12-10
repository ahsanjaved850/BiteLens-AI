import { signIn, signUp } from "@/backend/auth";
import { useCallback, useState } from "react";
import { Alert, Keyboard } from "react-native";
import {
  ALERT_MESSAGES,
  ERROR_MESSAGES,
  LoginScreenProps,
  VALIDATION_RULES,
  ValidationErrors,
} from "./Login.static";

export const useLogin = ({ onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});

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

    try {
      if (newUser) {
        await signUp(email, password);
        Alert.alert(
          ALERT_MESSAGES.SIGNUP_SUCCESS.title,
          ALERT_MESSAGES.SIGNUP_SUCCESS.message,
          [{ text: ALERT_MESSAGES.SIGNUP_SUCCESS.button }]
        );
      } else {
        await signIn(email, password);
        onLogin();
      }
    } catch (err: any) {
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
        ]
      );
    } finally {
      setLoading(false);
    }
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
    showPassword,
    focusedField,
    errors,
    isFormValid,
    setEmail,
    setPassword,
    handleSignInSignUp,
    handleToggleSignInForm,
    handleTogglePasswordVisibility,
    handleFocus,
    handleBlur,
  };
};
