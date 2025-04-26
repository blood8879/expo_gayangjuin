import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface StageItemProps {
  stage: number;
  title?: string;
  days?: number;
  isCurrentStage?: boolean;
  onPress?: () => void;
}

export const StageItem: React.FC<StageItemProps> = ({
  stage,
  title,
  days,
  isCurrentStage = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center py-3 px-4 border-b border-gray-200"
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          isCurrentStage ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <Text
          className={`text-base font-bold ${
            isCurrentStage ? "text-white" : "text-gray-600"
          }`}
        >
          {stage}
        </Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-medium text-gray-800">
          {title || `단계 ${stage}`}
        </Text>
        {days !== undefined && (
          <Text className="text-xs text-gray-500 mt-0.5">{days}일</Text>
        )}
      </View>
      {isCurrentStage && (
        <View className="px-3 py-1 bg-blue-100 rounded-full">
          <Text className="text-xs text-blue-600 font-medium">진행중</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default StageItem;
