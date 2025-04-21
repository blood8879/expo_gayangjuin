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

export default function HomeScreen() {
  // 더미 데이터
  const recentRecipes = [
    {
      id: 1,
      title: "전통 막걸리",
      type: "막걸리",
      days: 7,
      progress: 45,
    },
    {
      id: 2,
      title: "매실주",
      type: "과실주",
      days: 30,
      progress: 25,
    },
  ];

  const recentJournals = [
    {
      id: 1,
      title: "약주 발효 2일차",
      date: "2023-10-05",
      image: null,
      category: "약주",
    },
    {
      id: 2,
      title: "매실주 재료 준비",
      date: "2023-10-01",
      image: null,
      category: "과실주",
    },
  ];

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

          <View className="flex-row items-center">
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm mx-2">
              <Ionicons name="search-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Ionicons name="notifications-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* 홈 배너 카드 */}
        <View className="mb-6">
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
        </View>

        {/* 카테고리 메뉴 */}
        <View className="mb-8">
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
        </View>

        {/* 최근 레시피 섹션 */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-neutral-800 text-xl font-bold">
              최근 레시피
            </Text>
            <TouchableOpacity>
              <Text className="text-[#4a91db] text-sm">더보기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
          >
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
                          : "bg-[#ffeee6]"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          recipe.type === "막걸리"
                            ? "text-[#56bb7f]"
                            : "text-[#e8845e]"
                        }`}
                      >
                        {recipe.type}
                      </Text>
                    </View>
                    <Text className="text-neutral-400 text-xs">
                      {recipe.days}일째
                    </Text>
                  </View>

                  <Text className="text-neutral-800 text-base font-bold mb-1 mt-1">
                    {recipe.title}
                  </Text>

                  <View className="flex-1 justify-end">
                    <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <View
                        className={`h-full rounded-full ${
                          recipe.type === "막걸리"
                            ? "bg-[#56bb7f]"
                            : "bg-[#e8845e]"
                        }`}
                        style={{ width: `${recipe.progress}%` }}
                      />
                    </View>
                    <Text className="text-neutral-400 text-xs font-medium">
                      {recipe.progress}% 완료
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity className="mr-4 w-[180px]">
              <View className="bg-white rounded-[12px] shadow-sm p-4 h-[160px] justify-center items-center border border-gray-100">
                <View className="w-12 h-12 rounded-full bg-[#f3f4f6] items-center justify-center mb-2">
                  <Ionicons name="add" size={24} color="#9ca3af" />
                </View>
                <Text className="text-neutral-500 text-sm font-medium">
                  새 레시피 추가
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 양조 일지 섹션 */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-neutral-800 text-xl font-bold">
              양조 일지
            </Text>
            <TouchableOpacity>
              <Text className="text-[#4a91db] text-sm">더보기</Text>
            </TouchableOpacity>
          </View>

          {recentJournals.map((journal) => (
            <TouchableOpacity key={journal.id} className="mb-3">
              <View className="bg-white rounded-[12px] shadow-sm p-[12px] flex-row">
                <View className="w-16 h-16 bg-gray-100 rounded-[12px] items-center justify-center mr-4">
                  <View className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#e6f2fe]">
                    <Text className="text-[10px] text-[#4a91db] font-medium">
                      {journal.category}
                    </Text>
                  </View>
                  <Ionicons name="image-outline" size={20} color="#9ca3af" />
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
                      {journal.date}
                    </Text>
                  </View>
                </View>

                <View className="justify-center">
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="mt-1">
            <View className="bg-white rounded-[12px] shadow-sm p-[12px] flex-row items-center justify-center border border-gray-100">
              <Ionicons name="add-circle-outline" size={20} color="#4a91db" />
              <Text className="text-[#4a91db] ml-2 font-medium">
                새 일지 작성
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 시음회 섹션 */}
        <View className="mb-10">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
