import { signIn, signUp } from "@/backend/auth";
import React, { useState } from "react";
import { Alert, Image, StatusBar, Text, TextInput, View } from "react-native";
import { introstyle } from "../Onboarding/Onboarding.style";
import { loginStyles } from "./login.style";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);

  const handleSignInSignUp = async () => {
    if (!newUser) {
      try {
        await signIn(email, password);
        onLogin();
      } catch (err: any) {
        Alert.alert("Login Failed", err.message);
      }
    } else {
      try {
        await signUp(email, password);
        Alert.alert("Signup successful! Please verify your email.");
      } catch (err: any) {
        Alert.alert("Signup Failed", err.message);
      }
    }
  };

  const toggleSignInForm = (): void => {
    setNewUser(!newUser);
  };

  return (
    <View style={loginStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={introstyle.logoContainer}>
        <Image
          style={introstyle.logo}
          source={require("@/assets/images/app_icon.png")}
        />
        <Text style={introstyle.headerName}>GreenBite AI</Text>
      </View>
      <View style={loginStyles.formContainer}>
        <Text style={loginStyles.title}>{newUser ? "Sign Up" : "Sign In"}</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={loginStyles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={loginStyles.input}
        />
        <Text style={loginStyles.submitButton} onPress={handleSignInSignUp}>
          {newUser ? "SignUp" : "Login"}
        </Text>
        <View style={loginStyles.toggleContainer}>
          <Text style={loginStyles.toggleText}>
            {newUser ? "Already have an account?" : "New to GreenBite AI?"}
          </Text>
          <Text style={loginStyles.toggleLink} onPress={toggleSignInForm}>
            {newUser ? "SignIn" : "SignUp Now"}
          </Text>
        </View>
      </View>
    </View>
  );
}
