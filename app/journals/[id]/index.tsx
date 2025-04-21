import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// 더미 데이터 타입
type StageLog = {
  id: number;
  title: string;
  date: string;
  description: string;
  temperature: string;
  humidity: string;
  images: string[];
  completed: boolean;
  duration?: string;
};

export default function JournalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("석탄주");

  // 더미 데이터
  const [journal] = useState({
    id: id,
    title: "석탄주 양조 일지",
    category: "청주",
    startDate: "2025년 4월 5일",
    status: "진행중",
    progress: 60,
    stages: [
      {
        id: 1,
        title: "쌀을 불린다",
        date: "2025년 4월 5일",
        description: "쌀 1kg을 깨끗이 씻어 물에 불렸습니다.",
        temperature: "25°C",
        humidity: "60%",
        images: ["https://via.placeholder.com/150"],
        completed: true,
        duration: "8 시간",
      },
      {
        id: 2,
        title: "죽을 쑨다.",
        date: "2025년 4월 5일",
        description: "불린 쌀로 고슬고슬한 죽을 만들었습니다.",
        temperature: "28°C",
        humidity: "65%",
        images: [
          "https://via.placeholder.com/150",
          "https://via.placeholder.com/150",
        ],
        completed: true,
        duration: "2 시간",
      },
      {
        id: 3,
        title: "밑술을 한다",
        date: "2025년 4월 5일",
        description: "찐 쌀에 누룩을 섞고 발효를 시작했습니다.",
        temperature: "26°C",
        humidity: "63%",
        images: ["https://via.placeholder.com/150"],
        completed: true,
        duration: "3 일",
      },
      {
        id: 4,
        title: "덧술을 한다",
        date: "2025년 4월 5일",
        description: "발효가 진행 중입니다. 거품이 생기기 시작했습니다.",
        temperature: "24°C",
        humidity: "70%",
        images: ["https://via.placeholder.com/150"],
        completed: false,
        duration: "720 개월",
      },
    ],
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-medium text-gray-800">
          석탄주 양조 일지
        </Text>
        <TouchableOpacity className="p-1">
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-col">
        <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
          <View className="flex-1">
            <Text className="text-base font-bold text-blue-600">석탄주</Text>
            <Text className="text-sm text-gray-600 mt-1">청주</Text>
          </View>
          <View className="bg-blue-100 px-3 py-1.5 rounded-full mr-2">
            <Text className="text-blue-600 text-sm font-medium">진행중</Text>
          </View>
          <TouchableOpacity className="p-1">
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View className="bg-white py-4 px-4 border-b border-gray-200">
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-800">
              레시피 단계
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              (주차 버튼을 클릭하여 양조단계 변경)
            </Text>
          </View>

          {journal.stages.map((stage) => (
            <View key={stage.id} className="flex-row items-center mb-4">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  stage.id === 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-base font-bold ${
                    stage.id === 1 ? "text-white" : "text-gray-600"
                  }`}
                >
                  {stage.id}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-800">
                  {stage.title}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {stage.duration}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center px-4 mb-3 pt-4">
            <Text className="text-base font-semibold text-gray-800">
              양조 기록
            </Text>
            <TouchableOpacity
              className="flex-row bg-orange-400 py-2 px-3 rounded-full items-center"
              onPress={() => router.push(`/journals/${id}/add-record`)}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text className="text-white text-sm font-medium ml-1">
                기록 추가
              </Text>
            </TouchableOpacity>
          </View>

          <View className="w-full h-px bg-gray-200" />

          <View className="flex-1 flex-row">
            <View className="w-24 shrink-0 px-2 py-4 bg-white">
              <Text className="text-sm font-bold text-gray-800">4월 5일</Text>
              <Text className="text-xs text-gray-500 my-1">1단계</Text>
              <Text className="text-sm text-blue-600">쌀을 불린다</Text>
            </View>

            <View className="flex-1 bg-blue-50 border-l-2 border-blue-600">
              <View className="px-4 py-4">
                <Text className="text-xs text-gray-500 mb-1">
                  2025년 4월 5일 토요일
                </Text>
                <Text className="text-base font-bold text-gray-800 mb-3">
                  쌀을 불린다
                </Text>

                <View className="flex-row bg-white rounded-lg p-3 mb-3">
                  <View className="flex-1 items-center">
                    <Ionicons
                      name="thermometer-outline"
                      size={20}
                      color="#4D79FF"
                    />
                    <Text className="text-xs text-gray-500 mt-1">온도</Text>
                    <Text className="text-base font-semibold text-gray-800 mt-0.5">
                      25°C
                    </Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Ionicons name="water-outline" size={20} color="#4D79FF" />
                    <Text className="text-xs text-gray-500 mt-1">습도</Text>
                    <Text className="text-base font-semibold text-gray-800 mt-0.5">
                      60%
                    </Text>
                  </View>
                </View>

                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-500 mb-1">
                    메모
                  </Text>
                  <Text className="text-sm text-gray-800 leading-5">
                    쌀 1kg을 깨끗이 씻어 물에 불렸습니다.
                  </Text>
                </View>

                <View className="flex-row items-center justify-end">
                  <Ionicons name="time-outline" size={16} color="#888" />
                  <Text className="text-xs text-gray-500 ml-1">
                    2025. 4. 5. 오후 1:09:18 작성
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
