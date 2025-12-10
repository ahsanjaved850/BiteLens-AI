declare module "react-native-onboarding-swiper" {
  import { ComponentType, ReactNode } from "react";
  import { TextStyle, ViewStyle } from "react-native";

  interface Page {
    backgroundColor?: string;
    image?: ReactNode;
    title?: string;
    subtitle?: string;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  interface OnboardingProps {
    pages?: Page[];
    onSkip?: () => void;
    onDone?: () => void;
    onNext?: () => void;
    onSlideChange?: (index: number, total: number) => void;
    bottomBarHighlight?: boolean;
    bottomBarHeight?: number;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    skipLabel?: string;
    nextLabel?: string;
    doneLabel?: string;
    containerStyles?: ViewStyle;
    bottomBarColor?: string;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
    imageContainerStyles?: ViewStyle;
    controlStatusBar?: boolean;
    allowFontScaling?: boolean;
    transitionAnimationDuration?: number;
    SkipButtonComponent?: ComponentType;
    NextButtonComponent?: ComponentType;
    DoneButtonComponent?: ComponentType;
    DotComponent?: ComponentType<{ selected: boolean }>;
  }

  const Onboarding: ComponentType<OnboardingProps>;
  export default Onboarding;
}
