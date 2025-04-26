import React from "react";
import { View, Text } from "react-native";
import StageItem from "./StageItem";

interface Stage {
  id: string;
  stage_number: number;
  title?: string;
  duration_days?: number;
}

interface StageListProps {
  stages: Stage[];
  currentStageId: string;
  onStagePress?: (stageId: string) => void;
  description?: string;
}

export const StageList: React.FC<StageListProps> = ({
  stages,
  currentStageId,
  onStagePress,
  description = "현재 진행 중인 단계를 확인할 수 있습니다",
}) => {
  // 정렬된 단계 얻기
  const sortedStages = [...stages].sort(
    (a, b) => a.stage_number - b.stage_number
  );

  return (
    <View className="bg-white">
      <View className="px-4 pt-4 mb-2">
        <Text className="text-base font-semibold text-gray-800">
          레시피 단계
        </Text>
        {description && (
          <Text className="text-xs text-gray-500 mt-1">{description}</Text>
        )}
      </View>

      {sortedStages.map((stage) => (
        <StageItem
          key={stage.id}
          stage={stage.stage_number}
          title={stage.title}
          days={stage.duration_days}
          isCurrentStage={stage.id === currentStageId}
          onPress={() => onStagePress && onStagePress(stage.id)}
        />
      ))}
    </View>
  );
};

export default StageList;
