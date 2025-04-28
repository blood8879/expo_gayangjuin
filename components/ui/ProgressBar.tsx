import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

export type ProgressBarColorScheme =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | string;

type ProgressBarProps = {
  value: number; // 0 ~ 100 사이의 값
  height?: number;
  colorScheme?: ProgressBarColorScheme;
  showLabel?: boolean;
  labelPosition?: "inside" | "outside";
  format?: (value: number) => string;
  animated?: boolean;
  duration?: number;
  style?: ViewStyle;
  barStyle?: ViewStyle;
  labelStyle?: TextStyle;
};

export const ProgressBar = ({
  value: rawValue,
  height = 12,
  colorScheme = "primary",
  showLabel = false,
  labelPosition = "outside",
  format = (value) => `${value.toFixed(0)}%`,
  animated = true,
  duration = 500,
  style,
  barStyle,
  labelStyle,
}: ProgressBarProps) => {
  // 값을 0-100 범위로 제한
  const value = Math.max(0, Math.min(100, rawValue));

  const colorScheme2 = useColorScheme();
  const isDark = colorScheme2 === "dark";

  // 애니메이션 값
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: value,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(value);
    }
  }, [animated, animatedValue, value, duration]);

  // 색상 계산
  const getBarColor = () => {
    // 기본 색상 매핑
    const colorMap: Record<ProgressBarColorScheme, string> = {
      primary: "#0EA5E9", // sky-500
      secondary: "#A855F7", // purple-500
      success: "#22C55E", // green-500
      danger: "#EF4444", // red-500
      warning: "#F59E0B", // amber-500
      info: "#0EA5E9", // sky-500 (primary와 동일)
    };

    // 다크 모드 색상 매핑
    const darkColorMap: Record<ProgressBarColorScheme, string> = {
      primary: "#38BDF8", // sky-400
      secondary: "#D8B4FE", // purple-300
      success: "#4ADE80", // green-400
      danger: "#FCA5A5", // red-300
      warning: "#FBBF24", // amber-400
      info: "#38BDF8", // sky-400
    };

    // 이미 hex 색상이 주어진 경우 그대로 사용
    if (colorScheme.startsWith("#")) {
      return colorScheme;
    }

    return (
      (isDark
        ? darkColorMap[colorScheme as keyof typeof darkColorMap]
        : colorMap[colorScheme as keyof typeof colorMap]) || colorMap.primary
    );
  };

  // 배경색 계산
  const getBackgroundColor = () => {
    return isDark ? "#1e293b" : "#e2e8f0"; // slate-800 : slate-200
  };

  // 애니메이션 width 계산
  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, style]}>
      {showLabel && labelPosition === "outside" && (
        <Text style={[styles.label, labelStyle]}>{format(value)}</Text>
      )}

      <View
        style={[
          styles.progressBackground,
          {
            height,
            backgroundColor: getBackgroundColor(),
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              width,
              height,
              backgroundColor: getBarColor(),
              borderRadius: height / 2,
            },
            barStyle,
          ]}
        >
          {showLabel && labelPosition === "inside" && value >= 20 && (
            <Text style={[styles.insideLabel, labelStyle]}>
              {format(value)}
            </Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  progressBackground: {
    width: "100%",
    overflow: "hidden",
  },
  progressBar: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  insideLabel: {
    fontSize: 10,
    color: "white",
    paddingHorizontal: 8,
    fontWeight: "500",
  },
});
