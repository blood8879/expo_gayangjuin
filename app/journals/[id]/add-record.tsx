import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function AddRecordScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [memo, setMemo] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedStage, setSelectedStage] = useState("쌀을 불린다");

  // 현재 날짜 포맷팅
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];

    setCurrentDate(`${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`);
  }, []);

  // 사진 추가 기능 (실제 구현은 필요)
  const handleAddImage = () => {
    // 더미 이미지 추가 (실제로는 이미지 피커 사용)
    setImages([...images, "https://via.placeholder.com/150"]);
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 저장 버튼 처리
  const handleSave = () => {
    // 여기에 저장 로직을 구현
    // 실제로는 API 호출 또는 상태 관리를 통해 데이터 저장
    router.back();
  };

  // 단계 선택 옵션
  const stageOptions = [
    "쌀을 불린다",
    "죽을 쑨다.",
    "밑술을 한다",
    "덧술을 한다",
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-medium text-gray-800">기록 추가</Text>
        <TouchableOpacity
          className="px-4 py-1.5 bg-blue-600 rounded-[12px]"
          onPress={handleSave}
        >
          <Text className="text-white font-medium">저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 bg-white mb-2">
          <View className="flex-row items-center mb-4">
            <Text className="w-16 text-base font-medium text-gray-800">
              일시
            </Text>
            <Text className="ml-2 text-base text-gray-800">{currentDate}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Text className="w-16 text-base font-medium text-gray-800">
              단계
            </Text>
            <View className="ml-2 flex-1">
              <TouchableOpacity className="flex-row items-center justify-between bg-gray-100 px-3 py-2 rounded-[8px]">
                <Text className="text-base text-gray-800">{selectedStage}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>

              {/* 실제 구현에서는 모달 또는 드롭다운으로 대체 */}
              <View className="mt-2 bg-white border border-gray-200 rounded-[8px] overflow-hidden">
                {stageOptions.map((stage, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`py-2 px-3 ${
                      selectedStage === stage ? "bg-blue-50" : ""
                    }`}
                    onPress={() => setSelectedStage(stage)}
                  >
                    <Text
                      className={`${
                        selectedStage === stage
                          ? "text-blue-600 font-medium"
                          : "text-gray-800"
                      }`}
                    >
                      {stage}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="p-4 bg-white mb-2">
          <Text className="text-base font-medium text-gray-800 mb-3">
            환경 정보
          </Text>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-sm text-gray-600 mb-1">온도 (°C)</Text>
              <View className="flex-row items-center border border-gray-300 rounded-[8px] px-3 py-2">
                <Ionicons name="thermometer-outline" size={18} color="#666" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  placeholder="25"
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-sm text-gray-600 mb-1">습도 (%)</Text>
              <View className="flex-row items-center border border-gray-300 rounded-[8px] px-3 py-2">
                <Ionicons name="water-outline" size={18} color="#666" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  placeholder="60"
                  value={humidity}
                  onChangeText={setHumidity}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="p-4 bg-white mb-2">
          <Text className="text-base font-medium text-gray-800 mb-3">사진</Text>

          <View className="flex-row flex-wrap">
            {images.map((image, index) => (
              <View key={index} className="w-1/3 aspect-square p-1 relative">
                <Image
                  source={{ uri: image }}
                  className="w-full h-full rounded-[8px]"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-[8px] p-1"
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              className="w-1/3 aspect-square p-1"
              onPress={handleAddImage}
            >
              <View className="w-full h-full border-2 border-dashed border-gray-300 rounded-[8px] flex items-center justify-center">
                <Ionicons name="camera" size={28} color="#666" />
                <Text className="text-xs text-gray-500 mt-1">사진 추가</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="p-4 bg-white mb-6">
          <Text className="text-base font-medium text-gray-800 mb-3">메모</Text>

          <TextInput
            className="w-full min-h-[120px] border border-gray-300 rounded-[8px] p-3 text-base text-gray-800"
            placeholder="양조 과정에 대한 메모를 입력하세요..."
            value={memo}
            onChangeText={setMemo}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
