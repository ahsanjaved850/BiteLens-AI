import { AppIntro } from "@/src/components/OnboardingFeatures/AppIntro";
import { BodyStatInput } from "@/src/components/OnboardingFeatures/BodyStatInput";
import { Completion } from "@/src/components/OnboardingFeatures/Completion";
import { Demo } from "@/src/components/OnboardingFeatures/Demo";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/FitnessGoal";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GenderSelection";
import { LifeStyle } from "@/src/components/OnboardingFeatures/LifeStyle";
import { MotivationalSlide } from "@/src/components/OnboardingFeatures/MotivationSlide";
import { NameAdding } from "@/src/components/OnboardingFeatures/NameAdding";
import { OtherApps } from "@/src/components/OnboardingFeatures/OtherApps";
import { PhysiqueInput } from "@/src/components/OnboardingFeatures/PhysiqueInput";
import { onboardingStyles } from "@/src/Screens/Onboarding/Onboarding.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// All onboarding pages
const PAGES = [
  { key: "1", component: AppIntro, requiresValidation: false },
  { key: "2", component: Demo, requiresValidation: false },
  { key: "3", component: NameAdding, requiresValidation: true },
  { key: "4", component: MotivationalSlide, requiresValidation: false },
  { key: "5", component: GenderSelection, requiresValidation: true },
  { key: "6", component: OtherApps, requiresValidation: true },
  { key: "7", component: BodyStatInput, requiresValidation: false },
  { key: "8", component: PhysiqueInput, requiresValidation: true },
  { key: "9", component: FitnessGoal, requiresValidation: true },
  { key: "10", component: LifeStyle, requiresValidation: true },
  { key: "11", component: Completion, requiresValidation: false },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageValidation, setPageValidation] = useState<{
    [key: number]: boolean;
  }>({
    0: true, // AppIntro - no validation needed
    1: true, // Demo - no validation needed
    2: false, // NameAdding - needs name
    3: true, // MotivationalSlide - no validation needed
    4: false, // GenderSelection - needs gender
    5: false, // OtherApps - needs selection
    6: true, // GraphComparison - no validation needed
    7: false, // PhysiqueInput - needs all fields
    8: false, // FitnessGoal - needs goal
    9: false, // LifeStyle - needs lifestyle
    10: true, // Completion - no validation needed
  });

  const flatListRef = useRef<FlatList>(null);

  const handleOnDone = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await AsyncStorage.setItem("onboarding_seen", "true");
      router.replace("/tabs/home");
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Error saving onboarding status:", error);
    }
  };

  const handleNext = async () => {
    if (!pageValidation[currentIndex]) {
      // Show warning haptic if page is not complete
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

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Function to update validation state from child components
  const updateValidation = (pageIndex: number, isValid: boolean) => {
    setPageValidation((prev) => ({
      ...prev,
      [pageIndex]: isValid,
    }));
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof PAGES)[0];
    index: number;
  }) => {
    const PageComponent = item.component;
    return (
      <View style={{ width }}>
        <PageComponent
          onValidationChange={(isValid: boolean) =>
            updateValidation(index, isValid)
          }
        />
      </View>
    );
  };

  const isLastPage = currentIndex === PAGES.length - 1;
  const isCurrentPageValid = pageValidation[currentIndex];
  const isFirstPage = currentIndex === 0;

  return (
    <SafeAreaView style={onboardingStyles.container} edges={["top", "bottom"]}>
      {/* Top Bar with Back Button and Dots */}
      <View style={onboardingStyles.topBar}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          style={[
            onboardingStyles.backButton,
            isFirstPage && onboardingStyles.backButtonHidden,
          ]}
          disabled={isFirstPage}
          activeOpacity={0.7}
        >
          <Text style={onboardingStyles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Dots Indicator */}
        <View style={onboardingStyles.dotsContainer}>
          {PAGES.map((_, index) => (
            <View
              key={index}
              style={[
                onboardingStyles.dot,
                index === currentIndex
                  ? onboardingStyles.dotActive
                  : onboardingStyles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled={false} // Disable manual scrolling, only button navigation
      />

      {/* Bottom Bar with Next Button */}
      <View style={onboardingStyles.bottomBar}>
        <TouchableOpacity
          onPress={handleNext}
          style={[
            onboardingStyles.nextButton,
            isLastPage && onboardingStyles.doneButton,
            !isCurrentPageValid && onboardingStyles.buttonDisabled,
          ]}
          disabled={!isCurrentPageValid}
          activeOpacity={0.8}
        >
          <Text
            style={[
              onboardingStyles.buttonText,
              !isCurrentPageValid && onboardingStyles.buttonTextDisabled,
            ]}
          >
            {isLastPage ? "Get Started 🚀" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
