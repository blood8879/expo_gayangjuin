import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  prefix?: string;
  suffix?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  helperTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
}

const Input = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  onRightIconPress,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  secureTextEntry,
  ...props
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(!secureTextEntry);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={containerStyle} className="mb-4">
      {label && (
        <Text
          style={labelStyle}
          className="text-neutral-800 dark:text-neutral-200 text-sm font-medium mb-1"
        >
          {label}
        </Text>
      )}

      <View
        style={inputContainerStyle}
        className={`
          flex-row items-center
          border rounded-xl px-3 py-2 h-[48px]
          ${
            error
              ? "border-error"
              : "border-neutral-300 dark:border-neutral-600"
          }
          bg-white dark:bg-neutral-800
        `}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={theme.neutral[400]}
            className="mr-2"
          />
        )}

        {prefix && <Text className="text-neutral-500 mr-1">{prefix}</Text>}

        <TextInput
          {...props}
          secureTextEntry={isPassword ? !passwordVisible : false}
          style={inputStyle}
          className="flex-1 text-neutral-900 dark:text-white text-base py-0"
          placeholderTextColor={theme.neutral[400]}
        />

        {suffix && <Text className="text-neutral-500 ml-1">{suffix}</Text>}

        {isPassword && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            className="ml-2 p-1"
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={theme.neutral[400]}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="ml-2 p-1"
            disabled={!onRightIconPress}
          >
            <Ionicons name={rightIcon} size={18} color={theme.neutral[400]} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={errorTextStyle} className="text-error text-xs mt-1">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={helperTextStyle} className="text-neutral-500 text-xs mt-1">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

export default Input;
