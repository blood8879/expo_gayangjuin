import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

type BasicInfoProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
};

export default function BasicInfo({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  isPublic,
  setIsPublic,
}: BasicInfoProps) {
  const categories = ["막걸리", "맥주", "와인", "기타"];

  const inputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const multilineInputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base min-h-[80px] rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base min-h-[80px]";

  return (
    <View className="mb-4 bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">기본 정보</Text>

      <View className="mb-4">
        <Text className="text-base font-medium text-gray-600 mb-2">제목</Text>
        <TextInput
          className={inputClass}
          value={title}
          onChangeText={setTitle}
          placeholder="레시피 제목을 입력하세요"
        />
      </View>

      <View className="mb-4">
        <Text className="text-base font-medium text-gray-600 mb-2">소개</Text>
        <TextInput
          className={multilineInputClass}
          value={description}
          onChangeText={setDescription}
          placeholder="레시피에 대한 간단한 소개를 입력하세요"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View className="mb-4">
        <Text className="text-base font-medium text-gray-600 mb-2">
          카테고리
        </Text>
        <View className="flex-row flex-wrap">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              className={`border rounded-full py-2 px-3.5 mr-2 mb-2 ${
                category === cat
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-gray-300 bg-gray-50"
              }`}
              onPress={() => setCategory(cat)}
            >
              <Text
                className={`text-sm ${
                  category === cat ? "text-white" : "text-gray-600"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-base font-medium text-gray-600 mb-2">
          공개 설정
        </Text>
        <View className="flex-row border border-gray-200 rounded-[8px] overflow-hidden">
          <TouchableOpacity
            className={`flex-1 py-3 items-center ${
              isPublic ? "bg-emerald-500" : "bg-white"
            }`}
            onPress={() => setIsPublic(true)}
          >
            <Text
              className={`font-medium ${
                isPublic ? "text-white" : "text-gray-600"
              }`}
            >
              공개
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center ${
              !isPublic ? "bg-emerald-500" : "bg-gray-50"
            }`}
            onPress={() => setIsPublic(false)}
          >
            <Text
              className={`font-medium ${
                !isPublic ? "text-white" : "text-gray-600"
              }`}
            >
              비공개
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
