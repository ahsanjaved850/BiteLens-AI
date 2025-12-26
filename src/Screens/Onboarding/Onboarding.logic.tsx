import { updateOnboading } from "@/backend/sendData";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, ViewToken } from "react-native";
import {
  INITIAL_PAGE_VALIDATION,
  NAVIGATION_ROUTES,
  PAGES,
  PageValidationState,
  VIEWABILITY_CONFIG,
} from "./Onboarding.static";

export const useOnboarding = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageValidation, setPageValidation] = useState<PageValidationState>(
    INITIAL_PAGE_VALIDATION
  );
  const flatListRef = useRef<FlatList>(null);

  const handleOnDone = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await updateOnboading(true);
      router.replace(NAVIGATION_ROUTES.HOME);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Error saving onboarding status:", error);
    }
  };

  const handleNext = async () => {
    if (!pageValidation[currentIndex]) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleOnDone();
    }
  };

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  ).current;

  const viewabilityConfig = useRef(VIEWABILITY_CONFIG).current;

  const handleUpdateValidation = (pageIndex: number, isValid: boolean) => {
    setPageValidation((prev) => ({
      ...prev,
      [pageIndex]: isValid,
    }));
  };

  const isLastPage = currentIndex === PAGES.length - 1;
  const isCurrentPageValid = pageValidation[currentIndex];
  const isFirstPage = currentIndex === 0;

  return {
    currentIndex,
    flatListRef,
    isLastPage,
    isCurrentPageValid,
    isFirstPage,
    handleNext,
    handleBack,
    handleViewableItemsChanged,
    viewabilityConfig,
    handleUpdateValidation,
  };
};