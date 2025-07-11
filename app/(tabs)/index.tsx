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
import { router } from "expo-router";
import { useRecipes } from "../../lib/query/recipeQueries";
import { useJournals } from "../../lib/query/journalQueries";
import { formatDate } from "../../lib/utils/dateUtils";

export default function HomeScreen() {
  // useRecipes 훅 사용
  const { data: recipesData, isLoading: isLoadingRecipes } = useRecipes();
  // useJournals 훅 사용
  const { data: journalsData, isLoading: isLoadingJournals } = useJournals();

  // 최근 레시피 최대 4개만 추출 (created_at 기준 내림차순)
  const recentRecipes = (recipesData || [])
    .sort((a, b) => (b.created_at || 0).localeCompare(a.created_at || 0))
    .slice(0, 4);

  // 최근 양조일지 최대 4개만 추출 (created_at 기준 내림차순)
  const recentJournals = (journalsData || [])
    .sort((a, b) => (b.created_at || 0).localeCompare(a.created_at || 0))
    .slice(0, 4);

  const upcomingEvents = [
    {
      id: 1,
      title: "가양주 시음회",
      date: "2023-11-15",
      location: "서울시 마포구",
      participants: 8,
      maxParticipants: 12,
    },
  ];

  console.log("recipesData", recipesData);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 상단 헤더 */}
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-neutral-800 text-2xl font-bold">
              안녕하세요
            </Text>
            <Text className="text-neutral-500 text-sm mt-1">
              오늘의 양조 현황을 확인해보세요
            </Text>
          </View>

          {/* <View className="flex-row items-center">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm mx-2">
              <Ionicons name="search-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Ionicons name="notifications-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* 홈 배너 카드 */}
        {/* <View className="mb-6">
          <View className="bg-white rounded-[12px] shadow-sm overflow-hidden">
            <LinearGradient
              colors={["#f8e4d0", "#ffe9d4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-5 flex-row items-center justify-between"
            >
              <View className="flex-1 pr-4">
                <Text className="text-neutral-600 text-sm mb-1 font-medium">
                  오늘의 추천
                </Text>
                <Text className="text-neutral-800 text-xl font-bold mb-2">
                  나만의 전통주 만들기
                </Text>
                <Text className="text-neutral-600 text-xs mb-3">
                  누룩과 쌀로 만드는 건강한 전통 막걸리 레시피
                </Text>
                <TouchableOpacity className="bg-neutral-800 py-2 px-4 rounded-full self-start">
                  <Text className="text-white text-xs font-medium">
                    레시피 보기
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-24 h-24 bg-amber-200 rounded-full items-center justify-center">
                <Ionicons name="beer" size={40} color="#795c34" />
              </View>
            </LinearGradient>
          </View>
        </View> */}

        {/* 카테고리 메뉴 */}
        {/* <View className="mb-8">
          <Text className="text-neutral-800 text-xl font-bold mb-4">
            카테고리
          </Text>

          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#e6f2fe] rounded-[12px] items-center justify-center mb-2">
                <Ionicons name="wine-outline" size={26} color="#4a91db" />
              </View>
              <Text className="text-neutral-600 text-xs">전통주</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#e7f7ee] rounded-[12px] items-center justify-center mb-2">
                <Ionicons name="beer-outline" size={26} color="#56bb7f" />
              </View>
              <Text className="text-neutral-600 text-xs">막걸리</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#ffeee6] rounded-[12px] items-center justify-center mb-2">
                <Ionicons name="leaf-outline" size={26} color="#e8845e" />
              </View>
              <Text className="text-neutral-600 text-xs">과실주</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#f4e8ff] rounded-[12px] items-center justify-center mb-2">
                <Ionicons name="flask-outline" size={26} color="#a47ad1" />
              </View>
              <Text className="text-neutral-600 text-xs">약주/청주</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* 최근 레시피 섹션 */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-neutral-800 text-xl font-bold">
              최근 레시피
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(recipes)")}>
              <Text className="text-[#4a91db] text-sm">더보기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
          >
            {isLoadingRecipes ? (
              <View className="justify-center items-center w-[180px] h-[160px]">
                <Text className="text-neutral-400">로딩 중...</Text>
              </View>
            ) : (
              <>
                {recentRecipes.map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    className="mr-4 w-[180px]"
                    onPress={() => router.push(`/recipes/${recipe.id}`)}
                  >
                    <View className="bg-white rounded-[12px] shadow-sm p-4 h-[160px]">
                      <View className="flex-row justify-between mb-2">
                        <View
                          className={`px-2.5 py-1 rounded-full ${
                            recipe.type === "막걸리"
                              ? "bg-[#e7f7ee]"
                              : recipe.type === "과실주"
                              ? "bg-[#ffeee6]"
                              : recipe.type === "약주/청주"
                              ? "bg-[#f4e8ff]"
                              : "bg-[#e6f2fe]"
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              recipe.type === "막걸리"
                                ? "text-[#56bb7f]"
                                : recipe.type === "과실주"
                                ? "text-[#e8845e]"
                                : recipe.type === "약주/청주"
                                ? "text-[#a47ad1]"
                                : "text-[#4a91db]"
                            }`}
                          >
                            {recipe.type}
                          </Text>
                        </View>

                        {/* <Text className="text-neutral-400 text-xs">
                          {recipe.total_duration_days || 0}일째
                        </Text> */}
                      </View>
                      <Text className="text-neutral-800 text-xl font-bold mb-1 mt-1">
                        {recipe.name}
                      </Text>
                      <View className="flex-1 justify-end">
                        <Text className="text-neutral-400 text-xs font-medium">
                          총 {recipe.recipe_stages?.length || 0} 단계 레시피
                        </Text>
                      </View>
                      {/* <View className="flex-1 justify-end">
                        <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                          <View
                            className={`h-full rounded-full ${
                              recipe.type === "막걸리"
                                ? "bg-[#56bb7f]"
                                : recipe.type === "과실주"
                                ? "bg-[#e8845e]"
                                : recipe.type === "약주/청주"
                                ? "bg-[#a47ad1]"
                                : "bg-[#4a91db]"
                            }`}
                            style={{ width: `${recipe.progress || 0}%` }}
                          />
                        </View>
                        <Text className="text-neutral-400 text-xs font-medium">
                          {recipe.progress || 0}% 완료
                        </Text>
                      </View> */}
                    </View>
                  </TouchableOpacity>
                ))}

                {/* 레시피가 4개 이하일 때 항상 마지막에 버튼 보임 */}
                {recentRecipes.length <= 4 && (
                  <TouchableOpacity
                    className="mr-4 w-[180px]"
                    onPress={() => router.push("/recipes/create")}
                  >
                    <View className="bg-white rounded-[12px] shadow-sm p-4 h-[160px] justify-center items-center border border-gray-100">
                      <View className="w-12 h-12 rounded-full bg-[#f3f4f6] items-center justify-center mb-2">
                        <Ionicons name="add" size={24} color="#9ca3af" />
                      </View>
                      <Text className="text-neutral-500 text-sm font-medium">
                        새 레시피 추가
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            )}
          </ScrollView>
        </View>

        {/* 양조 일지 섹션 */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-neutral-800 text-xl font-bold">
              양조 일지
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/(journals)")}>
              <Text className="text-[#4a91db] text-sm">더보기</Text>
            </TouchableOpacity>
          </View>

          {isLoadingJournals ? (
            <View className="justify-center items-center h-20">
              <Text className="text-neutral-400">로딩 중...</Text>
            </View>
          ) : (
            <>
              {recentJournals.map((journal) => (
                <TouchableOpacity
                  key={journal.id}
                  className="mb-3"
                  onPress={() => router.push(`/journals/${journal.id}`)}
                >
                  <View className="bg-white rounded-[12px] shadow-sm p-[12px] flex-row">
                    <View className="w-16 h-16 bg-gray-100 rounded-[12px] items-center justify-center mr-4">
                      {journal.cover_image_url ? (
                        <Image
                          source={{ uri: journal.cover_image_url }}
                          className="w-16 h-16 rounded-[12px]"
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name="image-outline"
                          size={20}
                          color="#9ca3af"
                        />
                      )}
                      <View className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#e6f2fe]">
                        <Text className="text-[10px] text-[#4a91db] font-medium">
                          {journal.recipes?.type || "양조일지"}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-1 justify-center">
                      <Text className="text-neutral-800 text-base font-semibold mb-1">
                        {journal.title}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color="#9ca3af"
                        />
                        <Text className="text-neutral-500 text-xs ml-1">
                          {formatDate(journal.created_at)}
                        </Text>
                      </View>
                    </View>

                    <View className="justify-center">
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9ca3af"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* 항상 '새 일지 작성' 버튼 표시 */}
              <TouchableOpacity
                className="mt-1"
                onPress={() => router.push("/journals/create")}
              >
                <View className="bg-white rounded-[12px] shadow-sm p-[12px] flex-row items-center justify-center border border-gray-100">
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#4a91db"
                  />
                  <Text className="text-[#4a91db] ml-2 font-medium">
                    새 일지 작성
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* 시음회 섹션 */}
        {/* <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-neutral-800 text-xl font-bold">
              예정된 시음회
            </Text>
            <TouchableOpacity>
              <Text className="text-[#4a91db] text-sm">더보기</Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <TouchableOpacity key={event.id} className="mb-3">
                <View className="bg-white rounded-[12px] shadow-sm p-[12px]">
                  <View className="flex-row items-start justify-between mb-3">
                    <Text className="text-neutral-800 text-lg font-bold">
                      {event.title}
                    </Text>
                    <View className="bg-[#f4e8ff] px-3 py-1 rounded-full">
                      <Text className="text-[#a47ad1] text-xs font-bold">
                        D-15
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-[#f4e8ff] items-center justify-center mr-3">
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#a47ad1"
                      />
                    </View>
                    <Text className="text-neutral-600">{event.date}</Text>
                  </View>

                  <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-[#f4e8ff] items-center justify-center mr-3">
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#a47ad1"
                      />
                    </View>
                    <Text className="text-neutral-600">{event.location}</Text>
                  </View>

                  <View className="bg-gray-50 p-[12px] rounded-[12px]">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-neutral-600 font-medium">
                        참가자 ({event.participants}/{event.maxParticipants})
                      </Text>
                      <Text className="text-[#a47ad1] font-medium">
                        {event.maxParticipants - event.participants}자리 남음
                      </Text>
                    </View>

                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-[#a47ad1] rounded-full"
                        style={{
                          width: `${
                            (event.participants / event.maxParticipants) * 100
                          }%`,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity>
              <View className="bg-white rounded-[12px] shadow-sm p-[12px] flex-row items-center justify-center border border-gray-100">
                <Ionicons name="wine-outline" size={20} color="#a47ad1" />
                <Text className="text-[#a47ad1] ml-2 font-medium">
                  시음회 개설하기
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
