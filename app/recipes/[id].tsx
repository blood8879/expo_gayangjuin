import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { theme } from "@/constants/theme";
import { Card } from "@/components/ui/Card";

export default function RecipeDetailScreen() {
  const router = useRouter();

  const recipe = {
    id: 1,
    title: "전통 막걸리",
    type: "막걸리",
    days: 7,
    totalDays: 14,
    progress: 45,
    description: "누룩과 쌀을 이용한 전통적인 막걸리 제조법",
    createdAt: "2023-10-01",
    image: null,
    steps: [
      {
        id: 1,
        order: 1,
        title: "재료 준비",
        description: "쌀 1kg, 누룩 200g, 물 1.5L를 준비합니다.",
        isDone: true,
      },
      {
        id: 2,
        order: 2,
        title: "쌀 불리기",
        description: "쌀을 깨끗이 씻어 3시간 정도 불려줍니다.",
        isDone: true,
      },
      {
        id: 3,
        order: 3,
        title: "쌀 찌기",
        description: "불린 쌀을 찜기에 넣고 40분간 쪄줍니다.",
        isDone: true,
      },
      {
        id: 4,
        order: 4,
        title: "누룩 섞기",
        description: "식힌 쌀에 누룩을 고르게 섞어줍니다.",
        isDone: false,
      },
      {
        id: 5,
        order: 5,
        title: "발효",
        description: "항아리나 유리병에 넣고 20-25도에서 7일간 발효시킵니다.",
        isDone: false,
      },
      {
        id: 6,
        order: 6,
        title: "여과",
        description: "발효가 끝나면 면포를 이용해 앙금과 액체를 분리합니다.",
        isDone: false,
      },
      {
        id: 7,
        order: 7,
        title: "숙성",
        description: "여과한 막걸리를 냉장고에서 3일간 숙성시킵니다.",
        isDone: false,
      },
    ],
    ingredients: [
      { id: 1, name: "쌀", amount: 1, unit: "kg" },
      { id: 2, name: "누룩", amount: 200, unit: "g" },
      { id: 3, name: "물", amount: 1.5, unit: "L" },
    ],
    estimatedAlcohol: 6.5,
    isPublic: true,
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
                    예상 소요일: {recipe.totalDays}일
                  </Text>
                </View>
                <View className="flex-row items-center bg-white/30 px-3 py-1.5 rounded-full">
                  <Ionicons name="wine-outline" size={16} color="#1f6b46" />
                  <Text className="text-emerald-800 ml-1 text-xs font-medium">
                    예상 도수: {recipe.estimatedAlcohol}%
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
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={18} color="#059669" />
              <Text className="text-emerald-600 ml-1 font-medium">편집</Text>
            </TouchableOpacity>
          </View>

          <Card elevation="none" className="p-4 bg-white rounded-[8px]">
            {recipe.ingredients.map((ingredient, index) => (
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
            ))}
          </Card>
        </View>

        {/* 단계 섹션 */}
        <View className="px-5 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-neutral-800">
              양조 단계
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="add-circle-outline" size={18} color="#059669" />
              <Text className="text-emerald-600 ml-1 font-medium">편집</Text>
            </TouchableOpacity>
          </View>

          {recipe.steps.map((step, index) => (
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

                <View className="flex-row mt-4 ml-10">
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
                </View>
              </View>
            </Card>
          ))}
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
