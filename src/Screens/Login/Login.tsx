import { signIn, signUp } from "@/backend/auth";
import React, { useState } from "react";
import { Alert, Image, StatusBar, Text, TextInput, View } from "react-native";
import { introstyle } from "../Onboarding/Onboarding.style";

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);
  console.log(newUser, "from user");
  console.log(`from loginpage ${name}`);
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
        await signUp(email, password, name);
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
    <View
      style={{
        padding: 20,
        backgroundColor: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={introstyle.logoContainer}>
        <Image
          style={introstyle.logo}
          source={require("@/assets/images/app_icon.png")}
        />
        <Text style={introstyle.headerName}>GreenBite AI</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 60,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginVertical: 16,
          }}
        >
          {newUser ? "Sign Up" : "Sign In"}
        </Text>
        {newUser ? (
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 0.7,
              marginBottom: 10,
              padding: 12,
              borderRadius: 20,
            }}
          />
        ) : (
          <View></View>
        )}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            borderWidth: 0.7,
            marginBottom: 10,
            padding: 12,
            borderRadius: 20,
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 0.7,
            marginBottom: 10,
            padding: 12,
            borderRadius: 20,
          }}
        />
        <Text
          style={{
            borderWidth: 0.5,
            marginBottom: 10,
            padding: 6,
            borderRadius: 20,
            fontWeight: "bold",
            backgroundColor: "#FAF9F6",
            textAlign: "center",
          }}
          onPress={handleSignInSignUp}
        >
          {newUser ? "SignUp" : "Login"}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 6,
            alignItems: "center",
          }}
        >
          <Text style={{ marginRight: 3, fontSize: 12 }}>
            {newUser ? "Already have an account?" : "New to GreenBite AI?"}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
            onPress={toggleSignInForm}
          >
            {newUser ? "SignIn" : "SignUp Now"}
          </Text>
        </View>
      </View>
    </View>
  );
}
