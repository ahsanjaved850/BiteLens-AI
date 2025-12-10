import { useEffect, useState } from "react";
import {
  LOADING_MESSAGES,
  LoadingProps,
  MESSAGE_ROTATION_INTERVAL,
} from "./LoadingState.static";

export const useLoadingState = ({
  message,
  type = "default",
}: LoadingProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = LOADING_MESSAGES[type];
  const displayMessage = message || messages[currentMessageIndex];

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, MESSAGE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [messages.length]);

  return {
    displayMessage,
    currentMessageIndex,
    messages,
  };
};
