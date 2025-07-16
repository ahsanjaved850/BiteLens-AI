import { AppIntro } from "@/src/components/OnboardingFeatures/AppIntro";
import { Completion } from "@/src/components/OnboardingFeatures/Completion";
import { Demo } from "@/src/components/OnboardingFeatures/Demo";
import { FitnessGoal } from "@/src/components/OnboardingFeatures/FitnessGoal";
import { GenderSelection } from "@/src/components/OnboardingFeatures/GenderSelection";
import { GraphComparison } from "@/src/components/OnboardingFeatures/GraphComparison";
import { LifeStyle } from "@/src/components/OnboardingFeatures/LifeStyle";
import { MotivationalSlide } from "@/src/components/OnboardingFeatures/MotivationSlide";
import { OtherApps } from "@/src/components/OnboardingFeatures/OtherApps";
import { PhysiqueInput } from "@/src/components/OnboardingFeatures/PhysiqueInput";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";

export const OnboardingScreen: React.FC = () => {
  return (
    <Onboarding
      showSkip={false}
      bottomBarColor="#FAF9F6"
      bottomBarHeight={50}
      bottomBarHighlight={false}
      pages={[
        {
          backgroundColor: "white",
          image: <AppIntro />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <Demo />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <MotivationalSlide />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <GenderSelection />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <OtherApps />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <GraphComparison />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <PhysiqueInput />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <FitnessGoal />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <LifeStyle />,
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: "white",
          image: <Completion />,
          title: "",
          subtitle: "",
        },
      ]}
    />
  );
};
