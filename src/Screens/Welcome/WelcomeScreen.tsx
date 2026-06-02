import { setWelcomeSeen } from "@/src/utils/welcomeSeen";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { PageDots } from "./PageDots";
import { Slide1 } from "./Slide1";
import { Slide2 } from "./Slide2";
import { Slide3 } from "./Slide3";

const { width: SCREEN_W } = Dimensions.get("window");

const SLIDE_COUNT = 3;
const AUTO_ADVANCE_MS = 1500;

interface Props {
  startIndex?: number;
}

export const WelcomeScreen: React.FC<Props> = ({ startIndex = 0 }) => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const scrollX = useSharedValue(startIndex * SCREEN_W);

  const isDirectMode = startIndex === SLIDE_COUNT - 1;

  const userInteractedRef = useRef(isDirectMode);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Auto-advance — only runs in fresh carousel mode
  useEffect(() => {
    if (isDirectMode) return;
    if (userInteractedRef.current) return;
    if (activeIndex >= SLIDE_COUNT - 1) return;

    autoAdvanceTimerRef.current = setTimeout(() => {
      if (userInteractedRef.current) return;
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }, AUTO_ADVANCE_MS);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [activeIndex, isDirectMode]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = e.nativeEvent.contentOffset.x;
    },
    [scrollX],
  );

  const handleScrollBeginDrag = useCallback(() => {
    userInteractedRef.current = true;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const handleGetStarted = useCallback(async () => {
    await setWelcomeSeen();
    router.replace("/auth/onboarding");
  }, [router]);

  const handleLogin = useCallback(async () => {
    await setWelcomeSeen();
    router.replace("/auth/login");
  }, [router]);

  const renderItem = useCallback(
    ({ item, index }: { item: number; index: number }) => {
      const isActive = index === activeIndex;
      if (index === 0) return <Slide1 isActive={isActive} />;
      if (index === 1) return <Slide2 isActive={isActive} />;
      return (
        <Slide3
          isActive={isActive}
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
      );
    },
    [activeIndex, handleGetStarted, handleLogin],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <FlatList
        ref={flatListRef}
        data={[0, 1, 2]}
        keyExtractor={(item) => `slide-${item}`}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        initialScrollIndex={startIndex}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_W,
          offset: SCREEN_W * index,
          index,
        })}
      />

      {/* Page indicator — hidden on slide 3 since the CTA takes focus */}
      {activeIndex < SLIDE_COUNT - 1 && (
        <View style={styles.dotsContainer} pointerEvents="none">
          <PageDots
            count={SLIDE_COUNT}
            scrollX={scrollX}
            width={SCREEN_W}
            activeColor="#0A1A3D"
            inactiveColor="#0A1A3D"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDF27",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
