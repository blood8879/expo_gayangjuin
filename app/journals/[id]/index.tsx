import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Swipeable } from "react-native-gesture-handler";
import { theme } from "../../../constants/theme";
import {
  useJournal,
  useDeleteJournal,
  useUpdateJournal,
  useDeleteJournalRecord,
} from "../../../lib/query/journalQueries";
import { formatDetailDate, formatDate } from "../../../lib/utils/dateUtils";
import StageList from "../../../components/journal/StageList";
import StageItem from "../../../components/journal/StageItem";
import StageIndicator from "../../../components/journal/StageIndicator";
import RecipeStages from "../../../components/journal/RecipeStages";

// RecipeStage 타입 정의 추가
interface RecipeStage {
  id: string | number;
  stage_number: number;
  title?: string;
  description?: string;
  duration_days: number;
}

// 단계 상태를 나타내는 타입
type StageStatus = "current" | "completed" | "upcoming";

// 기록 데이터 타입 정의
interface JournalRecord {
  id: string | number;
  journal_id: string;
  title?: string;
  note?: string;
  temperature?: number;
  gravity?: number;
  stage?: number;
  created_at: string;
  updated_at?: string;
  entry_date?: string;
  journal_images?: Array<{ url: string; image_url: string }>;
}

export default function JournalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  // 양조일지 정보 가져오기
  const { data: journal, isLoading, isError } = useJournal(id as string);

  // 양조일지 삭제 훅
  const { mutate: deleteJournal, isPending: isDeleting } = useDeleteJournal();

  // 양조일지 업데이트 훅
  const { mutate: updateJournal, isPending: isUpdating } = useUpdateJournal();

  // 양조일지 기록 삭제 훅
  const { mutate: deleteRecord, isPending: isDeletingRecord } =
    useDeleteJournalRecord();

  // 상태 업데이트 함수 (팝업 메뉴에서 사용)
  const updateJournalStatus = (isCompleted: boolean) => {
    if (!id || journal?.is_completed === isCompleted) {
      Alert.alert(
        "알림",
        `이미 ${isCompleted ? "완료" : "진행중"} 상태입니다.`
      );
      return;
    }

    updateJournal(
      {
        id: id as string,
        journal: { is_completed: isCompleted },
      },
      {
        onSuccess: () => {
          Alert.alert(
            "성공",
            `상태가 ${isCompleted ? "완료" : "진행중"}으로 변경되었습니다.`
          );
        },
        onError: (error) => {
          Alert.alert("오류", "상태 변경에 실패했습니다.");
          console.error("상태 변경 오류:", error);
        },
      }
    );
  };

  // 단계 변경 처리 함수
  const handleStageChange = (stageNumber: number) => {
    if (journal?.current_stage === stageNumber) return;

    Alert.alert("단계 변경", `${stageNumber}단계로 변경하시겠습니까?`, [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "변경",
        onPress: () => {
          updateJournal(
            {
              id: id as string,
              journal: { current_stage: stageNumber },
            },
            {
              onSuccess: () => {
                Alert.alert("성공", `${stageNumber}단계로 변경되었습니다.`);
              },
              onError: (error) => {
                Alert.alert("오류", "단계 변경에 실패했습니다.");
                console.error("단계 변경 오류:", error);
              },
            }
          );
        },
      },
    ]);
  };

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

  // 기록 삭제 처리 함수
  const handleDeleteRecord = (recordId: string) => {
    Alert.alert("기록 삭제", "이 기록을 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
        onPress: () => {
          // 열린 Swipeable 닫기
          if (swipeableRefs.current[recordId]) {
            swipeableRefs.current[recordId]?.close();
          }
        },
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteRecord(
            { id: String(recordId), journalId: id as string },
            {
              onSuccess: () => {
                Alert.alert("성공", "기록이 삭제되었습니다.");
              },
              onError: (error) => {
                Alert.alert("오류", "기록 삭제에 실패했습니다.");
                console.error("기록 삭제 오류:", error);
              },
            }
          );
        },
      },
    ]);
  };

  // 기록 수정 화면으로 이동
  const handleEditRecord = (recordId: string) => {
    if (swipeableRefs.current[recordId]) {
      swipeableRefs.current[recordId]?.close();
    }
    router.push(`/journals/${id}/edit-record?recordId=${recordId}`);
  };

  // 스와이프 오른쪽에 표시할 삭제 버튼 렌더링 함수
  const renderRightActions = (recordId: string) => {
    const screenWidth = Dimensions.get("window").width;

    return (
      <View style={{ width: 160, flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#3498db",
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            height: "100%",
          }}
          onPress={() => handleEditRecord(String(recordId))}
        >
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>
            수정
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#e74c3c",
            justifyContent: "center",
            alignItems: "center",
            width: 80,
            height: "100%",
          }}
          onPress={() => handleDeleteRecord(String(recordId))}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>
            삭제
          </Text>
        </TouchableOpacity>
      </View>
    );
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
  const journalRecords = journal.journal_entries || [];

  // 현재 단계 (current_stage 기반)
  const currentStageNumber = journal.current_stage;

  // 단계 상태 확인 함수 (현재, 완료, 예정)
  const getStageStatus = (stageNumber: number): StageStatus => {
    if (!journal || !journal.current_stage) return "upcoming";

    const currentStage = journal.current_stage;

    if (stageNumber === currentStage) return "current";

    return stageNumber < currentStage ? "completed" : "upcoming";
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
        <Menu>
          <MenuTrigger customStyles={{ triggerWrapper: { padding: 5 } }}>
            {isUpdating ? (
              <ActivityIndicator size="small" color={theme.primary.DEFAULT} />
            ) : (
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            )}
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 8,
                marginTop: 30,
                width: 150,
              },
            }}
          >
            <MenuOption onSelect={() => updateJournalStatus(false)}>
              <Text style={{ padding: 10 }}>진행중으로 변경</Text>
            </MenuOption>
            <MenuOption onSelect={() => updateJournalStatus(true)}>
              <Text style={{ padding: 10 }}>완료로 변경</Text>
            </MenuOption>
            <View style={{ height: 1, backgroundColor: "#eee" }} />
            <MenuOption onSelect={handleDelete}>
              <Text style={{ padding: 10, color: "red" }}>삭제</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
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
          <View
            className={`px-3 py-1.5 rounded-full mr-2 ${
              journal.is_completed ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                journal.is_completed ? "text-green-600" : "text-blue-600"
              }`}
            >
              {journal.is_completed ? "완료" : "진행중"}
            </Text>
          </View>
        </View>

        {recipeStages.length > 0 && (
          <View className="bg-white border-b border-gray-200">
            {/* RecipeStages 컴포넌트 사용 */}
            <RecipeStages
              stages={recipeStages.map((stage: RecipeStage) => ({
                stage_number: stage.stage_number,
                title: stage.title,
                duration_days: stage.duration_days,
              }))}
              currentStage={journal.current_stage || 0}
              onStagePress={handleStageChange}
            />
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
                (a: JournalRecord, b: JournalRecord) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((record: JournalRecord) => {
                // 기록과 관련된 단계 정보
                const relatedStage = recipeStages.find(
                  (stage: RecipeStage) => stage.stage_number === record.stage
                );

                return (
                  <Swipeable
                    key={record.id}
                    ref={(ref) => {
                      swipeableRefs.current[String(record.id)] = ref;
                    }}
                    renderRightActions={() =>
                      renderRightActions(String(record.id))
                    }
                    overshootRight={false}
                    onSwipeableOpen={() => {
                      // 다른 열린 아이템 닫기 (한 번에 하나만 열기 위해)
                      Object.keys(swipeableRefs.current).forEach((key) => {
                        if (
                          key !== String(record.id) &&
                          swipeableRefs.current[key]
                        ) {
                          swipeableRefs.current[key]?.close();
                        }
                      });
                    }}
                  >
                    <View className="flex-1 flex-row border-b border-gray-100">
                      <View className="w-24 shrink-0 px-2 py-4 bg-white">
                        <Text className="text-sm font-bold text-gray-800">
                          {formatDate(record.created_at).slice(5)}{" "}
                          {/* 월-일만 표시 */}
                        </Text>
                        {record.stage && recipeStages.length > 0 && (
                          <>
                            <Text className="text-xs text-gray-500 my-1">
                              {record.stage}단계
                            </Text>
                            {relatedStage && (
                              <Text className="text-sm text-blue-600">
                                {relatedStage.title ||
                                  `단계 ${relatedStage.stage_number}`}
                              </Text>
                            )}
                          </>
                        )}
                      </View>

                      <View className="flex-1 bg-blue-50 border-l-2 border-blue-600">
                        <View className="px-4 py-4">
                          <Text className="text-xs text-gray-500 mb-2">
                            {formatDetailDate(record.created_at)}
                          </Text>

                          {record.title && (
                            <Text className="text-base font-bold text-gray-800 mb-3">
                              {record.title}
                            </Text>
                          )}

                          {(record.temperature || record.gravity) && (
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
                              {record.gravity && (
                                <View className="flex-1 items-center">
                                  <Ionicons
                                    name="water-outline"
                                    size={20}
                                    color="#4D79FF"
                                  />
                                  <Text className="text-xs text-gray-500 mt-1">
                                    비중
                                  </Text>
                                  <Text className="text-base font-semibold text-gray-800 mt-0.5">
                                    {record.gravity}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}

                          {record.note && (
                            <View className="mb-3">
                              <Text className="text-sm font-medium text-gray-700 mb-1">
                                내용
                              </Text>
                              <View className="bg-white p-3 rounded-lg">
                                <Text className="text-sm text-gray-800 leading-5">
                                  {record.note}
                                </Text>
                              </View>
                            </View>
                          )}

                          {(() => {
                            // 데이터 구조 확인 로그 추가
                            console.log(
                              `레코드 ID: ${record.id}, 이미지 데이터:`,
                              JSON.stringify(record.journal_images, null, 2)
                            );
                            if (
                              !record.journal_images ||
                              record.journal_images.length === 0
                            ) {
                              return null; // 이미지가 없으면 아무것도 렌더링하지 않음
                            }
                            return (
                              <View className="mb-3">
                                <Text className="text-sm font-medium text-gray-500 mb-1">
                                  사진
                                </Text>
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  className="flex-row"
                                >
                                  {record.journal_images.map((image, index) => {
                                    // 이미지 URL 확인 로그 추가
                                    console.log(
                                      `이미지 ${index} URL:`,
                                      image.image_url
                                    );
                                    return (
                                      <Image
                                        key={index}
                                        source={{ uri: image.image_url }}
                                        className="w-20 h-20 rounded-md mr-2"
                                        onError={(e) =>
                                          console.error(
                                            `이미지 로딩 오류 (URL: ${image.image_url}):`,
                                            e.nativeEvent.error
                                          )
                                        }
                                        onLoad={() =>
                                          console.log(
                                            `이미지 로딩 성공 (URL: ${image.image_url})`
                                          )
                                        }
                                      />
                                    );
                                  })}
                                </ScrollView>
                              </View>
                            );
                          })()}

                          <View className="flex-row items-center justify-end">
                            <Ionicons
                              name="time-outline"
                              size={16}
                              color="#888"
                            />
                            <Text className="text-xs text-gray-500 ml-1">
                              {new Date(record.created_at).toLocaleString()}{" "}
                              작성
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Swipeable>
                );
              })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
