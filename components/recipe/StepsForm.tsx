import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type StepsFormProps = {
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
};

type Step = {
  id: string;
  description: string;
  days: string;
};

export default function StepsForm({ steps, setSteps }: StepsFormProps) {
  // 스타일 클래스
  const multilineInputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base min-h-[80px] rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base min-h-[80px]";

  const smallInputClass =
    Platform.OS === "android"
      ? "w-16 border border-gray-200 p-1.5 bg-white text-center mr-1 rounded-[8px]"
      : "w-16 border border-gray-300 rounded-[8px] p-1.5 bg-white text-center mr-1";

  // 단계 추가 함수
  const addStep = () => {
    const newId = String(steps.length + 1);
    setSteps([...steps, { id: newId, description: "", days: "" }]);
  };

  // 단계 삭제 함수
  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  // 단계 정보 업데이트 함수
  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  return (
    <View className="mb-4 bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">양조 단계</Text>

      {steps.map((step, index) => (
        <View
          key={step.id}
          className="mb-4 p-3 border border-gray-200 rounded-[8px] bg-white"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-bold text-emerald-600">
              단계 {index + 1}
            </Text>
            <TouchableOpacity
              className="p-1"
              onPress={() => removeStep(step.id)}
              disabled={steps.length === 1}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={steps.length === 1 ? "#ccc" : "#ff6b6b"}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            className={
              multilineInputClass.replace("bg-gray-50", "bg-white") + " mb-2"
            }
            value={step.description}
            onChangeText={(value) => updateStep(step.id, "description", value)}
            placeholder="단계에 대한 설명을 입력하세요"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View className="flex-row items-center mt-2">
            <Text className="text-sm text-gray-600 mr-2">소요 일수</Text>
            <TextInput
              className={smallInputClass}
              value={step.days}
              onChangeText={(value) => updateStep(step.id, "days", value)}
              placeholder="일수"
              keyboardType="numeric"
            />
            <Text className="text-sm text-gray-600">일</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        className="flex-row items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg mt-2"
        onPress={addStep}
      >
        <Ionicons name="add-circle" size={20} color="#10b981" />
        <Text className="ml-2 text-emerald-600 font-medium">단계 추가</Text>
      </TouchableOpacity>
    </View>
  );
}
