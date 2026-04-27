import { getProfile } from "@/backend/getData";
import { updateOnboading } from "@/backend/sendData";
import { dataAnalysis } from "@/src/utils/dataAnalysis";
import { presentPaywall } from "@/src/utils/presentPaywall";
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
  const [isFinishing, setIsFinishing] = useState(false);
  const [startCompletionAnimation, setStartCompletionAnimation] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const handleOnDone = async () => {
    if (isFinishing) return;

    try {
      setIsFinishing(true);

      const profile = await getProfile();

      if (!profile) {
        throw new Error("Profile not found.");
      }

      await dataAnalysis(
        Number(profile.weight ?? 0),
        Number(profile.height ?? 0),
        Number(profile.age ?? 0),
        Number(profile.target_weight ?? 0),
        String(profile.gender ?? ""),
        String(profile.goal ?? "")
      );

      await updateOnboading(true);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(NAVIGATION_ROUTES.HOME);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setStartCompletionAnimation(false);
      setIsFinishing(false);
    }
  };

  const handleNext = async () => {
    if (!pageValidation[currentIndex] || isFinishing) {
      if (!pageValidation[currentIndex]) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      return;
    }

    // Last page: show paywall first, then start animation if user pays
    try {
      const didPurchase = await presentPaywall();

      if (!didPurchase) {
        // User cancelled/dismissed — stay on Completion READY screen
        return;
      }

      // User paid! Now start the Completion animation
      setStartCompletionAnimation(true);
    } catch (error) {
      console.error("Paywall error:", error);
    }
  };

  const handleBack = async () => {
    if (isFinishing || startCompletionAnimation) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleCompletionAnimationFinished = async () => {
    await handleOnDone();
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
  const progress = (currentIndex + 1) / PAGES.length;

  return {
    currentIndex,
    flatListRef,
    isLastPage,
    isCurrentPageValid,
    isFirstPage,
    progress,
    isFinishing,
    startCompletionAnimation,
    handleNext,
    handleBack,
    handleOnDone,
    handleCompletionAnimationFinished,
    handleViewableItemsChanged,
    viewabilityConfig,
    handleUpdateValidation,
  };
};