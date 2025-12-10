import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLoadingState } from "./LoadingState.logic";
import {
  APP_NAME,
  LOADER_COLOR,
  LoadingProps,
  SUBMESSAGES,
} from "./LoadingState.static";
import { loadingstyles } from "./loadingState.style";

export const LoadingState: React.FC<LoadingProps> = ({
  message,
  type = "default",
  overlay = true,
}) => {
  const { displayMessage, currentMessageIndex, messages } = useLoadingState({
    message,
    type,
  });

  return (
    <View style={[loadingstyles.container, overlay && loadingstyles.overlay]}>
      <View style={loadingstyles.contentWrapper}>
        <View style={loadingstyles.logoContainer}>
          <Text style={loadingstyles.logoText}>{APP_NAME}</Text>
        </View>

        <View style={loadingstyles.progressContainer}>
          <ActivityIndicator size="large" color={LOADER_COLOR} />
        </View>

        <Text style={loadingstyles.message}>{displayMessage}</Text>

        {type !== "default" && (
          <Text style={loadingstyles.submessage}>{SUBMESSAGES[type]}</Text>
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
