import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/constants/theme";

// Recipe 타입 정의
interface Recipe {
  id: number;
  title: string;
  type: "막걸리" | "과실주" | "약주/청주" | "전통주";
  days: number;
  progress: number;
  isPublic: boolean;
  star: number;
  reviewCount: number;
}

export default function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

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

  // 레시피 데이터
  const recipes: Recipe[] = [
    {
      id: 1,
      title: "전통 막걸리",
      type: "막걸리",
      days: 7,
      progress: 45,
      isPublic: true,
      star: 4.5,
      reviewCount: 12,
    },
    {
      id: 2,
      title: "매실주",
      type: "과실주",
      days: 30,
      progress: 25,
      isPublic: true,
      star: 4.2,
      reviewCount: 8,
    },
    {
      id: 3,
      title: "약주 만들기",
      type: "약주/청주",
      days: 14,
      progress: 75,
      isPublic: false,
      star: 0,
      reviewCount: 0,
    },
    {
      id: 4,
      title: "오미자주",
      type: "과실주",
      days: 60,
      progress: 10,
      isPublic: true,
      star: 4.8,
      reviewCount: 5,
    },
  ];

  // 현재 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState("all");

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
      {/* <StatusBar style="auto" /> */}

      {/* 헤더 */}
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            레시피
          </Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-sm"
            onPress={() => router.push({ pathname: "/create" } as any)}
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
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              className="mb-4"
              onPress={() => router.push(`/recipes/${recipe.id}`)}
            >
              <View className="bg-white dark:bg-neutral-800 rounded-[16px] shadow-sm p-4">
                <View className="flex-row justify-between mb-2">
                  <View
                    style={{ backgroundColor: typeColors[recipe.type]?.bg }}
                    className="px-2.5 py-1 rounded-full"
                  >
                    <Text
                      style={{ color: typeColors[recipe.type]?.text }}
                      className="text-xs font-medium"
                    >
                      {recipe.type}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    {recipe.isPublic ? (
                      <>
                        <Ionicons
                          name="eye-outline"
                          size={16}
                          color={theme.neutral[400]}
                        />
                        <Text className="ml-1 text-neutral-400 dark:text-neutral-500 text-xs">
                          공개
                        </Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="eye-off-outline"
                          size={16}
                          color={theme.neutral[400]}
                        />
                        <Text className="ml-1 text-neutral-400 dark:text-neutral-500 text-xs">
                          비공개
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {recipe.title}
                </Text>

                <View className="flex-row justify-between items-center mb-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={theme.neutral[500]}
                    />
                    <Text className="ml-1 text-neutral-500 dark:text-neutral-400 text-xs">
                      {recipe.days}일 소요
                    </Text>
                  </View>

                  {recipe.isPublic && recipe.reviewCount > 0 && (
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#f59e0b" />
                      <Text className="ml-1 text-neutral-700 dark:text-neutral-300 text-xs font-medium">
                        {recipe.star.toFixed(1)}
                      </Text>
                      <Text className="ml-1 text-neutral-500 dark:text-neutral-400 text-xs">
                        ({recipe.reviewCount})
                      </Text>
                    </View>
                  )}
                </View>

                <View className="mt-2">
                  <View className="h-1.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${recipe.progress}%`,
                        backgroundColor:
                          typeColors[recipe.type]?.text ||
                          theme.primary.DEFAULT,
                      }}
                    />
                  </View>
                  <Text className="mt-1 text-neutral-500 dark:text-neutral-400 text-xs">
                    {recipe.progress}% 완료
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center justify-center py-10">
            <Ionicons name="search" size={40} color={theme.neutral[300]} />
            <Text className="text-neutral-500 dark:text-neutral-400 mt-3 text-center">
              검색 결과가 없습니다
            </Text>
          </View>
        )}

        {/* 새 레시피 추가 버튼 */}
        <TouchableOpacity
          className="mt-2 mb-10"
          onPress={() => router.push({ pathname: "/create" } as any)}
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
      </ScrollView>
    </SafeAreaView>
  );
}
