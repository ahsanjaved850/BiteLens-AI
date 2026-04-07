import { onboardingStyles } from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "./Onboarding.logic";
import { BUTTON_TEXT, PAGES } from "./Onboarding.static";

const { width } = Dimensions.get("window");

export function OnboardingScreen() {
  const {
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
    handleCompletionAnimationFinished,
    handleViewableItemsChanged,
    viewabilityConfig,
    handleUpdateValidation,
  } = useOnboarding();

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
            handleUpdateValidation(index, isValid)
          }
          startAnimation={index === PAGES.length - 1 ? startCompletionAnimation : false}
          onAnimationComplete={
            index === PAGES.length - 1
              ? handleCompletionAnimationFinished
              : undefined
          }
          isSubmitting={index === PAGES.length - 1 ? isFinishing : false}
        />
      </View>
    );
  };

  const disableBottomButton =
    !isCurrentPageValid || isFinishing || startCompletionAnimation;

  return (
    <SafeAreaView style={onboardingStyles.container} edges={["top", "bottom"]}>
      <View style={onboardingStyles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={[
            onboardingStyles.backButton,
            (isFirstPage || isFinishing || startCompletionAnimation) &&
              onboardingStyles.backButtonHidden,
          ]}
          disabled={isFirstPage || isFinishing || startCompletionAnimation}
          activeOpacity={0.7}
        >
          <Text style={onboardingStyles.backButtonText}>
            {BUTTON_TEXT.BACK}
          </Text>
        </TouchableOpacity>

        <View style={onboardingStyles.progressBarContainer}>
          <View
            style={[
              onboardingStyles.progressBarFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>

        <View style={{ width: 44 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled={false}
      />

      <View style={onboardingStyles.bottomBar}>
        <TouchableOpacity
          onPress={handleNext}
          style={[
            onboardingStyles.nextButton,
            isLastPage && onboardingStyles.doneButton,
            disableBottomButton && onboardingStyles.buttonDisabled,
          ]}
          disabled={disableBottomButton}
          activeOpacity={0.8}
        >
          {isFinishing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={[
                onboardingStyles.buttonText,
                disableBottomButton && onboardingStyles.buttonTextDisabled,
              ]}
            >
              {isLastPage ? BUTTON_TEXT.GET_STARTED : BUTTON_TEXT.NEXT}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}