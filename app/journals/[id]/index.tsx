import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useJournal, useDeleteJournal } from "@/lib/query/journalQueries";
import { formatDetailDate, formatDate } from "@/lib/utils/dateUtils";

// 단계 상태를 나타내는 타입
type StageStatus = "current" | "completed" | "upcoming";

export default function JournalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // 양조일지 정보 가져오기
  const { data: journal, isLoading, isError } = useJournal(id as string);

  // 양조일지 삭제 훅
  const { mutate: deleteJournal, isPending: isDeleting } = useDeleteJournal();

  // 삭제 처리 함수
  const handleDelete = () => {
    Alert.alert("양조일지 삭제", "이 양조일지를 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteJournal(id as string, {
            onSuccess: () => {
              Alert.alert("성공", "양조일지가 삭제되었습니다.");
              router.back();
            },
            onError: (error) => {
              Alert.alert("오류", "양조일지 삭제에 실패했습니다.");
              console.error("양조일지 삭제 오류:", error);
            },
          });
        },
      },
    ]);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
        <Text className="mt-4 text-neutral-500">양조일지를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 에러 상태 처리
  if (isError || !journal) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-neutral-600">
            양조일지를 불러오는데 실패했습니다.
          </Text>
          <TouchableOpacity
            className="mt-6 px-4 py-2 bg-primary-600 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">
              이전 화면으로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 레시피 단계 정보
  const recipeStages = journal.recipes?.recipe_stages || [];

  // 저널 기록
  const journalRecords = journal.journal_records || [];

  // 현재 단계 (stage_id 기반)
  const currentStageId = journal.stage_id;

  // 단계 상태 확인 함수 (현재, 완료, 예정)
  const getStageStatus = (stageId: string): StageStatus => {
    if (stageId === currentStageId) return "current";

    const currentStage = recipeStages.find((s) => s.id === currentStageId);
    const stage = recipeStages.find((s) => s.id === stageId);

    if (!currentStage || !stage) return "upcoming";

    return currentStage.stage_number > stage.stage_number
      ? "completed"
      : "upcoming";
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-medium text-gray-800">
          {journal.title}
        </Text>
        <TouchableOpacity
          className="p-1"
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 flex-col">
        <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
          <View className="flex-1">
            <Text className="text-base font-bold text-blue-600">
              {journal.recipes?.name || "레시피 없음"}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {journal.recipes?.type || "-"}
            </Text>
          </View>
          <View className="bg-blue-100 px-3 py-1.5 rounded-full mr-2">
            <Text className="text-blue-600 text-sm font-medium">
              {journal.is_completed ? "완료" : "진행중"}
            </Text>
          </View>
          <TouchableOpacity className="p-1">
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {recipeStages.length > 0 && (
          <View className="bg-white py-4 px-4 border-b border-gray-200">
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800">
                레시피 단계
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                현재 진행 중인 단계를 확인할 수 있습니다
              </Text>
            </View>

            {recipeStages
              .sort((a, b) => a.stage_number - b.stage_number)
              .map((stage) => {
                const status = getStageStatus(stage.id as string);
                return (
                  <View key={stage.id} className="flex-row items-center mb-4">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        status === "current"
                          ? "bg-blue-600"
                          : status === "completed"
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-base font-bold ${
                          status === "upcoming" ? "text-gray-600" : "text-white"
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
                        {stage.duration_days > 0
                          ? `${stage.duration_days}일`
                          : "기간 미설정"}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center px-4 mb-3 pt-4">
            <Text className="text-base font-semibold text-gray-800">
              양조 기록
            </Text>
            <TouchableOpacity
              className="flex-row bg-orange-400 py-2 px-3 rounded-full items-center"
              onPress={() => router.push(`/journals/${id}/add-record`)}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text className="text-white text-sm font-medium ml-1">
                기록 추가
              </Text>
            </TouchableOpacity>
          </View>

          <View className="w-full h-px bg-gray-200" />

          {journalRecords.length === 0 ? (
            <View className="py-12 items-center">
              <Ionicons
                name="document-text-outline"
                size={48}
                color={theme.neutral[300]}
              />
              <Text className="mt-4 text-base text-neutral-500">
                아직 기록이 없습니다
              </Text>
              <Text className="mt-1 text-sm text-neutral-400 text-center max-w-[250px]">
                양조 과정을 기록해보세요!
              </Text>
            </View>
          ) : (
            journalRecords
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((record) => {
                // 기록과 관련된 단계 정보
                const relatedStage = recipeStages.find(
                  (stage) => stage.id === record.stage_id
                );

                return (
                  <View
                    key={record.id}
                    className="flex-1 flex-row border-b border-gray-100"
                  >
                    <View className="w-24 shrink-0 px-2 py-4 bg-white">
                      <Text className="text-sm font-bold text-gray-800">
                        {formatDate(record.created_at).slice(5)}{" "}
                        {/* 월-일만 표시 */}
                      </Text>
                      {relatedStage && (
                        <>
                          <Text className="text-xs text-gray-500 my-1">
                            {relatedStage.stage_number}단계
                          </Text>
                          <Text className="text-sm text-blue-600">
                            {relatedStage.title ||
                              `단계 ${relatedStage.stage_number}`}
                          </Text>
                        </>
                      )}
                    </View>

                    <View className="flex-1 bg-blue-50 border-l-2 border-blue-600">
                      <View className="px-4 py-4">
                        <Text className="text-xs text-gray-500 mb-1">
                          {formatDetailDate(record.created_at)}
                        </Text>
                        <Text className="text-base font-bold text-gray-800 mb-3">
                          {record.title}
                        </Text>

                        {(record.temperature || record.humidity) && (
                          <View className="flex-row bg-white rounded-lg p-3 mb-3">
                            {record.temperature && (
                              <View className="flex-1 items-center">
                                <Ionicons
                                  name="thermometer-outline"
                                  size={20}
                                  color="#4D79FF"
                                />
                                <Text className="text-xs text-gray-500 mt-1">
                                  온도
                                </Text>
                                <Text className="text-base font-semibold text-gray-800 mt-0.5">
                                  {record.temperature}°C
                                </Text>
                              </View>
                            )}
                            {record.humidity && (
                              <View className="flex-1 items-center">
                                <Ionicons
                                  name="water-outline"
                                  size={20}
                                  color="#4D79FF"
                                />
                                <Text className="text-xs text-gray-500 mt-1">
                                  습도
                                </Text>
                                <Text className="text-base font-semibold text-gray-800 mt-0.5">
                                  {record.humidity}%
                                </Text>
                              </View>
                            )}
                          </View>
                        )}

                        {record.description && (
                          <View className="mb-3">
                            <Text className="text-sm font-medium text-gray-500 mb-1">
                              내용
                            </Text>
                            <Text className="text-sm text-gray-800 leading-5">
                              {record.description}
                            </Text>
                          </View>
                        )}

                        {record.journal_images &&
                          record.journal_images.length > 0 && (
                            <View className="mb-3">
                              <Text className="text-sm font-medium text-gray-500 mb-1">
                                사진
                              </Text>
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="flex-row"
                              >
                                {record.journal_images.map((image, index) => (
                                  <Image
                                    key={index}
                                    source={{ uri: image.image_url }}
                                    className="w-20 h-20 rounded-md mr-2"
                                  />
                                ))}
                              </ScrollView>
                            </View>
                          )}

                        <View className="flex-row items-center justify-end">
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color="#888"
                          />
                          <Text className="text-xs text-gray-500 ml-1">
                            {new Date(record.created_at).toLocaleString()} 작성
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
