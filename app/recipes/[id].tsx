import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";

import { theme } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { useRecipe, useDeleteRecipe } from "@/lib/query/recipeQueries";
import { useJournals } from "@/lib/query/journalQueries";

// 타입 정의 추가
interface Ingredient {
  id: string | number;
  name: string;
  amount: number | string;
  unit: string;
}

interface Step {
  id: string | number;
  order: number;
  title: string;
  description: string;
  days: number;
  isDone: boolean;
}

interface RecipeDetail {
  id: string | number;
  title: string;
  type: string;
  days: number;
  totalDays: number;
  progress: number;
  description: string;
  createdAt: string;
  image: string | null;
  estimatedAlcohol: number;
  isPublic: boolean;
  ingredients: Ingredient[];
  steps: Step[];
}

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // React Query 사용
  const { data: recipe, isLoading, isError, error } = useRecipe(id as string);
  const deleteRecipeMutation = useDeleteRecipe();

  // 모든 양조일지 목록 조회
  const { data: allJournals } = useJournals();

  // 이 레시피를 사용하는 양조일지만 필터링
  const journals = allJournals?.filter((journal) => journal.recipe_id === id);

  // 현재 진행 중인 양조일지와 해당 단계 찾기
  const activeJournal = journals?.find((journal) => !journal.is_completed);
  const currentStage = activeJournal?.current_stage;

  // 로딩 화면
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
        <Text className="mt-4 text-neutral-500">레시피를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 에러 화면
  if (isError || !recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-5 pt-12 pb-2">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={theme.neutral[600]} />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center px-5">
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color={theme.neutral[400]}
          />
          <Text className="mt-4 text-neutral-600 text-center">
            {error?.message || "레시피를 찾을 수 없습니다"}
          </Text>
          <TouchableOpacity
            className="mt-6 py-2 px-4 bg-primary-500 rounded-full"
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

  // DB 데이터를 UI에 맞게 변환
  const recipeData = {
    id: recipe.id,
    title: recipe.name, // DB의 name 필드를 title로 표시
    type: recipe.type,
    days: recipe.total_duration_days || 0,
    totalDays: recipe.recipe_stages.reduce(
      (acc: number, stage: any) => acc + (stage.duration_days || 0),
      0
    ), // 각 단계의 duration_days를 합산
    progress: 0, // 진행 상태는 아직 구현되지 않음
    description: recipe.description,
    createdAt: recipe.created_at,
    image: recipe.cover_image_url,
    estimatedAlcohol: recipe.estimated_abv || 0,
    isPublic: recipe.is_public,
    ingredients: recipe.recipe_ingredients.map((ing: any) => ({
      id: ing.id,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    })),
    steps: recipe.recipe_stages
      .sort((a: any, b: any) => a.stage_number - b.stage_number)
      .map((stage: any) => ({
        id: stage.id,
        order: stage.stage_number,
        title: stage.title || `단계 ${stage.stage_number}`,
        description: stage.description,
        days: stage.duration_days,
        isDone: false,
      })),
  };

  const handleMoreOptionsPress = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEditRecipe = () => {
    setIsMenuVisible(false);
    router.push(`/recipes/edit/${recipeData.id}`);
  };

  const handleDeleteRecipe = () => {
    setIsMenuVisible(false);
    Alert.alert(
      "레시피 삭제",
      "정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          onPress: async () => {
            try {
              await deleteRecipeMutation.mutateAsync(recipeData.id as string);
              Alert.alert("성공", "레시피가 성공적으로 삭제되었습니다.");
              router.back();
            } catch (e) {
              console.error("레시피 삭제 실패:", e);
              Alert.alert("오류", "레시피 삭제 중 오류가 발생했습니다.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 헤더 */}
      <View className="px-5 pt-12 pb-2 flex-row justify-between items-center">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-white"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.neutral[600]} />
        </TouchableOpacity>
        <View className="flex-row">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white mr-3">
            <Ionicons
              name="share-outline"
              size={22}
              color={theme.neutral[600]}
            />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white mr-3">
            <Ionicons
              name="bookmark-outline"
              size={22}
              color={theme.neutral[600]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white"
            onPress={handleMoreOptionsPress}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={theme.neutral[600]}
            />
          </TouchableOpacity>
        </View>

        {/* 더보기 메뉴 */}
        {isMenuVisible && (
          <View className="absolute top-24 right-5 bg-white rounded-md shadow-lg p-2 z-50 w-40">
            <TouchableOpacity
              className="py-2 px-3 flex-row items-center"
              onPress={handleEditRecipe}
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color={theme.neutral[700]}
                className="mr-2"
              />
              <Text className="text-neutral-700">레시피 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-2 px-3 flex-row items-center"
              onPress={handleDeleteRecipe}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.status.error}
                className="mr-2"
              />
              <Text style={{ color: theme.status.error }}>레시피 삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 레시피 대표 정보 */}
        <View className="px-5 py-4">
          <Card
            elevation="none"
            style={{ borderRadius: 30 }}
            className="overflow-hidden"
          >
            <LinearGradient
              colors={["#e7f7ee", "#56bb7f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute w-full h-full opacity-90"
              style={{ width: "200%", height: "200%" }}
            />
            <View className="p-5">
              <View className="bg-white/30 px-3 py-1.5 rounded-full self-start mb-3">
                <Text className="text-xs font-semibold text-emerald-700">
                  {recipeData.type}
                </Text>
              </View>

              <Text className="text-neutral-800 text-2xl font-bold mb-2">
                {recipeData.title}
              </Text>

              <Text className="text-neutral-700 text-base mb-5">
                {recipeData.description}
              </Text>

              <View className="flex-row justify-between">
                <View className="flex-row items-center bg-white/30 px-3 py-1.5 rounded-full">
                  <Ionicons name="time-outline" size={16} color="#1f6b46" />
                  <Text className="text-emerald-800 ml-1 text-xs font-medium">
                    예상 소요일: {recipeData.totalDays || 0}일
                  </Text>
                </View>
                {/* <View className="flex-row items-center bg-white/30 px-3 py-1.5 rounded-full">
                  <Ionicons name="wine-outline" size={16} color="#1f6b46" />
                  <Text className="text-emerald-800 ml-1 text-xs font-medium">
                    예상 도수: {recipeData.estimatedAlcohol || 0}%
                  </Text>
                </View> */}
              </View>
            </View>
          </Card>
        </View>

        {/* 재료 섹션 */}
        <View className="px-5 mb-6 py-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-neutral-800">재료</Text>
          </View>

          <Card elevation="none" className="p-4 bg-white rounded-[8px]">
            {recipeData.ingredients && recipeData.ingredients.length > 0 ? (
              recipeData.ingredients.map(
                (ingredient: Ingredient, index: number) => (
                  <View
                    key={ingredient.id}
                    className={`flex-row justify-between py-3 ${
                      index < recipeData.ingredients.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <Text className="text-neutral-800 font-medium">
                      {ingredient.name}
                    </Text>
                    <Text className="text-neutral-500">
                      {ingredient.amount} {ingredient.unit}
                    </Text>
                  </View>
                )
              )
            ) : (
              <Text className="text-neutral-500 py-3 text-center">
                등록된 재료가 없습니다
              </Text>
            )}
          </Card>
        </View>

        {/* 단계 섹션 */}
        <View className="px-5 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-neutral-800">
              양조 단계
            </Text>
            <View className="flex-row items-center bg-emerald-100 px-3 py-1.5 rounded-full">
              <Text className="text-xs font-medium text-emerald-700">
                {`총 ${recipeData.steps.length}단계 양조법`}
              </Text>
            </View>
          </View>

          {recipeData.steps && recipeData.steps.length > 0 ? (
            <View className="relative">
              {/* 단계 진행 라인 */}
              <View className="absolute left-[22px] top-10 bottom-4 w-1 bg-gray-200" />

              {recipeData.steps.map((step: Step, index: number) => (
                <Card
                  key={step.id}
                  elevation="none"
                  className="mb-4 overflow-hidden bg-white rounded-[8px] border-l-4"
                  style={{
                    borderLeftColor:
                      step.order === 1
                        ? "#22c55e" // 첫 번째 단계는 초록색
                        : step.order === 2
                        ? "#3b82f6" // 두 번째 단계는 파란색
                        : "#9ca3af", // 그 외는 회색
                  }}
                >
                  <View className="p-4">
                    <View className="flex-row items-center mb-2">
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                          step.order === 1
                            ? "bg-emerald-100 border-2 border-emerald-500"
                            : step.order === 2
                            ? "bg-blue-100 border-2 border-blue-500"
                            : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={`text-sm font-bold ${
                            step.order === 1
                              ? "text-emerald-700"
                              : step.order === 2
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {step.order}
                        </Text>
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-base font-semibold text-neutral-800">
                          {step.title}
                        </Text>
                        {/* 현재 진행중인 단계 표시 - 실제 current_stage 값과 비교 */}
                        {activeJournal &&
                          currentStage &&
                          step.id.toString() === currentStage.toString() && (
                            <View className="flex-row items-center mt-1">
                              <View
                                className={`w-2 h-2 rounded-full ${
                                  step.order === 1
                                    ? "bg-emerald-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              <Text
                                className={`text-xs ml-1 ${
                                  step.order === 1
                                    ? "text-emerald-700"
                                    : "text-blue-700"
                                }`}
                              >
                                {`${step.order}단계 진행중`}
                              </Text>
                            </View>
                          )}
                      </View>
                      {/* 기간 배지 */}
                      {step.days > 0 && (
                        <View
                          className={`px-2 py-1 rounded-full ${
                            step.order === 1
                              ? "bg-emerald-50"
                              : step.order === 2
                              ? "bg-blue-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              step.order === 1
                                ? "text-emerald-600"
                                : step.order === 2
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {step.days}일
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text className="text-neutral-600 ml-11">
                      {step.description}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card elevation="none" className="p-4 bg-white rounded-[8px]">
              <Text className="text-neutral-500 py-3 text-center">
                등록된 단계가 없습니다
              </Text>
            </Card>
          )}
        </View>

        {/* 알코올 도수 계산 버튼 */}
        {/* <View className="px-5 mb-8">
          <TouchableOpacity>
            <Card
              elevation="none"
              className="p-4 bg-white overflow-hidden rounded-[8px]"
            >
              <LinearGradient
                colors={["#e6f2fe", "#4a91db"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute w-full h-full opacity-40"
                style={{ width: "200%", height: "200%" }}
              />
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-neutral-800 font-bold text-base">
                    알코올 도수 계산하기
                  </Text>
                  <Text className="text-neutral-600 text-sm mt-1">
                    정확한 알코올 함량을 계산해보세요
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/70 items-center justify-center">
                  <Ionicons
                    name="calculator-outline"
                    size={22}
                    color="#2563eb"
                  />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View> */}

        {/* 공개 설정 */}
        {/* <View className="px-5 mb-8">
          <Card elevation="none" className="p-4 bg-white rounded-[8px]">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-base font-semibold text-neutral-800">
                  레시피 공개 설정
                </Text>
                <Text className="text-sm text-neutral-500 mt-1">
                  다른 사용자에게 이 레시피를 공개합니다
                </Text>
              </View>
              <TouchableOpacity
                className={`w-14 h-8 rounded-full ${
                  recipeData.isPublic ? "bg-emerald-500" : "bg-neutral-300"
                } justify-center px-1`}
              >
                <View
                  className={`w-6 h-6 rounded-full bg-white ${
                    recipeData.isPublic ? "ml-auto" : "mr-auto"
                  }`}
                />
              </TouchableOpacity>
            </View>
          </Card>
        </View> */}
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View className="px-5 py-4 border-t border-gray-100 bg-white">
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 mr-3"
            onPress={() =>
              router.push(`/journals/create?recipe_id=${recipeData.id}`)
            }
          >
            <Card elevation="none" className="p-4 bg-emerald-50 rounded-[8px]">
              <Text className="text-center font-medium text-emerald-700">
                양조일지 시작하기
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
