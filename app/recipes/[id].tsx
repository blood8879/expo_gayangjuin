import React, { useState, useEffect } from "react";
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
import { getRecipeById } from "@/lib/api/recipe";

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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);

  // 레시피 데이터 가져오기
  useEffect(() => {
    async function fetchRecipeDetail() {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const data = await getRecipeById(id);

        // 레시피 데이터 변환 및 가공
        setRecipe({
          id: data.id,
          title: data.name, // DB의 name 필드를 title로 표시
          type: data.type,
          days: data.total_duration_days || 0,
          totalDays: data.total_duration_days || 0,
          progress: 0, // 진행 상태 기능 구현 필요
          description: data.description,
          createdAt: data.created_at,
          image: data.cover_image_url,
          estimatedAlcohol: data.estimated_abv || 0,
          isPublic: data.is_public,

          // 재료 데이터 변환
          ingredients: data.recipe_ingredients.map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          })),

          // 단계 데이터 변환
          steps: data.recipe_stages.map((stage: any) => ({
            id: stage.id,
            order: stage.stage_number,
            title: stage.title || `단계 ${stage.stage_number}`,
            description: stage.description,
            days: stage.duration_days,
            isDone: false, // 진행 상태 기능 구현 필요
          })),
        });
      } catch (err) {
        console.error("레시피 상세 조회 오류:", err);
        setError("레시피를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipeDetail();
  }, [id]);

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
  if (error || !recipe) {
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
            {error || "레시피를 찾을 수 없습니다"}
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
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white">
            <Ionicons
              name="bookmark-outline"
              size={22}
              color={theme.neutral[600]}
            />
          </TouchableOpacity>
        </View>
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
                  {recipe.type}
                </Text>
              </View>

              <Text className="text-neutral-800 text-2xl font-bold mb-2">
                {recipe.title}
              </Text>

              <Text className="text-neutral-700 text-base mb-5">
                {recipe.description}
              </Text>

              <View className="flex-row justify-between">
                <View className="flex-row items-center bg-white/30 px-3 py-1.5 rounded-full">
                  <Ionicons name="time-outline" size={16} color="#1f6b46" />
                  <Text className="text-emerald-800 ml-1 text-xs font-medium">
                    예상 소요일: {recipe.totalDays || 0}일
                  </Text>
                </View>
                <View className="flex-row items-center bg-white/30 px-3 py-1.5 rounded-full">
                  <Ionicons name="wine-outline" size={16} color="#1f6b46" />
                  <Text className="text-emerald-800 ml-1 text-xs font-medium">
                    예상 도수: {recipe.estimatedAlcohol || 0}%
                  </Text>
                </View>
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
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <View
                  key={ingredient.id}
                  className={`flex-row justify-between py-3 ${
                    index < recipe.ingredients.length - 1
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
              ))
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
          </View>

          {recipe.steps && recipe.steps.length > 0 ? (
            recipe.steps.map((step, index) => (
              <Card
                key={step.id}
                elevation="none"
                className="mb-4 overflow-hidden bg-white rounded-[8px]"
              >
                <View className="p-4">
                  <View className="flex-row items-center mb-2">
                    <View className="w-7 h-7 rounded-full items-center justify-center bg-emerald-100">
                      <Text className="text-xs font-bold text-emerald-700">
                        {step.order}
                      </Text>
                    </View>
                    <Text className="text-base font-semibold text-neutral-800 ml-3">
                      {step.title}
                    </Text>
                  </View>

                  <Text className="text-neutral-600 ml-10">
                    {step.description}
                  </Text>

                  {step.days > 0 && (
                    <Text className="text-neutral-500 ml-10 mt-2 text-xs">
                      소요 기간: {step.days}일
                    </Text>
                  )}

                  {/* <View className="flex-row mt-4 ml-10">
                    <TouchableOpacity className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                      <Ionicons
                        name="camera-outline"
                        size={16}
                        color={theme.neutral[500]}
                      />
                      <Text className="ml-1 text-xs text-neutral-600">
                        참고 사진
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
              </Card>
            ))
          ) : (
            <Card elevation="none" className="p-4 bg-white rounded-[8px]">
              <Text className="text-neutral-500 py-3 text-center">
                등록된 단계가 없습니다
              </Text>
            </Card>
          )}
        </View>

        {/* 알코올 도수 계산 버튼 */}
        <View className="px-5 mb-8">
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
        </View>

        {/* 공개 설정 */}
        <View className="px-5 mb-8">
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
                  recipe.isPublic ? "bg-emerald-500" : "bg-neutral-300"
                } justify-center px-1`}
              >
                <View
                  className={`w-6 h-6 rounded-full bg-white ${
                    recipe.isPublic ? "ml-auto" : "mr-auto"
                  }`}
                />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View className="px-5 py-4 border-t border-gray-100 bg-white">
        <View className="flex-row">
          <TouchableOpacity className="flex-1 mr-3">
            <Card elevation="none" className="p-4 bg-emerald-50 rounded-[8px]">
              <Text className="text-center font-medium text-emerald-700">
                양조일지 시작하기
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1">
            <Card elevation="none" className="p-4 bg-emerald-500 rounded-[8px]">
              <Text className="text-center font-bold text-white">
                레시피 수정
              </Text>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
