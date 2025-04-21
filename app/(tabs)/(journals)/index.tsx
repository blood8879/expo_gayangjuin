import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/constants/theme";

export default function JournalsScreen() {
  // 더미 데이터
  const journals = [
    {
      id: 1,
      title: "약주 발효 2일차",
      date: "2023-10-05",
      image: null,
      category: "약주",
      desc: "발효가 천천히 진행 중. 거품이 조금씩 생기기 시작했다.",
    },
    {
      id: 2,
      title: "매실주 재료 준비",
      date: "2023-10-01",
      image: null,
      category: "과실주",
      desc: "매실 3kg, 설탕 1.5kg, 소주 4L를 준비했다.",
    },
    {
      id: 3,
      title: "막걸리 1차 발효 완료",
      date: "2023-09-28",
      image: null,
      category: "막걸리",
      desc: "1차 발효 완료. 이제 2차 발효 시작.",
    },
    {
      id: 4,
      title: "청주 숙성 체크",
      date: "2023-09-25",
      image: null,
      category: "약주/청주",
      desc: "맑아지기 시작했다. 아직 2주 정도 더 숙성 필요.",
    },
  ];

  // 카테고리별 색상 정보
  const categoryColors = {
    약주: { bg: "#f4e8ff", text: "#a47ad1" },
    과실주: { bg: "#ffeee6", text: "#e8845e" },
    막걸리: { bg: "#e7f7ee", text: "#56bb7f" },
    "약주/청주": { bg: "#e6f2fe", text: "#4a91db" },
    전통주: { bg: "#e6f2fe", text: "#4a91db" },
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

      {/* 일지 목록 */}
      <ScrollView className="flex-1 px-5">
        {journals.map((journal) => (
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
                      backgroundColor:
                        categoryColors[journal.category]?.bg ||
                        categoryColors["전통주"].bg,
                    }}
                    className="px-2.5 py-1 rounded-full"
                  >
                    <Text
                      style={{
                        color:
                          categoryColors[journal.category]?.text ||
                          categoryColors["전통주"].text,
                      }}
                      className="text-xs font-medium"
                    >
                      {journal.category}
                    </Text>
                  </View>
                  <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                    {journal.date}
                  </Text>
                </View>

                <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                  {journal.title}
                </Text>

                <Text className="text-neutral-600 dark:text-neutral-300 text-sm mb-2">
                  {journal.desc}
                </Text>
              </View>

              {/* 빈 이미지 */}
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
            </View>
          </TouchableOpacity>
        ))}

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
    </SafeAreaView>
  );
}
