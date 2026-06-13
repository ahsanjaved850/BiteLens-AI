import { getInitialDetails } from "@/backend/getData";
import { updateDailyIntake } from "@/backend/sendData";
import { useDailyReset } from "@/src/utils/hooks/useDailyReset";
import {
  fetchUserMeals,
  getTodayNutrition,
  MealData,
} from "@/src/utils/supabase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DailyNutrition,
  INITIAL_NUTRITION_STATE,
  PROGRESS_COLORS,
  PROGRESS_THRESHOLDS,
} from "./Home.static";

const useTodayStr = (): string => {
  const getToday = () => new Date().toISOString().split("T")[0];
  const [todayStr, setTodayStr] = useState(getToday);

  useEffect(() => {
    const scheduleNextMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0,
      );
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const timer = setTimeout(() => {
        setTodayStr(getToday());
        scheduleNextMidnight();
      }, msUntilMidnight);

      return timer;
    };

    const timer = scheduleNextMidnight();
    return () => clearTimeout(timer);
  }, []);

  return todayStr;
};

const getDateString = (date?: Date | string): string => {
  if (!date) return new Date().toISOString().split("T")[0];
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
};

const formatSelectedDate = (dateStr: string, todayStr: string): string => {
  if (dateStr === todayStr) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === getDateString(yesterday)) return "Yesterday";

  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const useHome = () => {
  const navigation = useNavigation();

  const todayStr = useTodayStr();

  const [modalVisible, setModalVisible] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Full-screen loading only for very first load
  const [loading, setLoading] = useState(true);

  const [initialDetails, setInitialDetails] = useState<DailyNutrition>();
  const [meals, setMeals] = useState<MealData[]>([]);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition>(
    INITIAL_NUTRITION_STATE,
  );

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    getDateString(),
  );

  // isToday now compares against the live todayStr, not a stale snapshot
  const isToday = selectedDate === todayStr;
  const formattedSelectedDate = formatSelectedDate(selectedDate, todayStr);

  const hasLoadedOnceRef = useRef(false);
  const fetchIdRef = useRef(0);
  const selectedDateRef = useRef(selectedDate);

  const loadMeals = useCallback(
    async ({
      showLoader = false,
      showRefresh = false,
      date,
    }: {
      showLoader?: boolean;
      showRefresh?: boolean;
      date?: string;
    } = {}) => {
      // Stamp this request. Any older in-flight fetch will detect its ID
      // is stale and discard results instead of overwriting with wrong data.
      fetchIdRef.current += 1;
      const myFetchId = fetchIdRef.current;

      try {
        if (showLoader) setLoading(true);
        if (showRefresh) setRefreshing(true);

        // Fetch independently so one failure does not wipe all the data
        const [mealsResult, detailsResult, nutritionResult] =
          await Promise.allSettled([
            fetchUserMeals(date),
            getInitialDetails(),
            getTodayNutrition(date),
          ]);

        // A newer fetch started while we were awaiting — discard stale results
        if (myFetchId !== fetchIdRef.current) return;

        if (mealsResult.status === "fulfilled") {
          setMeals(mealsResult.value || []);
        } else {
          console.error("Error loading meals:", mealsResult.reason);
        }

        if (detailsResult.status === "fulfilled") {
          setInitialDetails(detailsResult.value);
        } else {
          console.error("Error loading initial details:", detailsResult.reason);
        }

        if (nutritionResult.status === "fulfilled") {
          setTodayNutrition(nutritionResult.value || INITIAL_NUTRITION_STATE);
        } else {
          console.error(
            "Error loading today nutrition:",
            nutritionResult.reason,
          );
        }
      } finally {
        // Always clear loading indicators — even for cancelled fetches.
        // If we don't, a cancelled initial load leaves loading=true forever.
        if (showLoader) setLoading(false);
        if (showRefresh) setRefreshing(false);
      }
    },
    [],
  );

  // Keep ref in sync so useFocusEffect always reads the current date
  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      if (!hasLoadedOnceRef.current) {
        hasLoadedOnceRef.current = true;
        loadMeals({ showLoader: true, date: selectedDateRef.current });
      } else {
        // Silent refresh when returning to Home
        loadMeals({ date: selectedDateRef.current });
      }
    }, [loadMeals]),
  );

  // ── When todayStr changes (midnight rollover), snap back to new today ──
  useEffect(() => {
    setSelectedDate(todayStr);
    setTodayNutrition(INITIAL_NUTRITION_STATE);
    setMeals([]);
    loadMeals({ date: todayStr });
  }, [todayStr]); // fires only when todayStr actually changes (midnight)

  // ── Daily reset — kept for compatibility with useDailyReset hook ───────
  useDailyReset(() => {
    setSelectedDate(todayStr);
    setTodayNutrition(INITIAL_NUTRITION_STATE);
    setMeals([]);
    loadMeals({ date: todayStr });
  });

  const handleDateChange = useCallback(
    (date: string) => {
      if (date > todayStr) return;

      // Instantly clear UI and show loading state while new date's data loads
      setTodayNutrition(INITIAL_NUTRITION_STATE);
      setMeals([]);
      setSelectedDate(date);
      loadMeals({ date, showRefresh: true });
    },
    [loadMeals, todayStr],
  );

  const handleRefresh = () => {
    loadMeals({ showRefresh: true, date: selectedDate });
  };

  const handleAddMealPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleMealSuccess = async (mealData: MealData) => {
    try {
      await updateDailyIntake(
        mealData.calories,
        mealData.protein,
        mealData.carbs,
        mealData.fat,
        mealData.sugar || 0,
        mealData.sodium || 0,
        mealData.fiber || 0,
      );
    } catch (error) {
      console.error("Error updating daily intake:", error);
    } finally {
      setModalVisible(false);
      // Silent refresh after meal save
      await loadMeals({ date: selectedDate });
    }
  };

  const handleMealPress = (meal: MealData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (navigation as any).navigate("mealDetails", { meal });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `Today at ${time}`;
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return `Yesterday at ${time}`;
    } else {
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
      return `${dateStr} at ${time}`;
    }
  };

  const getProgressColor = (value: number, goal: number) => {
    if (!goal || goal <= 0) return PROGRESS_COLORS.LOW;

    const percentage = (value / goal) * 100;

    if (percentage < PROGRESS_THRESHOLDS.LOW) return PROGRESS_COLORS.LOW;
    if (percentage < PROGRESS_THRESHOLDS.MEDIUM) return PROGRESS_COLORS.MEDIUM;
    if (percentage < PROGRESS_THRESHOLDS.HIGH) return PROGRESS_COLORS.HIGH;
    return PROGRESS_COLORS.EXCEEDED;
  };

  return {
    modalVisible,
    loadingAI,
    refreshing,
    loading,
    initialDetails,
    meals,
    todayNutrition,
    selectedDate,
    isToday,
    formattedSelectedDate,
    handleRefresh,
    handleAddMealPress,
    handleModalClose,
    handleMealSuccess,
    handleMealPress,
    handleDateChange,
    formatTime,
    formatDate,
    formatFullDateTime,
    getProgressColor,
    setLoadingAI,
  };
};
