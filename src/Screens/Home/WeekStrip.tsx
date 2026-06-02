import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CELL_W = 56;
const CELL_GAP = 7;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const getDateStr = (d: Date) => d.toISOString().split("T")[0];

const useTodayStr = (): string => {
  const [todayStr, setTodayStr] = React.useState(() => getDateStr(new Date()));

  React.useEffect(() => {
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
        setTodayStr(getDateStr(new Date()));
        scheduleNextMidnight(); // schedule the next midnight after updating
      }, msUntilMidnight);

      return timer;
    };

    const timer = scheduleNextMidnight();
    return () => clearTimeout(timer);
  }, []);

  return todayStr;
};

export const WeekStrip: React.FC<{
  selectedDate: string;
  onSelectDate: (date: string) => void;
  isLoading?: boolean;
}> = ({ selectedDate, onSelectDate, isLoading = false }) => {
  // ← Use the live hook instead of a one-time snapshot
  const todayStr = useTodayStr();

  const scrollRef = React.useRef<ScrollView>(null);
  const { width: SW } = Dimensions.get("window");

  // Build 28-day window: 21 past days + today + 6 future (faded)
  const days = React.useMemo(() => {
    const today = new Date(todayStr + "T00:00:00");
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - 21 + i);
      return getDateStr(d);
    });
  }, [todayStr]); // re-builds when todayStr updates at midnight

  // Scroll so selected date is centered on mount + when selectedDate changes
  React.useEffect(() => {
    const idx = days.indexOf(selectedDate);
    if (idx < 0 || !scrollRef.current) return;
    const x = idx * (CELL_W + CELL_GAP) - SW / 2 + CELL_W / 2;
    setTimeout(
      () => scrollRef.current?.scrollTo({ x: Math.max(0, x), animated: true }),
      100,
    );
  }, [selectedDate, days, SW]);

  return (
    <View style={ws.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={ws.scrollContent}
        decelerationRate="fast"
      >
        {days.map((dateStr) => {
          const d = new Date(dateStr + "T00:00:00");
          const dayName = DAYS[d.getDay()];
          const dayNum = d.getDate();
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;

          return (
            <TouchableOpacity
              key={dateStr}
              style={[
                ws.cell,
                isSelected && ws.cellSelected,
                isFuture && ws.cellFuture,
              ]}
              onPress={() => !isFuture && !isLoading && onSelectDate(dateStr)}
              disabled={isFuture || isLoading}
              activeOpacity={0.7}
            >
              {/* Day name */}
              <Text
                style={[
                  ws.dayName,
                  isSelected && ws.dayNameSelected,
                  isFuture && ws.dayNameFaded,
                ]}
              >
                {dayName}
              </Text>

              {/* Circle around number */}
              <View
                style={[
                  ws.circle,
                  isSelected && ws.circleSelected,
                  isToday && !isSelected && ws.circleToday,
                  isFuture && ws.circleFaded,
                ]}
              >
                <Text
                  style={[
                    ws.dayNum,
                    isSelected && ws.dayNumSelected,
                    isFuture && ws.dayNumFaded,
                  ]}
                >
                  {dayNum}
                </Text>
              </View>

              {/* Loading spinner replaces dot for selected+loading */}
              {isSelected && isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#F47B20"
                  style={{ marginTop: 3 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const ws = {
  root: {
    paddingTop: 0,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
  } as const,
  scrollContent: {
    paddingHorizontal: 16,
    gap: CELL_GAP,
    alignItems: "center" as const,
  },
  cell: {
    width: CELL_W,
    alignItems: "center" as const,
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
  },
  cellSelected: {
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
  cellFuture: {
    opacity: 0.3,
  },
  dayName: {
    fontSize: 11,
    fontWeight: "400" as const,
    color: "#7A8A98",
    letterSpacing: 0.2,
  },
  dayNameSelected: {
    fontSize: 12,
    color: "#F47B20",
    fontWeight: "600" as const,
  },
  dayNameFaded: {
    color: "#B0BECA",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1.5,
    borderColor: "#E0D0C0",
    borderStyle: "dashed" as const,
  },
  circleSelected: {
    borderStyle: "solid" as const,
    borderColor: "#f47c20b8",
  },
  circleToday: {
    borderStyle: "solid" as const,
    borderColor: "#F47B20",
    borderWidth: 2,
  },
  circleFaded: {
    borderColor: "#E8E0D8",
  },
  dayNum: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#0F1A22",
    letterSpacing: -0.5,
  },
  dayNumSelected: {
    color: "#F47B20",
  },
  dayNumFaded: {
    color: "#C0B8B0",
  },
};
