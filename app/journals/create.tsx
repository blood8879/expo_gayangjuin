import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

// 색상 정보 인터페이스 정의
interface RecipeColorInfo {
  bg: string;
  text: string;
  icon: string;
}

export default function JournalCreateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const [journalDate, setJournalDate] = useState(new Date());
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // 더미 데이터
  const recipes = [
    {
      id: 1,
      title: "전통 막걸리",
      type: "막걸리",
      days: 7,
      progress: 45,
      stages: [
        { id: 1, name: "쌀을 불린다", duration: "8 시간" },
        { id: 2, name: "죽을 쑨다", duration: "2 시간" },
        { id: 3, name: "밑술을 한다", duration: "3 일" },
        { id: 4, name: "덧술을 한다", duration: "720 개월" },
      ],
    },
    {
      id: 2,
      title: "매실주",
      type: "과실주",
      days: 30,
      progress: 25,
      stages: [
        { id: 1, name: "매실 세척", duration: "1 시간" },
        { id: 2, name: "설탕 및 매실 투입", duration: "1 일" },
        { id: 3, name: "숙성", duration: "30 일" },
      ],
    },
  ];

  // 더미 데이터를 위한 색상 설정
  const recipeColors: Record<string, RecipeColorInfo> = {
    막걸리: {
      bg: "#e7f7ee",
      text: "#56bb7f",
      icon: "beer-outline",
    },
    과실주: {
      bg: "#ffeee6",
      text: "#e8845e",
      icon: "leaf-outline",
    },
    "약주/청주": {
      bg: "#f4e8ff",
      text: "#a47ad1",
      icon: "flask-outline",
    },
    전통주: {
      bg: "#e6f2fe",
      text: "#4a91db",
      icon: "wine-outline",
    },
  };

  // 선택한 레시피의 색상 정보 가져오기
  const getRecipeColorInfo = (): RecipeColorInfo => {
    if (!selectedRecipe) return recipeColors["전통주"];
    const type = recipes.find((r) => r.id === selectedRecipe)?.type || "전통주";
    return recipeColors[type] || recipeColors["전통주"];
  };

  const colorInfo = getRecipeColorInfo();

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  // 선택된 레시피의 단계들
  const selectedRecipeStages = selectedRecipe
    ? recipes.find((r) => r.id === selectedRecipe)?.stages || []
    : [];

  // 오늘 날짜를 자동으로 설정
  useEffect(() => {
    setJournalDate(new Date());
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <StatusBar style="auto" />

      {/* 헤더 - 그라데이션 추가 */}
      <LinearGradient
        colors={[colorInfo.bg, isDark ? theme.neutral[900] : "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View className="px-5 pt-12 pb-6 flex-row justify-between items-center">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? "#fff" : theme.neutral[800]}
            />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white">
            새 양조일지
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: colorInfo.text }}
            className="px-5 py-2 rounded-full"
          >
            <Text className="text-white font-medium">저장</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-5">
        {/* 제목 입력 */}
        <View className="mb-6 mt-4">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            제목
          </Text>
          <TextInput
            style={{
              padding: 12,
              backgroundColor: isDark ? theme.neutral[800] : "white",
              color: isDark ? "white" : theme.neutral[900],
              borderWidth: 0.5,
              borderColor: isDark ? theme.neutral[700] : theme.neutral[200],
              borderRadius: 12,
            }}
            placeholder="양조일지 제목을 입력하세요"
            placeholderTextColor={theme.neutral[400]}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 레시피 선택 - 색상 추가 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            레시피 선택
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: isDark ? theme.neutral[800] : "white",
              borderColor: selectedRecipe
                ? colorInfo.text
                : isDark
                ? theme.neutral[700]
                : theme.neutral[200],
            }}
            className="p-3 rounded-[12px] border-[0.5px] flex-row justify-between items-center"
            onPress={() => {
              setSelectedRecipe(selectedRecipe === 1 ? null : 1);
            }}
          >
            <View className="flex-row items-center">
              {selectedRecipe && (
                <View
                  style={{ backgroundColor: colorInfo.bg }}
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                >
                  <Ionicons
                    name={colorInfo.icon as any}
                    size={18}
                    color={colorInfo.text}
                  />
                </View>
              )}
              <Text className="text-neutral-900 dark:text-neutral-200">
                {selectedRecipe
                  ? recipes.find((r) => r.id === selectedRecipe)?.title
                  : "레시피를 선택해주세요"}
              </Text>
            </View>
            <Ionicons
              name="chevron-down"
              size={18}
              color={theme.neutral[400]}
            />
          </TouchableOpacity>
        </View>

        {/* 현재 진행 단계 - 완전히 새로운 디자인 */}
        {selectedRecipe && (
          <View className="mb-6">
            <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              현재 진행 단계
            </Text>
            <View
              style={{
                backgroundColor: isDark ? theme.neutral[800] : "white",
                borderColor: isDark ? theme.neutral[700] : theme.neutral[200],
              }}
              className="rounded-[12px] p-4 border-[0.5px]"
            >
              <View className="flex-row items-center mb-4">
                <Text className="text-neutral-900 dark:text-neutral-200 font-medium">
                  {recipes.find((r) => r.id === selectedRecipe)?.title}
                </Text>
                <View
                  style={{ backgroundColor: colorInfo.bg }}
                  className="ml-2 px-2 py-1 rounded-full"
                >
                  <Text
                    style={{ color: colorInfo.text }}
                    className="text-xs font-medium"
                  >
                    {recipes.find((r) => r.id === selectedRecipe)?.type}
                  </Text>
                </View>
              </View>

              {/* 진행 단계 - 가로 그리드 레이아웃 */}
              <View className="flex-row flex-wrap">
                {selectedRecipeStages.map((stage, index) => (
                  <TouchableOpacity
                    key={stage.id}
                    style={{
                      backgroundColor: "#edf3fa",
                      borderColor:
                        selectedStage === stage.id ? "#4a7abf" : "transparent",
                      borderWidth: 1,
                      width: index === 3 ? "100%" : "48%",
                      marginRight: index % 2 === 0 && index !== 3 ? "4%" : 0,
                      marginBottom: 10,
                    }}
                    className="p-4 rounded-[12px]"
                    onPress={() => setSelectedStage(stage.id)}
                  >
                    <View>
                      <Text
                        style={{ color: "#4a7abf" }}
                        className="text-3xl font-bold mb-1 text-center"
                      >
                        {index + 1}
                      </Text>
                      <Text
                        style={{ color: isDark ? "white" : theme.neutral[900] }}
                        className="font-medium text-center mb-1"
                      >
                        {stage.name}
                      </Text>
                      <Text
                        style={{ color: theme.neutral[500] }}
                        className="text-xs text-center"
                      >
                        {stage.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* 날짜 - 색상 추가 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            기록 날짜
          </Text>
          <View className="p-3 bg-white dark:bg-neutral-800 rounded-[12px] border-[0.5px] border-neutral-200 dark:border-neutral-700 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: "#e6f2fe" }}
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
              >
                <Ionicons name="calendar-outline" size={18} color="#4a91db" />
              </View>
              <Text className="text-neutral-900 dark:text-neutral-200">
                {formatDate(journalDate)}
              </Text>
            </View>
            <View className="bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-full">
              <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                오늘
              </Text>
            </View>
          </View>
        </View>

        {/* 사진 추가 - 색상 추가 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            발효 사진
          </Text>

          <View className="bg-white dark:bg-neutral-800 rounded-[12px] p-4 border-[0.5px] border-neutral-200 dark:border-neutral-700">
            <View className="flex-row flex-wrap">
              <TouchableOpacity
                style={{ backgroundColor: "#e7f7ee", borderColor: "#56bb7f" }}
                className="w-[31%] aspect-square mr-[3.5%] mb-[3.5%] rounded-[12px] items-center justify-center border border-dashed"
              >
                <Ionicons name="camera-outline" size={26} color="#56bb7f" />
                <Text
                  style={{ color: "#56bb7f" }}
                  className="mt-2 text-xs font-medium"
                >
                  촬영
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: "#ffeee6", borderColor: "#e8845e" }}
                className="w-[31%] aspect-square mr-[3.5%] mb-[3.5%] rounded-[12px] items-center justify-center border border-dashed"
              >
                <Ionicons name="image-outline" size={26} color="#e8845e" />
                <Text
                  style={{ color: "#e8845e" }}
                  className="mt-2 text-xs font-medium"
                >
                  갤러리
                </Text>
              </TouchableOpacity>

              {/* 예시 이미지 */}
              <View className="w-[31%] aspect-square mb-[3.5%] rounded-[12px] overflow-hidden relative">
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  className="w-full h-full"
                />
                <TouchableOpacity className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full items-center justify-center">
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 측정값 섹션 - 다양한 색상 추가 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            측정값 기록
          </Text>

          <View className="bg-white dark:bg-neutral-800 rounded-[12px] p-4 border-[0.5px] border-neutral-200 dark:border-neutral-700 mb-3">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View
                  style={{ backgroundColor: "#e6f2fe" }}
                  className="w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons
                    name="thermometer-outline"
                    size={18}
                    color="#4a91db"
                  />
                </View>
                <Text className="text-neutral-900 dark:text-neutral-200 font-medium ml-3">
                  온도
                </Text>
              </View>
              <View className="flex-row items-center">
                <TextInput
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: isDark ? theme.neutral[700] : "#e6f2fe50",
                    width: 80,
                    textAlign: "right",
                    color: isDark ? "white" : theme.neutral[900],
                    borderRadius: 8,
                  }}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor={theme.neutral[400]}
                />
                <Text className="ml-2 text-neutral-500 dark:text-neutral-400">
                  °C
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View
                  style={{ backgroundColor: "#e7f7ee" }}
                  className="w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="water-outline" size={18} color="#56bb7f" />
                </View>
                <Text className="text-neutral-900 dark:text-neutral-200 font-medium ml-3">
                  당도
                </Text>
              </View>
              <View className="flex-row items-center">
                <TextInput
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: isDark ? theme.neutral[700] : "#e7f7ee50",
                    width: 80,
                    textAlign: "right",
                    color: isDark ? "white" : theme.neutral[900],
                    borderRadius: 8,
                  }}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor={theme.neutral[400]}
                />
                <Text className="ml-2 text-neutral-500 dark:text-neutral-400">
                  Brix
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View
                  style={{ backgroundColor: "#ffeee6" }}
                  className="w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="flask-outline" size={18} color="#e8845e" />
                </View>
                <Text className="text-neutral-900 dark:text-neutral-200 font-medium ml-3">
                  pH
                </Text>
              </View>
              <View className="flex-row items-center">
                <TextInput
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: isDark ? theme.neutral[700] : "#ffeee650",
                    width: 80,
                    textAlign: "right",
                    color: isDark ? "white" : theme.neutral[900],
                    borderRadius: 8,
                  }}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor={theme.neutral[400]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: colorInfo.bg }}
              className="mt-5 flex-row items-center justify-center py-3 rounded-[12px]"
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={colorInfo.text}
              />
              <Text
                style={{ color: colorInfo.text }}
                className="ml-2 font-medium"
              >
                측정값 추가
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 메모 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            오늘의 양조 기록
          </Text>
          <TextInput
            style={{
              padding: 16,
              backgroundColor: isDark ? theme.neutral[800] : "white",
              color: isDark ? "white" : theme.neutral[900],
              minHeight: 120,
              borderWidth: 0.5,
              borderColor: isDark ? theme.neutral[700] : theme.neutral[200],
              borderRadius: 12,
            }}
            placeholder="오늘의 양조 과정에 대한 메모를 자유롭게 작성하세요"
            placeholderTextColor={theme.neutral[400]}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 재료 투입 기록 */}
        <View className="mb-10">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            재료 투입 기록
          </Text>

          <TouchableOpacity>
            <View
              style={{ backgroundColor: "#f4e8ff" }}
              className="p-4 flex-row items-center justify-center rounded-[12px]"
            >
              <Ionicons name="add-circle-outline" size={20} color="#a47ad1" />
              <Text style={{ color: "#a47ad1" }} className="ml-2 font-medium">
                투입 재료 기록하기
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
