import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../constants/theme";
import {
  useJournal,
  useUpdateJournalRecord,
  useJournalRecord,
  useJournalRecordImages,
  useUploadJournalImage,
  useSaveJournalImage,
  useDeleteJournalImage,
} from "../../../lib/query/journalQueries";
import { formatDateWithDay } from "../../../lib/utils/dateUtils";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { decode } from "base64-arraybuffer";

// 레시피 단계 타입 정의
interface RecipeStage {
  id: string | number;
  stage_number: number;
  title?: string;
  description?: string;
  duration_days?: number;
}

interface JournalRecordImage {
  id: string;
  journal_entry_id: string;
  image_url: string;
  created_at: string;
}

export default function EditRecordScreen() {
  const router = useRouter();
  const { id, recordId } = useLocalSearchParams<{
    id: string;
    recordId: string;
  }>();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [temperature, setTemperature] = useState("");
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<JournalRecordImage[]>(
    []
  );
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [recordDate, setRecordDate] = useState("");

  // 양조일지 정보 가져오기
  const {
    data: journal,
    isLoading: journalLoading,
    isError: journalError,
  } = useJournal(id as string);

  // 레코드 정보 가져오기
  const {
    data: record,
    isLoading: recordLoading,
    isError: recordError,
  } = useJournalRecord(recordId as string);

  // 레코드 이미지 가져오기
  const {
    data: recordImages,
    isLoading: imagesLoading,
    isError: imagesError,
  } = useJournalRecordImages(recordId as string);

  // 레코드 업데이트 훅
  const { mutate: updateRecord, isPending: isSubmitting } =
    useUpdateJournalRecord();

  // 이미지 저장 훅
  const { mutate: saveImage } = useSaveJournalImage();

  // 이미지 삭제 훅
  const { mutate: deleteImage } = useDeleteJournalImage();

  // 양조일지에 연결된 레시피의 단계 목록
  const recipeStages = journal?.recipes?.recipe_stages || [];

  // 레코드 로드 시 기존 데이터로 폼 초기화
  useEffect(() => {
    if (record) {
      setTitle(record.title || "");
      setMemo(record.note || "");
      setTemperature(record.temperature ? String(record.temperature) : "");
      setRecordDate(formatDateWithDay(record.created_at));

      // 현재 단계 설정
      if (record.stage) {
        const stageObj = recipeStages.find(
          (stage: RecipeStage) => stage.stage_number === record.stage
        );
        if (stageObj) {
          setSelectedStageId(String(stageObj.id));
        }
      }
    }
  }, [record, recipeStages]);

  // 이미지 로드
  useEffect(() => {
    if (recordImages) {
      setExistingImages(recordImages);
    }
  }, [recordImages]);

  // 사진 추가 기능
  const handleAddImage = async () => {
    // 작업 선택 알림창 표시
    Alert.alert(
      "사진 추가",
      "사진을 추가할 방법을 선택하세요",
      [
        {
          text: "사진 촬영",
          onPress: () => pickImageFromCamera(),
        },
        {
          text: "앨범에서 선택",
          onPress: () => pickImageFromGallery(),
        },
        {
          text: "취소",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // 카메라로 사진 촬영
  const pickImageFromCamera = async () => {
    // 카메라 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("알림", "카메라 접근 권한이 필요합니다.");
      return;
    }

    // 카메라 실행
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true, // Base64 데이터 요청
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImages([...images, result.assets[0].base64]);
    }
  };

  // 갤러리에서 사진 선택
  const pickImageFromGallery = async () => {
    // 사진 라이브러리 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("알림", "사진 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    // 갤러리 실행
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true, // Base64 데이터 요청
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImages([...images, result.assets[0].base64]);
    }
  };

  // 새 이미지 삭제
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 기존 이미지 삭제
  const handleRemoveExistingImage = (id: string) => {
    setExistingImages(existingImages.filter((img) => img.id !== id));
    setDeletedImageIds([...deletedImageIds, id]);
  };

  // 이미지를 supabase storage에 업로드하는 함수
  const uploadImageToSupabase = async (
    base64String: string
  ): Promise<string | null> => {
    try {
      console.log(
        "Base64 데이터로 업로드 시작 (길이:",
        base64String.length,
        ")"
      );

      // 파일 이름 생성 (고유한 이름 보장)
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      // Base64 문자열에서 파일 확장자 추정
      let fileExt = "jpeg"; // 기본값
      if (base64String.startsWith("data:image/png")) fileExt = "png";
      else if (base64String.startsWith("data:image/gif")) fileExt = "gif";

      const filePath = `${user?.id}/${id}/${fileName}.${fileExt}`;
      console.log("업로드 경로:", filePath);

      // Base64 디코딩하여 ArrayBuffer 생성
      const arrayBuffer = decode(base64String);
      console.log("ArrayBuffer 생성 완료, 크기:", arrayBuffer.byteLength);

      // Supabase storage 업로드 (ArrayBuffer 사용)
      console.log("Supabase storage 업로드 시작:", "journal-images");
      const { data, error } = await supabase.storage
        .from("journal-images")
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        console.error("이미지 업로드 에러 상세:", JSON.stringify(error));
        return null;
      }

      console.log("업로드 성공, 결과:", data);

      // 업로드된 이미지의 공개 URL 가져오기
      const { data: publicURL } = supabase.storage
        .from("journal-images")
        .getPublicUrl(filePath);

      console.log("공개 URL 생성:", publicURL);
      return publicURL.publicUrl;
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      if (error instanceof Error) {
        console.error("에러 메시지:", error.message);
        console.error("에러 스택:", error.stack);
      } else {
        console.error("에러 타입:", typeof error);
        console.error("에러 값:", JSON.stringify(error));
      }
      return null;
    }
  };

  // 저장 버튼 처리
  const handleSave = async () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      // 선택된 단계 객체 찾기
      const selectedStageObject = recipeStages.find(
        (stage: RecipeStage) => String(stage.id) === selectedStageId
      );

      // 1. 레코드 업데이트
      const recordData = {
        id: recordId as string,
        title: title,
        note: memo,
        temperature: temperature ? parseFloat(temperature) : null,
        stage: selectedStageObject ? selectedStageObject.stage_number : null,
      } as any;

      console.log("업데이트할 레코드 데이터:", recordData);

      // 2. 레코드 업데이트 수행
      updateRecord(recordData, {
        onSuccess: async (updatedRecord) => {
          console.log("레코드 업데이트 성공:", updatedRecord);

          let processSuccess = true;

          // 3. 삭제할 이미지 처리
          if (deletedImageIds.length > 0) {
            try {
              for (const imageId of deletedImageIds) {
                await deleteImage(imageId);
              }
              console.log("이미지 삭제 완료:", deletedImageIds);
            } catch (deleteErr) {
              console.error("이미지 삭제 중 오류:", deleteErr);
              processSuccess = false;
            }
          }

          // 4. 새 이미지 업로드 및 연결
          if (images.length > 0) {
            const uploadPromises = [];

            // 각 이미지 업로드 처리
            for (const imageBase64 of images) {
              try {
                const uploadedUrl = await uploadImageToSupabase(imageBase64);

                if (uploadedUrl) {
                  // 업로드된 이미지와 기록 연결
                  const imageData = {
                    journal_entry_id: recordId as string,
                    image_url: uploadedUrl,
                  };
                  console.log("저장할 이미지 데이터:", imageData);
                  uploadPromises.push(saveImage(imageData));
                } else {
                  console.warn(
                    "이미지 업로드 실패 (Base64 길이:",
                    imageBase64.length,
                    ")"
                  );
                  processSuccess = false;
                }
              } catch (err) {
                console.error(
                  "이미지 처리 중 오류 (Base64 길이:",
                  imageBase64.length,
                  "):",
                  err
                );
                processSuccess = false;
              }
            }

            // 모든 이미지 업로드 완료 대기
            try {
              await Promise.all(uploadPromises);
              console.log("모든 이미지 처리 완료");
            } catch (imageSaveError) {
              console.error("이미지 메타데이터 저장 중 오류:", imageSaveError);
              processSuccess = false;
            }
          }

          setIsUploading(false);

          if (!processSuccess) {
            Alert.alert(
              "주의",
              "일부 이미지 업로드/삭제에 실패했지만, 기록은 저장되었습니다."
            );
            router.back();
          } else {
            Alert.alert("성공", "양조일지 기록이 수정되었습니다.", [
              {
                text: "확인",
                onPress: () => router.back(),
              },
            ]);
          }
        },
        onError: (error) => {
          setIsUploading(false);
          Alert.alert(
            "오류",
            "양조일지 기록 수정에 실패했습니다. 다시 시도해주세요."
          );
          console.error("양조일지 기록 수정 오류:", error);
        },
      });
    } catch (error) {
      setIsUploading(false);
      Alert.alert("오류", "처리 중 오류가 발생했습니다.");
      console.error("저장 중 오류:", error);
    }
  };

  // 선택된 단계 정보 (UI 표시에 사용됨)
  const selectedStage = recipeStages.find(
    (stage: RecipeStage) => String(stage.id) === selectedStageId
  );

  // 로딩 상태 표시
  if (journalLoading || recordLoading || imagesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
        <Text className="mt-4 text-neutral-500">데이터를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 에러 상태 처리
  if (journalError || recordError || imagesError || !journal || !record) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-neutral-600">
            데이터를 불러오는데 실패했습니다.
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
        <Text className="text-lg font-medium text-gray-800">기록 수정</Text>
        <TouchableOpacity
          className="px-4 py-1.5 bg-blue-600 rounded-[12px]"
          onPress={handleSave}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? (
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
            <Text className="ml-2 text-base text-gray-800">{recordDate}</Text>
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
            {/* 기존 이미지 표시 */}
            {existingImages.map((image) => (
              <View key={image.id} className="w-1/3 aspect-square p-1 relative">
                <Image
                  source={{ uri: image.image_url }}
                  className="w-full h-full rounded-[8px]"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-[8px] p-1"
                  onPress={() => handleRemoveExistingImage(image.id)}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}

            {/* 새로 추가한 이미지 표시 */}
            {images.map((imageBase64, index) => (
              <View
                key={`new-${index}`}
                className="w-1/3 aspect-square p-1 relative"
              >
                <Image
                  source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
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
