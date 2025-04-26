import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type StageStatus = "current" | "completed" | "upcoming";

interface Stage {
  id: string;
  stage_number: number;
  title?: string;
  duration_days?: number;
}

interface StageIndicatorProps {
  stages: Stage[];
  currentStageId: string;
  onStagePress?: (stageId: string) => void;
  showDescription?: boolean;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  stages,
  currentStageId,
  onStagePress,
  showDescription = true,
}) => {
  // 단계 상태 확인 함수 (현재, 완료, 예정)
  const getStageStatus = (stageId: string): StageStatus => {
    if (stageId === currentStageId) return "current";

    const currentStage = stages.find((s) => s.id === currentStageId);
    const stage = stages.find((s) => s.id === stageId);

    if (!currentStage || !stage) return "upcoming";

    return currentStage.stage_number > stage.stage_number
      ? "completed"
      : "upcoming";
  };

  return (
    <View className="bg-white py-4 px-4">
      {showDescription && (
        <View className="mb-4">
          <Text className="text-base font-semibold text-gray-800">
            레시피 단계
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            현재 진행 중인 단계를 확인할 수 있습니다
          </Text>
        </View>
      )}

      {stages
        .sort((a, b) => a.stage_number - b.stage_number)
        .map((stage) => {
          const status = getStageStatus(stage.id);
          return (
            <TouchableOpacity
              key={stage.id}
              className="flex-row items-center mb-4"
              onPress={() => onStagePress && onStagePress(stage.id)}
              disabled={!onStagePress}
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  status === "current"
                    ? "bg-blue-600"
                    : status === "completed"
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              >
                {status === "completed" ? (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                ) : (
                  <Text
                    className={`text-base font-bold ${
                      status === "upcoming" ? "text-gray-600" : "text-white"
                    }`}
                  >
                    {stage.stage_number}
                  </Text>
                )}
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-gray-800">
                  {stage.title || `단계 ${stage.stage_number}`}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {stage.duration_days
                    ? `${stage.duration_days}일`
                    : "기간 미설정"}
                </Text>
              </View>
              {status === "current" && (
                <View className="ml-2 px-2 py-1 bg-blue-100 rounded-full">
                  <Text className="text-xs text-blue-600 font-medium">
                    진행중
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default StageIndicator;
