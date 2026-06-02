import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { WeightLog } from "./Data.static";
import { dataStyles } from "./Data.style";

const CHART_WIDTH = 320;
const CHART_HEIGHT = 230;

const PADDING_LEFT = 26;
const PADDING_RIGHT = 54;
const PADDING_TOP = 28;
const PADDING_BOTTOM = 34;

type Props = {
  logs: WeightLog[];
  currentWeight?: string;
  goalWeight?: string;
};

const getTodayStr = () => new Date().toISOString().split("T")[0];

const formatDateRange = (logs: WeightLog[]) => {
  if (logs.length === 0) {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const first = new Date(logs[0].date + "T00:00:00");
  const last = new Date(logs[logs.length - 1].date + "T00:00:00");

  const firstLabel = first.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const lastLabel = last.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${firstLabel} - ${lastLabel}`;
};

const getDayLabel = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return `${date.getDate()}`;
};

const buildBaseLogs = (currentWeight?: string): WeightLog[] => {
  const weight = Number(currentWeight);

  if (!currentWeight || Number.isNaN(weight)) {
    return [];
  }

  return [
    {
      id: "current-weight",
      date: getTodayStr(),
      weight,
    },
  ];
};

export const WeightTrendCard: React.FC<Props> = ({
  logs,
  currentWeight,
  goalWeight,
}) => {
  const chartLogs = logs.length > 0 ? logs : buildBaseLogs(currentWeight);

  const current = Number(currentWeight);
  const goal = Number(goalWeight);

  const hasCurrentWeight = !Number.isNaN(current);
  const hasGoalWeight = !Number.isNaN(goal);

  const allWeights = [
    ...chartLogs.map((item) => item.weight),
    ...(hasGoalWeight ? [goal] : []),
    ...(hasCurrentWeight ? [current] : []),
  ];

  const safeWeights = allWeights.length > 0 ? allWeights : [50, 60];

  const minRaw = Math.min(...safeWeights);
  const maxRaw = Math.max(...safeWeights);

  const chartMin = Math.floor(minRaw - 2);
  const chartMax = Math.ceil(maxRaw + 2);

  const usableWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const usableHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const getX = (index: number) => {
    if (chartLogs.length <= 1) return PADDING_LEFT + usableWidth * 0.15;
    return PADDING_LEFT + (index / (chartLogs.length - 1)) * usableWidth;
  };

  const getY = (weight: number) => {
    const range = chartMax - chartMin || 1;
    return PADDING_TOP + ((chartMax - weight) / range) * usableHeight;
  };

  const pathData = chartLogs
    .map((item, index) => {
      const x = getX(index);
      const y = getY(item.weight);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const goalY = hasGoalWeight ? getY(goal) : null;

  const yLabels = [chartMax, Math.round((chartMax + chartMin) / 2), chartMin];

  const latestWeight =
    chartLogs.length > 0
      ? chartLogs[chartLogs.length - 1].weight
      : hasCurrentWeight
        ? current
        : null;

  return (
    <View style={dataStyles.weightTrendCard}>
      <View style={dataStyles.weightTrackerTop}>
        <View>
          <Text style={dataStyles.sectionTitle}>Weight Tracker</Text>
        </View>
        <View style={dataStyles.weightTrackerDateBox}>
          <Text style={dataStyles.weightTrackerDateText}>
            {formatDateRange(chartLogs)}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#040404"
            fontWeight="600"
          />
        </View>
      </View>

      {/* <View style={dataStyles.weightTrackerDivider} /> */}

      <View style={dataStyles.weightTrackerChartContainer}>
        <Svg
          width="100%"
          height={CHART_HEIGHT}
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        >
          <Defs>
            <LinearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#F47B20" stopOpacity="0.18" />
              <Stop offset="1" stopColor="#F47B20" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* vertical dotted grid */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((position) => {
            const x = PADDING_LEFT + position * usableWidth;

            return (
              <Line
                key={`v-${position}`}
                x1={x}
                y1={PADDING_TOP}
                x2={x}
                y2={CHART_HEIGHT - PADDING_BOTTOM}
                stroke="#E8E0D8"
                strokeWidth={1.2}
                strokeDasharray="4 5"
              />
            );
          })}

          {/* right y-axis */}
          <Line
            x1={CHART_WIDTH - PADDING_RIGHT}
            y1={PADDING_TOP}
            x2={CHART_WIDTH - PADDING_RIGHT}
            y2={CHART_HEIGHT - PADDING_BOTTOM}
            stroke="#E0D8D0"
            strokeWidth={1.4}
          />

          {/* y-axis labels */}
          {yLabels.map((label) => {
            const y = getY(label);

            return (
              <SvgText
                key={`y-${label}`}
                x={CHART_WIDTH - PADDING_RIGHT + 8}
                y={y + 4}
                fontSize="12"
                fill="#7A8A98"
                fontWeight="700"
              >
                {label}kg
              </SvgText>
            );
          })}

          {/* goal line */}
          {goalY !== null && (
            <>
              <Line
                x1={PADDING_LEFT}
                y1={goalY}
                x2={CHART_WIDTH - PADDING_RIGHT}
                y2={goalY}
                stroke="#F6C247"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
              <SvgText
                x={CHART_WIDTH - PADDING_RIGHT + 8}
                y={goalY + 4}
                fontSize="12"
                fill="#F6B800"
                fontWeight="800"
              >
                Goal
              </SvgText>
            </>
          )}

          {/* area fill under line */}
          {chartLogs.length >= 2 && (
            <Path
              d={`${pathData} L ${getX(chartLogs.length - 1)} ${
                CHART_HEIGHT - PADDING_BOTTOM
              } L ${getX(0)} ${CHART_HEIGHT - PADDING_BOTTOM} Z`}
              fill="url(#weightArea)"
            />
          )}

          {/* line */}
          {chartLogs.length >= 2 && (
            <Path
              d={pathData}
              stroke="#F47B20"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* single point support */}
          {chartLogs.length === 1 && (
            <Line
              x1={PADDING_LEFT}
              y1={getY(chartLogs[0].weight)}
              x2={PADDING_LEFT + 52}
              y2={getY(chartLogs[0].weight)}
              stroke="#F47B20"
              strokeWidth={5}
              strokeLinecap="round"
            />
          )}

          {/* points */}
          {chartLogs.map((item, index) => {
            const x = getX(index);
            const y = getY(item.weight);

            return (
              <Circle
                key={item.id}
                cx={x}
                cy={y}
                r={6}
                fill="#FFFAF6"
                stroke="#F47B20"
                strokeWidth={4}
              />
            );
          })}

          {/* x-axis labels */}
          {chartLogs.length > 0 ? (
            chartLogs.map((item, index) => {
              const shouldShow =
                chartLogs.length <= 7 ||
                index === 0 ||
                index === chartLogs.length - 1;

              if (!shouldShow) return null;

              return (
                <SvgText
                  key={`x-${item.id}`}
                  x={getX(index)}
                  y={CHART_HEIGHT - 8}
                  fontSize="12"
                  fill="#7A8A98"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {getDayLabel(item.date)}
                </SvgText>
              );
            })
          ) : (
            <SvgText
              x={PADDING_LEFT}
              y={CHART_HEIGHT - 8}
              fontSize="12"
              fill="#7A8A98"
              fontWeight="700"
              textAnchor="middle"
            >
              Today
            </SvgText>
          )}

          {/* empty state text inside chart, but chart stays visible */}
          {chartLogs.length > 0 &&
            (() => {
              const last = chartLogs[chartLogs.length - 1];
              const x = getX(chartLogs.length - 1);
              const y = getY(last.weight);
              return (
                <>
                  <Rect
                    x={x - 28}
                    y={y - 36}
                    width={56}
                    height={24}
                    rx={8}
                    fill="#F47B20"
                  />
                  <SvgText
                    x={x}
                    y={y - 19}
                    fontSize="9"
                    fill="#FFFFFF"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {last.weight.toFixed(1)}
                  </SvgText>
                </>
              );
            })()}
        </Svg>
      </View>
    </View>
  );
};
