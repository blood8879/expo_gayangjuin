import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useJournal, useCreateJournalRecord } from "@/lib/query/journalQueries";
import { formatDateWithDay } from "@/lib/utils/dateUtils";

// 레시피 단계 타입 정의
interface RecipeStage {
  id: string | number;
  stage_number: number;
  title?: string;
  description?: string;
  duration_days?: number;
}

export default function AddRecordScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [temperature, setTemperature] = useState("");
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // 양조일지 정보 가져오기
  const {
    data: journal,
    isLoading: journalLoading,
    isError,
  } = useJournal(id as string);

  // 레코드 생성 훅
  const { mutate: createRecord, isPending: isSubmitting } =
    useCreateJournalRecord();

  // 현재 일자
  const currentDate = formatDateWithDay(new Date().toISOString());

  // 양조일지에 연결된 레시피의 단계 목록
  const recipeStages = journal?.recipes?.recipe_stages || [];

  // 양조일지 로드 시 현재 단계를 자동으로 선택
  useEffect(() => {
    if (journal && journal.current_stage) {
      // current_stage는 stage_number(숫자)이므로 해당 숫자와 일치하는 단계의 ID를 찾아서 설정
      const currentStage = recipeStages.find(
        (stage: RecipeStage) => stage.stage_number === journal.current_stage
      );

      if (currentStage) {
        setSelectedStageId(String(currentStage.id));
      }
    }
  }, [journal, recipeStages]);

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
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    console.log("저장할 기록 데이터:", {
      title,
      memo,
      temperature: temperature ? parseFloat(temperature) : undefined,
      stage_id: selectedStageId || undefined,
      images: images.length > 0 ? images : undefined,
    });

    // 양조일지 기록 데이터 생성
    createRecord(
      {
        journal_id: id as string,
        title: title,
        note: memo,
        temperature: temperature ? parseFloat(temperature) : null,
        stage: selectedStageId ? parseInt(selectedStageId) : null,
        // images는 별도 처리
      } as any,
      {
        onSuccess: () => {
          Alert.alert("성공", "양조일지 기록이 저장되었습니다.", [
            {
              text: "확인",
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (error) => {
          Alert.alert(
            "오류",
            "양조일지 기록 저장에 실패했습니다. 다시 시도해주세요."
          );
          console.error("양조일지 기록 저장 오류:", error);
        },
      }
    );
  };

  // 선택된 단계 정보
  const selectedStage = recipeStages.find(
    (stage: RecipeStage) => String(stage.id) === selectedStageId
  );

  // 로딩 상태 표시
  if (journalLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
        <Text className="mt-4 text-neutral-500">
          양조일지 정보를 불러오는 중...
        </Text>
      </SafeAreaView>
    );
  }

  // 에러 상태 처리
  if (isError || !journal) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-neutral-600">
            양조일지 정보를 불러오는데 실패했습니다.
          </Text>
          <TouchableOpacity
            className="mt-6 px-4 py-2 bg-primary-600 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">
              이전 화면으로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-medium">저장</Text>
          )}
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

          <View className="flex-row items-center mb-4">
            <Text className="w-16 text-base font-medium text-gray-800">
              제목
            </Text>
            <TextInput
              className="flex-1 ml-2 p-2 border border-gray-200 rounded-[8px] text-base text-gray-800 bg-white"
              placeholder="기록 제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="flex-row items-center mb-2">
            <Text className="w-16 text-base font-medium text-gray-800">
              단계
            </Text>
            <View className="ml-2 flex-1">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-gray-100 px-3 py-2 rounded-[8px]"
                onPress={() => setIsStageDropdownOpen(!isStageDropdownOpen)}
              >
                <Text className="text-base text-gray-800">
                  {selectedStage
                    ? selectedStage.title ||
                      `단계 ${selectedStage.stage_number}`
                    : "단계를 선택해주세요"}
                </Text>
                <Ionicons
                  name={isStageDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#666"
                />
              </TouchableOpacity>

              {isStageDropdownOpen && recipeStages.length > 0 && (
                <View className="mt-2 bg-white border border-gray-200 rounded-[8px] overflow-hidden">
                  {recipeStages
                    .sort(
                      (a: RecipeStage, b: RecipeStage) =>
                        a.stage_number - b.stage_number
                    )
                    .map((stage: RecipeStage) => (
                      <TouchableOpacity
                        key={String(stage.id)}
                        className={`py-2 px-3 ${
                          selectedStageId === String(stage.id)
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onPress={() => {
                          setSelectedStageId(String(stage.id));
                          setIsStageDropdownOpen(false);
                        }}
                      >
                        <Text
                          className={`${
                            selectedStageId === String(stage.id)
                              ? "text-blue-600 font-medium"
                              : "text-gray-800"
                          }`}
                        >
                          {stage.title || `단계 ${stage.stage_number}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}

              {isStageDropdownOpen && recipeStages.length === 0 && (
                <View className="mt-2 bg-white border border-gray-200 rounded-[8px] p-3">
                  <Text className="text-gray-500 text-center">
                    등록된 단계가 없습니다
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="p-4 bg-white mb-2">
          <Text className="text-base font-medium text-gray-800 mb-3">
            환경 정보
          </Text>

          <View className="flex-row mb-4">
            <View className="flex-1">
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
          <Text className="text-base font-medium text-gray-800 mb-3">내용</Text>

          <TextInput
            className="w-full min-h-[120px] border border-gray-300 rounded-[8px] p-3 text-base text-gray-800"
            placeholder="양조 과정에 대한 내용을 입력하세요..."
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
