import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { loadingstyles } from "./loadingState.style";

interface LoadingProps {
  message?: string;
  type?: "onboarding" | "analysis" | "setup" | "default";
  overlay?: boolean;
}

const loadingMessages = {
  onboarding: [
    "Setting up your profile...",
    "Calculating your nutrition plan...",
    "Creating your personalized goals...",
    "Almost done!",
  ],
  analysis: [
    "Analyzing your meal...",
    "Identifying ingredients...",
    "Calculating nutrition...",
    "Done!",
  ],
  setup: [
    "Preparing your vegan journey...",
    "Loading your meal database...",
    "Syncing with your goals...",
    "Ready to go!",
  ],
  default: ["Loading..."],
};

export const LoadingState: React.FC<LoadingProps> = ({
  message,
  type = "default",
  overlay = true,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = loadingMessages[type];
  const displayMessage = message || messages[currentMessageIndex];

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <View style={[loadingstyles.container, overlay && loadingstyles.overlay]}>
      <View style={loadingstyles.contentWrapper}>
        <View style={loadingstyles.logoContainer}>
          <Text style={loadingstyles.logoText}>GreenBite AI</Text>
        </View>

        <View style={loadingstyles.progressContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
        </View>

        <Text style={loadingstyles.message}>{displayMessage}</Text>

        {type !== "default" && (
          <Text style={loadingstyles.submessage}>
            {type === "onboarding" &&
              "This helps us understand your dietary needs"}
            {type === "analysis" && "Using AI to ensure accuracy"}
            {type === "setup" && "Customizing for your vegan lifestyle"}
          </Text>
        )}

        <View style={loadingstyles.dots}>
          {messages.map((_, index) => (
            <View
              key={index}
              style={[
                loadingstyles.dot,
                index === currentMessageIndex && loadingstyles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
