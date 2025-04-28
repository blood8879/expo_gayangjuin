import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { theme } from "@/constants/theme";
import { useRecipes } from "@/lib/query/recipeQueries";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { recipeKeys } from "@/lib/query/queryClient";

// Recipe 타입 정의
interface Recipe {
  id: string | number;
  title: string;
  type: "막걸리" | "과실주" | "약주/청주" | "전통주";
  days: number;
  progress: number;
  isPublic: boolean;
  star: number;
  reviewCount: number;
  name?: string;
  is_public?: boolean;
  description?: string;
  created_at?: string;
  total_duration_days?: number;
}

export default function RecipesScreen() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const queryClient = useQueryClient();

  // useRecipes 훅 사용
  const { data: recipesData, isLoading, error } = useRecipes();

  // 화면에 포커스가 돌아올 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      // 레시피 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      return () => {};
    }, [queryClient])
  );

  // 레시피 카테고리
  const categories = [
    {
      id: "all",
      name: "전체",
      icon: "grid-outline",
      color: "#4a91db",
      bg: "#e6f2fe",
    },
    {
      id: "traditional",
      name: "전통주",
      icon: "wine-outline",
      color: "#4a91db",
      bg: "#e6f2fe",
    },
    {
      id: "makgeolli",
      name: "막걸리",
      icon: "beer-outline",
      color: "#56bb7f",
      bg: "#e7f7ee",
    },
    {
      id: "fruit",
      name: "과실주",
      icon: "leaf-outline",
      color: "#e8845e",
      bg: "#ffeee6",
    },
    {
      id: "yakju",
      name: "약주/청주",
      icon: "flask-outline",
      color: "#a47ad1",
      bg: "#f4e8ff",
    },
  ];

  // API 응답 데이터를 UI에 맞게 변환
  const recipes = recipesData
    ? recipesData.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.name, // DB의 name 필드를 title로 표시
        type: recipe.type as "막걸리" | "과실주" | "약주/청주" | "전통주",
        days: recipe.total_duration_days || 0,
        progress: 0, // 진행 상태는 아직 구현되지 않음
        isPublic: recipe.is_public,
        star: 0, // 리뷰 기능 구현 전
        reviewCount: 0, // 리뷰 기능 구현 전
      }))
    : [];

  // 카테고리 필터링
  const filteredRecipes = recipes
    .filter((recipe) => {
      if (selectedCategory === "all") return true;

      if (selectedCategory === "traditional") return recipe.type === "전통주";
      if (selectedCategory === "makgeolli") return recipe.type === "막걸리";
      if (selectedCategory === "fruit") return recipe.type === "과실주";
      if (selectedCategory === "yakju") return recipe.type === "약주/청주";

      return true;
    })
    .filter((recipe) => {
      // 검색어 필터링
      if (!searchQuery) return true;
      return recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // 카테고리별 색상 정보
  const typeColors: {
    [key in Recipe["type"]]: { bg: string; text: string };
  } = {
    막걸리: { bg: "#e7f7ee", text: "#56bb7f" },
    과실주: { bg: "#ffeee6", text: "#e8845e" },
    "약주/청주": { bg: "#f4e8ff", text: "#a47ad1" },
    전통주: { bg: "#e6f2fe", text: "#4a91db" },
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <StatusBar style="auto" />

      {/* 헤더 */}
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            레시피
          </Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-sm"
            onPress={() => router.push("/recipes/create")}
          >
            <Ionicons name="add" size={24} color={theme.primary.DEFAULT} />
          </TouchableOpacity>
        </View>

        {/* 검색창 */}
        <View className="mt-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm flex-row items-center px-4 py-2">
          <Ionicons name="search" size={20} color={theme.neutral[400]} />
          <TextInput
            className="flex-1 ml-2 text-neutral-900 dark:text-white"
            placeholder="레시피 검색"
            placeholderTextColor={theme.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.neutral[400]}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 카테고리 */}
      <View className="h-10 mb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mr-2 py-1 px-2.5 rounded-md flex-row items-center h-8 ${
                selectedCategory === category.id
                  ? `bg-${category.color}`
                  : "bg-white dark:bg-neutral-800"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === category.id ? category.bg : undefined,
              }}
            >
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={
                  selectedCategory === category.id
                    ? category.color
                    : theme.neutral[400]
                }
              />
              <Text
                className="ml-1 font-medium text-xs"
                style={{
                  color:
                    selectedCategory === category.id
                      ? category.color
                      : theme.neutral[600],
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 레시피 목록 */}
      <ScrollView className="flex-1 px-5">
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
            <Text className="mt-4 text-neutral-500 dark:text-neutral-400">
              레시피를 불러오는 중...
            </Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-20">
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={theme.neutral[400]}
            />
            <Text className="mt-3 text-neutral-500 dark:text-neutral-400 text-center">
              {error instanceof Error
                ? error.message
                : "데이터를 불러오는 중 오류가 발생했습니다"}
            </Text>
            <TouchableOpacity
              className="mt-4 py-2 px-4 bg-primary-500 rounded-full"
              onPress={() =>
                queryClient.invalidateQueries({ queryKey: recipeKeys.lists() })
              }
            >
              <Text className="text-white font-medium">다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : filteredRecipes.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons
              name="book-outline"
              size={40}
              color={theme.neutral[400]}
            />
            <Text className="mt-3 text-neutral-900 dark:text-white text-center font-bold">
              {searchQuery ? "검색 결과가 없습니다" : "아직 레시피가 없습니다"}
            </Text>
            <Text className="mt-1 text-neutral-500 dark:text-neutral-400 text-center">
              {searchQuery
                ? "다른 검색어로 시도해보세요"
                : "첫 레시피를 작성해보세요"}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                className="mt-4 py-3 px-6 bg-primary-500 rounded-full"
                onPress={() => router.push("/recipes/create")}
              >
                <Text className="text-white font-medium">레시피 작성하기</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                className="mb-4"
                onPress={() => router.push(`/recipes/${recipe.id}`)}
              >
                <View className="bg-white dark:bg-neutral-800 rounded-[16px] shadow-sm overflow-hidden">
                  <View className="p-4">
                    <View className="flex-row justify-between mb-2">
                      <View
                        style={{
                          backgroundColor: typeColors[recipe.type].bg,
                        }}
                        className="px-2.5 py-1 rounded-full"
                      >
                        <Text
                          style={{
                            color: typeColors[recipe.type].text,
                          }}
                          className="text-xs font-medium"
                        >
                          {recipe.type}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                      {recipe.title}
                    </Text>

                    <View className="flex-row items-center mt-2">
                      <View className="flex-row items-center mr-4">
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={theme.neutral[400]}
                        />
                        <Text className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {recipe.days}일
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-2 mb-10"
              onPress={() => router.push("/recipes/create")}
            >
              <View className="bg-white dark:bg-neutral-800 rounded-[16px] py-4 shadow-sm border border-neutral-100 dark:border-neutral-700 flex-row items-center justify-center">
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={theme.primary.DEFAULT}
                />
                <Text
                  className="ml-2 font-medium"
                  style={{ color: theme.primary.DEFAULT }}
                >
                  새 레시피 작성
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
