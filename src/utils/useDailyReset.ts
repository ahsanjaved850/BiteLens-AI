import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useDailyReset = (onReset: () => void) => {
  const lastDateRef = useRef<string>(getTodayString());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResetRef = useRef(onReset);

  useEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  const checkDateChange = useCallback(() => {
    const today = getTodayString();
    if (today !== lastDateRef.current) {
      lastDateRef.current = today;
      onResetRef.current();
    }
  }, []);

  const scheduleMidnightTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 5, 0); // 00:00:05 — 5s buffer to be safe

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    timerRef.current = setTimeout(() => {
      lastDateRef.current = getTodayString();
      onResetRef.current();
      // Reschedule for the next midnight
      scheduleMidnightTimer();
    }, msUntilMidnight);
  }, []);

  useEffect(() => {
    scheduleMidnightTimer();

    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          checkDateChange();
          // Reschedule timer in case phone was asleep across midnight
          scheduleMidnightTimer();
        }
      },
    );

    return () => {
      subscription.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [checkDateChange, scheduleMidnightTimer]);
};

const getTodayString = (): string => new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
