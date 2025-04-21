import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  rounded?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  rounded = false,
  style,
  textStyle,
  children,
  ...props
}: ButtonProps) => {
  // 버튼 스타일 계산
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    rounded && styles.button_rounded,
    disabled && styles.button_disabled,
    style,
  ];

  // 텍스트 스타일 계산
  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  // 아이콘 사이즈 계산
  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 16;
      case "lg":
        return 24;
      default:
        return 20;
    }
  };

  // 렌더링
  return (
    <TouchableOpacity
      className={`
        ${variant === "primary" ? "bg-primary" : ""}
        ${variant === "secondary" ? "bg-secondary" : ""}
        ${variant === "outline" ? "border border-primary bg-transparent" : ""}
        ${variant === "ghost" ? "bg-transparent" : ""}
        ${size === "sm" ? "px-3 py-1.5" : ""}
        ${size === "md" ? "px-4 py-2" : ""}
        ${size === "lg" ? "px-6 py-3" : ""}
        ${rounded ? "rounded-full" : "rounded-lg"}
        ${disabled ? "opacity-50" : ""}
        flex-row items-center justify-center
      `}
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "secondary"
              ? "#fff"
              : theme.primary.DEFAULT
          }
          className="mr-2"
        />
      ) : icon && iconPosition === "left" ? (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={
            variant === "primary" || variant === "secondary"
              ? "#fff"
              : theme.primary.DEFAULT
          }
          style={{ marginRight: 8 }}
        />
      ) : null}

      <Text
        className={`
          font-medium text-center
          ${
            variant === "primary" || variant === "secondary"
              ? "text-white"
              : "text-primary"
          }
          ${size === "sm" ? "text-xs" : ""}
          ${size === "md" ? "text-sm" : ""}
          ${size === "lg" ? "text-base" : ""}
        `}
        style={textStyles}
      >
        {children}
      </Text>

      {icon && iconPosition === "right" && !loading ? (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={
            variant === "primary" || variant === "secondary"
              ? "#fff"
              : theme.primary.DEFAULT
          }
          style={{ marginLeft: 8 }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button_primary: {
    backgroundColor: theme.primary.DEFAULT,
  },
  button_secondary: {
    backgroundColor: theme.secondary.DEFAULT,
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.primary.DEFAULT,
  },
  button_ghost: {
    backgroundColor: "transparent",
  },
  button_sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  button_md: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  button_lg: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  button_rounded: {
    borderRadius: 9999,
  },
  button_disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "500",
    textAlign: "center",
  },
  text_primary: {
    color: "#fff",
  },
  text_secondary: {
    color: "#fff",
  },
  text_outline: {
    color: theme.primary.DEFAULT,
  },
  text_ghost: {
    color: theme.primary.DEFAULT,
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
  text_disabled: {
    opacity: 0.7,
  },
});

export default Button;
