import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";
export type BadgeSize = "small" | "medium";

const COLORS = {
  light: {
    default: { bg: "#E2E8F0", text: "#475569" },
    primary: { bg: "#E0F2FE", text: "#0EA5E9" },
    secondary: { bg: "#F3E8FF", text: "#A855F7" },
    success: { bg: "#DCFCE7", text: "#22C55E" },
    danger: { bg: "#FEE2E2", text: "#EF4444" },
    warning: { bg: "#FEF3C7", text: "#F59E0B" },
    info: { bg: "#E0F2FE", text: "#0EA5E9" },
    // 주종별 색상
    makgeolli: { bg: "#F7F7F0", text: "#8B7E66" }, // 쌀색
    beer: { bg: "#FEF9C3", text: "#CA8A04" }, // 황금색
    wine: { bg: "#FAE8FF", text: "#A21CAF" }, // 자주색
  },
  dark: {
    default: { bg: "#334155", text: "#E2E8F0" },
    primary: { bg: "#0C4A6E", text: "#38BDF8" },
    secondary: { bg: "#581C87", text: "#D8B4FE" },
    success: { bg: "#14532D", text: "#4ADE80" },
    danger: { bg: "#7F1D1D", text: "#FCA5A5" },
    warning: { bg: "#78350F", text: "#FCD34D" },
    info: { bg: "#0C4A6E", text: "#38BDF8" },
    // 주종별 색상
    makgeolli: { bg: "#44403C", text: "#E7E5E4" }, // 쌀색 다크모드
    beer: { bg: "#713F12", text: "#FEF08A" }, // 황금색 다크모드
    wine: { bg: "#701A75", text: "#F5D0FE" }, // 자주색 다크모드
  },
};

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant | "makgeolli" | "beer" | "wine";
  size?: BadgeSize;
  icon?: keyof typeof Ionicons.glyphMap;
};

export const Badge = ({
  label,
  variant = "default",
  size = "small",
  icon,
}: BadgeProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // @ts-ignore - 주종별 색상 타입 확장
  const colors =
    COLORS[isDark ? "dark" : "light"][variant] ||
    COLORS[isDark ? "dark" : "light"].default;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg },
        size === "small" ? styles.smallBadge : styles.mediumBadge,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={size === "small" ? 12 : 16}
          color={colors.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === "small" ? styles.smallText : styles.mediumText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  smallBadge: {
    height: 20,
    paddingHorizontal: 6,
  },
  mediumBadge: {
    height: 24,
    paddingHorizontal: 8,
  },
  text: {
    fontWeight: "500",
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  icon: {
    marginRight: 4,
  },
});
