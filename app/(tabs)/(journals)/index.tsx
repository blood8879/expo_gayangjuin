import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/constants/theme";
import { useJournals } from "@/lib/query/journalQueries";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useIsFocused } from "@react-navigation/native";

// 레시피 타입 정의
type RecipeType =
  | "rice-wine"
  | "fruit-wine"
  | "traditional-wine"
  | "makgeolli"
  | "clear-wine";

// 카테고리 타입 정의
type CategoryType = "약주" | "과실주" | "전통주" | "막걸리" | "약주/청주";

export default function JournalsScreen() {
  const { user } = useAuth();
  const { data: journalsData, isLoading, error, refetch } = useJournals();
  const isFocused = useIsFocused();

  // 화면이 포커스될 때마다 데이터 새로고침
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  // 카테고리별 색상 정보
  const categoryColors: Record<CategoryType, { bg: string; text: string }> = {
    약주: { bg: "#f4e8ff", text: "#a47ad1" },
    과실주: { bg: "#ffeee6", text: "#e8845e" },
    막걸리: { bg: "#e7f7ee", text: "#56bb7f" },
    "약주/청주": { bg: "#e6f2fe", text: "#4a91db" },
    전통주: { bg: "#e6f2fe", text: "#4a91db" },
  };

  // 레시피 타입에 따른 카테고리 매핑
  const getCategory = (
    type: RecipeType | string | null | undefined
  ): CategoryType => {
    const typeMap: Record<RecipeType, CategoryType> = {
      "rice-wine": "약주",
      "fruit-wine": "과실주",
      "traditional-wine": "전통주",
      makgeolli: "막걸리",
      "clear-wine": "약주/청주",
    };

    if (!type || !(type in typeMap)) {
      return "전통주";
    }

    return typeMap[type as RecipeType];
  };

  // 날짜 포맷 변환
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd", { locale: ko });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <StatusBar style="auto" />

      {/* 헤더 */}
      <View className="px-5 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            양조일지
          </Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-neutral-800 shadow-sm"
            onPress={() => router.push("/journals/create")}
          >
            <Ionicons name="add" size={24} color={theme.primary.DEFAULT} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 로딩 표시 */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
          <Text className="mt-2 text-neutral-500 dark:text-neutral-400">
            양조일지 로딩 중...
          </Text>
        </View>
      )}

      {/* 에러 표시 */}
      {error && (
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="alert-circle-outline" size={48} color="red" />
          <Text className="mt-2 text-neutral-900 dark:text-white text-center font-bold">
            데이터를 불러오는 중 오류가 발생했습니다
          </Text>
          <Text className="mt-1 text-neutral-500 dark:text-neutral-400 text-center">
            {error instanceof Error
              ? error.message
              : "나중에 다시 시도해주세요"}
          </Text>
        </View>
      )}

      {/* 비어있을 때 표시 */}
      {!isLoading && !error && (!journalsData || journalsData.length === 0) && (
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="book-outline" size={48} color={theme.neutral[400]} />
          <Text className="mt-2 text-neutral-900 dark:text-white text-center font-bold">
            아직 작성한 양조일지가 없습니다
          </Text>
          <Text className="mt-1 text-neutral-500 dark:text-neutral-400 text-center">
            첫 양조일지를 작성해보세요
          </Text>
          <TouchableOpacity
            className="mt-4 py-3 px-6 bg-primary-500 rounded-full"
            onPress={() => router.push("/journals/create")}
          >
            <Text className="text-white font-medium">새 일지 작성하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 일지 목록 */}
      {!isLoading && !error && journalsData && journalsData.length > 0 && (
        <ScrollView className="flex-1 px-5">
          {journalsData.map((journal) => {
            const category: CategoryType = journal.recipes?.type
              ? getCategory(journal.recipes.type)
              : "전통주";

            return (
              <TouchableOpacity
                key={journal.id}
                className="mb-4"
                onPress={() => router.push(`/journals/${journal.id}`)}
              >
                <View className="bg-white dark:bg-neutral-800 rounded-[16px] shadow-sm overflow-hidden">
                  {/* 상단 정보 */}
                  <View className="p-4 pb-3">
                    <View className="flex-row justify-between mb-2">
                      <View
                        style={{
                          backgroundColor: categoryColors[category].bg,
                        }}
                        className="px-2.5 py-1 rounded-full"
                      >
                        <Text
                          style={{
                            color: categoryColors[category].text,
                          }}
                          className="text-xs font-medium"
                        >
                          {category}
                        </Text>
                      </View>
                      <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                        {formatDate(journal.created_at)}
                      </Text>
                    </View>

                    <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                      {journal.title}
                    </Text>

                    <Text className="text-neutral-600 dark:text-neutral-300 text-sm mb-2">
                      {journal.description || "설명이 없습니다"}
                    </Text>
                  </View>

                  {/* 이미지 또는 빈 이미지 */}
                  {journal.cover_image_url ? (
                    <Image
                      source={{ uri: journal.cover_image_url }}
                      className="h-40 w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-40 bg-neutral-100 dark:bg-neutral-700 items-center justify-center">
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color={theme.neutral[400]}
                      />
                      <Text className="text-neutral-400 dark:text-neutral-500 text-sm mt-2">
                        첨부된 사진이 없습니다
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* 추가 버튼 */}
          <TouchableOpacity
            className="mt-2 mb-10"
            onPress={() => router.push("/journals/create")}
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
                새 일지 작성
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
