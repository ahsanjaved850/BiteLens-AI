import { onboardingStyles } from "@/src/Screens/Onboarding/Onboarding.style";
import React from "react";
import {
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

export default function OnboardingScreen() {
  const {
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
        />
      </View>
    );
  };

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
          <Text style={onboardingStyles.backButtonText}>
            {BUTTON_TEXT.BACK}
          </Text>
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
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled={false}
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
            {isLastPage ? BUTTON_TEXT.GET_STARTED : BUTTON_TEXT.NEXT}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
