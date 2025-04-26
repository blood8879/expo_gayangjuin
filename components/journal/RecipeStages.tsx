import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Stage {
  stage_number: number;
  title?: string;
  duration_days?: number;
}

interface RecipeStagesProps {
  stages: Stage[];
  currentStage: number;
  onStagePress?: (stageNumber: number) => void;
}

const RecipeStages: React.FC<RecipeStagesProps> = ({
  stages,
  currentStage,
  onStagePress,
}) => {
  // 정렬된 단계 얻기
  const sortedStages = [...stages].sort(
    (a, b) => a.stage_number - b.stage_number
  );

  return (
    <View className="bg-white">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-bold text-gray-800">레시피 단계</Text>
        <Text className="text-sm text-gray-500 mt-1">
          현재 진행 중인 단계를 확인할 수 있습니다
        </Text>
      </View>

      {sortedStages.map((stage) => (
        <TouchableOpacity
          key={stage.stage_number}
          className="flex-row items-center px-4 py-3"
          onPress={() => onStagePress && onStagePress(stage.stage_number)}
          disabled={!onStagePress}
        >
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              stage.stage_number === currentStage
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-base font-bold ${
                stage.stage_number === currentStage
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              {stage.stage_number}
            </Text>
          </View>
          <View className="ml-3">
            <Text className="text-sm font-medium text-gray-800">
              {stage.title || `단계 ${stage.stage_number}`}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              {stage.duration_days || 0}일
            </Text>
          </View>
          {stage.stage_number === currentStage && (
            <View className="ml-auto px-3 py-1.5 bg-blue-100 rounded-full">
              <Text className="text-xs text-blue-600 font-medium">진행중</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RecipeStages;
