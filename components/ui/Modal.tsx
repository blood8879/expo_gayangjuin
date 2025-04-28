import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Ionicons } from "@expo/vector-icons";
import * as ButtonModule from "./Button";

const { width, height } = Dimensions.get("window");

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  contentStyle?: object;
};

export const Modal = ({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  contentStyle,
}: ModalProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#1E293B" : "#FFFFFF";
  const shadowColor = isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)";

  return (
    <RNModal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor,
              ...Platform.select({
                ios: {
                  shadowColor: shadowColor,
                },
                android: {
                  elevation: 5,
                },
              }),
            },
            contentStyle,
          ]}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <ThemedText style={styles.title}>{title}</ThemedText>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? "#94A3B8" : "#64748B"}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </TouchableOpacity>
    </RNModal>
  );
};

type AlertModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
};

export const AlertModal = ({
  visible,
  onClose,
  title,
  message,
  buttonText = "확인",
}: AlertModalProps) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      <ThemedText style={styles.message}>{message}</ThemedText>
      <View style={styles.buttonContainer}>
        <ButtonModule.default size="sm" variant="primary" onPress={onClose}>
          {buttonText}
        </ButtonModule.default>
      </View>
    </Modal>
  );
};

type ConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

export const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  danger = false,
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      <ThemedText style={styles.message}>{message}</ThemedText>
      <View style={styles.buttonRow}>
        <ButtonModule.default
          size="sm"
          variant="secondary"
          onPress={onClose}
          style={styles.button}
        >
          {cancelText}
        </ButtonModule.default>
        <ButtonModule.default
          size="sm"
          variant={danger ? "primary" : "primary"}
          onPress={handleConfirm}
          style={styles.button}
        >
          {confirmText}
        </ButtonModule.default>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.85,
    maxHeight: height * 0.8,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 8,
  },
});
