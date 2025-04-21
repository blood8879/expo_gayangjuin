import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type FormHeaderProps = {
  title: string;
  onSave: () => void;
  isSaving?: boolean;
};

export default function FormHeader({
  title,
  onSave,
  isSaving = false,
}: FormHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={() => router.back()} className="p-1">
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text className="text-lg font-bold text-gray-800">{title}</Text>

      <TouchableOpacity
        onPress={onSave}
        disabled={isSaving}
        className={`py-1.5 px-3 rounded-[12px] ${
          isSaving ? "bg-gray-400" : "bg-emerald-500"
        }`}
      >
        <Text className="text-white font-semibold">
          {isSaving ? "저장 중..." : "저장"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
