import React from "react";
import {
  View,
  StyleSheet,
  ViewProps,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { theme } from "../../constants/theme";

export interface CardProps extends ViewProps {
  style?: ViewStyle;
  elevation?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  noPadding?: boolean;
  children: React.ReactNode;
}

export interface CardPressableProps extends TouchableOpacityProps {
  style?: ViewStyle;
  elevation?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  noPadding?: boolean;
  children: React.ReactNode;
}

export const Card = ({
  style,
  elevation = "md",
  rounded = "lg",
  noPadding = false,
  children,
  ...props
}: CardProps) => {
  return (
    <View
      className={`
        bg-white dark:bg-neutral-800
        ${!noPadding ? "p-4" : ""}
        ${rounded === "sm" ? "rounded-sm" : ""}
        ${rounded === "md" ? "rounded-md" : ""}
        ${rounded === "lg" ? "rounded-lg" : ""}
        ${rounded === "xl" ? "rounded-xl" : ""}
        ${rounded === "2xl" ? "rounded-2xl" : ""}
      `}
      style={[elevation !== "none" && theme.shadow[elevation], style]}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardPressable = ({
  style,
  elevation = "none",
  rounded = "lg",
  noPadding = false,
  children,
  ...props
}: CardPressableProps) => {
  return (
    <TouchableOpacity
      className={`
        bg-white dark:bg-neutral-800
        ${!noPadding ? "p-4" : ""}
        ${rounded === "sm" ? "rounded-sm" : ""}
        ${rounded === "md" ? "rounded-md" : ""}
        ${rounded === "lg" ? "rounded-lg" : ""}
        ${rounded === "xl" ? "rounded-xl" : ""}
        ${rounded === "2xl" ? "rounded-2xl" : ""}
      `}
      style={[elevation !== "none" && theme.shadow[elevation], style]}
      activeOpacity={0.7}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

export const CardHeader = ({ style, children, ...props }: ViewProps) => (
  <View className="mb-3" style={style} {...props}>
    {children}
  </View>
);

export const CardContent = ({ style, children, ...props }: ViewProps) => (
  <View style={style} {...props}>
    {children}
  </View>
);

export const CardFooter = ({ style, children, ...props }: ViewProps) => (
  <View
    className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700"
    style={style}
    {...props}
  >
    {children}
  </View>
);
