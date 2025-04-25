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
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRecipes } from "@/lib/query/recipeQueries";
import { useCreateJournal } from "@/lib/query/journalQueries";
import { formatDateWithDay } from "@/lib/utils/dateUtils";

// 색상 정보 인터페이스 정의
interface RecipeColorInfo {
  bg: string;
  text: string;
  icon: string;
}

// 단계 인터페이스 정의
interface RecipeStage {
  id: string;
  stage_number: number;
  title?: string;
  duration_days: number;
}

// 레시피 인터페이스 정의
interface Recipe {
  id: string;
  name: string;
  type?: string;
  recipe_stages: RecipeStage[];
}

export default function JournalCreateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipe_id?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedStageNumber, setSelectedStageNumber] = useState<number | null>(
    null
  );
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [stages, setStages] = useState<RecipeStage[]>([]);

  // 레시피 목록 가져오기
  const { data: recipes, isLoading: recipesLoading } = useRecipes();

  // 양조일지 생성 훅
  const { mutate: createJournal, isPending: isSubmitting } = useCreateJournal();

  // URL 쿼리 파라미터에서 recipe_id를 가져와 자동 선택
  useEffect(() => {
    if (params.recipe_id && recipes) {
      // 레시피 ID가 URL에 있고 레시피 데이터가 로드된 경우
      const recipe = recipes.find((r: Recipe) => r.id === params.recipe_id);
      if (recipe) {
        setSelectedRecipeId(recipe.id);
        console.log(`URL에서 레시피 ID ${recipe.id}를 자동 선택했습니다`);

        // 해당 레시피의 단계 데이터도 설정
        if (recipe.recipe_stages && recipe.recipe_stages.length > 0) {
          setStages(recipe.recipe_stages);
          console.log(
            `레시피에서 ${recipe.recipe_stages.length}개의 단계 정보 로드됨`
          );
        }
      }
    }
  }, [params.recipe_id, recipes]);

  // 레시피 선택 변경 시 단계 데이터 업데이트
  useEffect(() => {
    if (selectedRecipeId && recipes) {
      const selectedRecipe = recipes.find(
        (r: Recipe) => r.id === selectedRecipeId
      );
      if (selectedRecipe) {
        // 추가적인 디버깅 로그
        console.log(
          `선택된 레시피 ID: ${selectedRecipeId}, 이름: ${selectedRecipe.name}`
        );

        if (
          selectedRecipe.recipe_stages &&
          Array.isArray(selectedRecipe.recipe_stages)
        ) {
          console.log(
            `단계 정보 확인: ${selectedRecipe.recipe_stages.length}개의 단계 발견`
          );
          // 단계 정보 자세히 로깅
          selectedRecipe.recipe_stages.forEach(
            (stage: RecipeStage, index: number) => {
              console.log(
                `단계 ${index + 1}: ID=${stage.id}, 번호=${
                  stage.stage_number
                }, 제목=${stage.title || "없음"}`
              );
            }
          );

          // 단계 정보를 상태에 설정
          setStages(selectedRecipe.recipe_stages);
        } else {
          console.log(
            `레시피에 단계 정보가 없거나 형식이 올바르지 않습니다:`,
            selectedRecipe.recipe_stages
          );
          setStages([]);
        }
      } else {
        console.log(`ID가 ${selectedRecipeId}인 레시피를 찾을 수 없습니다`);
        setStages([]);
      }
    } else {
      setStages([]);
    }
  }, [selectedRecipeId, recipes]);

  // 색상 설정
  const recipeColors: Record<string, RecipeColorInfo> = {
    "rice-wine": {
      bg: "#f4e8ff",
      text: "#a47ad1",
      icon: "flask-outline",
    },
    "fruit-wine": {
      bg: "#ffeee6",
      text: "#e8845e",
      icon: "leaf-outline",
    },
    "traditional-wine": {
      bg: "#e6f2fe",
      text: "#4a91db",
      icon: "wine-outline",
    },
    makgeolli: {
      bg: "#e7f7ee",
      text: "#56bb7f",
      icon: "beer-outline",
    },
    "clear-wine": {
      bg: "#f4e8ff",
      text: "#a47ad1",
      icon: "flask-outline",
    },
    // 한글 키도 추가
    막걸리: {
      bg: "#e7f7ee",
      text: "#56bb7f",
      icon: "beer-outline",
    },
  };

  // 선택한 레시피 정보
  const selectedRecipe = recipes?.find(
    (r: Recipe) => r.id === selectedRecipeId
  );

  // 선택된 단계 정보
  const selectedStage = stages.find(
    (s: RecipeStage) => s.stage_number === selectedStageNumber
  );

  // 선택한 레시피의 색상 정보 가져오기
  const getRecipeTypeColor = (typeValue?: string): RecipeColorInfo => {
    if (!typeValue) return recipeColors["traditional-wine"];

    // 타입 정제 (공백 제거)
    const type = typeValue.trim();

    // type이 recipeColors에 있는지 확인
    if (type in recipeColors) {
      return recipeColors[type];
    }

    // 한글 "막걸리" 체크 - makgeolli와 동일
    if (type.includes("막걸리")) {
      return recipeColors["makgeolli"];
    }

    // 없으면 기본값 반환
    return recipeColors["traditional-wine"];
  };

  const getRecipeColorInfo = (): RecipeColorInfo => {
    if (!selectedRecipe) return recipeColors["traditional-wine"];

    // 레시피 타입을 정확히 사용하되 공백 제거
    const rawType = selectedRecipe.type || "traditional-wine";
    const type = rawType.trim();

    // 디버깅 로그 추가
    console.log(
      `레시피 타입: "${rawType}" -> 정제된 타입: "${type}", 사용 가능한 타입:`,
      Object.keys(recipeColors).join(", ")
    );

    // 공통 함수 사용
    const colorInfo = getRecipeTypeColor(type);

    // 로그 출력
    if (type in recipeColors) {
      console.log(`${type} 타입에 맞는 색상 정보 사용`);
    } else if (type.includes("막걸리")) {
      console.log(`"막걸리" 타입 감지, 매핑된 색상 정보 사용`);
    } else {
      console.log(`${type} 타입에 맞는 색상 정보가 없어 기본값 사용`);
    }

    return colorInfo;
  };

  const colorInfo = getRecipeColorInfo();

  // 저장 처리 함수
  const handleSave = () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    // 디버깅 로그 추가
    console.log("저장할 데이터:", {
      title,
      description,
      recipe_id: selectedRecipeId,
      current_stage: selectedStageNumber,
      is_completed: false,
    });

    // 선택된 레시피 정보 로그
    if (selectedRecipe) {
      console.log("선택된 레시피:", {
        id: selectedRecipe.id,
        name: selectedRecipe.name,
        type: selectedRecipe.type,
        stages: stages.length,
      });
    }

    // 양조일지 데이터 생성 - Supabase 스키마에 맞게 수정
    createJournal(
      {
        title,
        description,
        recipe_id: selectedRecipeId || undefined,
        current_stage: selectedStageNumber || undefined,
      },
      {
        onSuccess: (data) => {
          console.log("일지 생성 성공:", data);
          Alert.alert("성공", "양조일지가 생성되었습니다.", [
            {
              text: "확인",
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (error) => {
          console.error("양조일지 저장 오류:", error);
          Alert.alert(
            "오류",
            "양조일지 저장에 실패했습니다. 다시 시도해주세요."
          );
        },
      }
    );
  };

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
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          >
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

        {/* 레시피 선택 */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            레시피 선택
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: isDark ? theme.neutral[800] : "white",
              borderColor: selectedRecipeId
                ? colorInfo.text
                : isDark
                ? theme.neutral[700]
                : theme.neutral[200],
            }}
            className="p-3 rounded-[12px] border-[0.5px] flex-row justify-between items-center"
            onPress={() => setIsRecipeOpen(!isRecipeOpen)}
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
                {selectedRecipe ? selectedRecipe.name : "레시피를 선택해주세요"}
              </Text>
            </View>
            <Ionicons
              name={isRecipeOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={theme.neutral[400]}
            />
          </TouchableOpacity>

          {/* 레시피 선택 드롭다운 메뉴 */}
          {isRecipeOpen && (
            <View className="mt-2 bg-white dark:bg-neutral-800 rounded-[12px] border border-neutral-200 dark:border-neutral-700 overflow-hidden max-h-64">
              {recipesLoading ? (
                <View className="p-4 items-center">
                  <ActivityIndicator
                    size="small"
                    color={theme.primary.DEFAULT}
                  />
                  <Text className="mt-2 text-neutral-500 dark:text-neutral-400">
                    레시피 로딩 중...
                  </Text>
                </View>
              ) : recipes && recipes.length > 0 ? (
                <ScrollView style={{ maxHeight: 200 }}>
                  {recipes.map((recipe: Recipe) => (
                    <TouchableOpacity
                      key={recipe.id}
                      className={`p-3 border-b border-neutral-100 dark:border-neutral-700 flex-row items-center ${
                        selectedRecipeId === recipe.id
                          ? "bg-neutral-100 dark:bg-neutral-700"
                          : ""
                      }`}
                      onPress={() => {
                        setSelectedRecipeId(recipe.id);
                        setSelectedStageNumber(null);
                        setIsRecipeOpen(false);

                        // 선택된 레시피의 단계 데이터 설정
                        if (recipe.recipe_stages) {
                          setStages(recipe.recipe_stages);
                          console.log(
                            `'${recipe.name}' 레시피 선택됨, 단계 ${recipe.recipe_stages.length}개 로드`
                          );
                        } else {
                          setStages([]);
                          console.log(
                            `'${recipe.name}' 레시피 선택됨, 단계 데이터 없음`
                          );
                        }
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: getRecipeTypeColor(recipe.type).bg,
                        }}
                        className="w-7 h-7 rounded-full items-center justify-center mr-3"
                      >
                        <Ionicons
                          name={getRecipeTypeColor(recipe.type).icon as any}
                          size={16}
                          color={getRecipeTypeColor(recipe.type).text}
                        />
                      </View>
                      <View>
                        <Text className="text-neutral-900 dark:text-neutral-100 font-medium">
                          {recipe.name}
                        </Text>
                        <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                          {recipe.type || "기타"}
                          {recipe.recipe_stages &&
                            ` • ${recipe.recipe_stages.length}단계`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View className="p-4 items-center">
                  <Text className="text-neutral-500 dark:text-neutral-400">
                    등록된 레시피가 없습니다.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* 단계 선택 - 레시피 선택 시에만 표시 */}
        {selectedRecipeId && (
          <View className="mb-6">
            <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              현재 단계 선택{" "}
              {stages.length > 0 ? `(${stages.length}단계)` : "(단계 없음)"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? theme.neutral[800] : "white",
                borderColor:
                  selectedStageNumber !== null
                    ? colorInfo.text
                    : isDark
                    ? theme.neutral[700]
                    : theme.neutral[200],
              }}
              className="p-3 rounded-[12px] border-[0.5px] flex-row justify-between items-center"
              onPress={() => {
                if (stages.length > 0) {
                  setIsStageOpen(!isStageOpen);
                } else {
                  Alert.alert("알림", "이 레시피에는 단계가 없습니다.");
                }
              }}
            >
              <Text className="text-neutral-900 dark:text-neutral-200">
                {selectedStage
                  ? selectedStage.title || `단계 ${selectedStage.stage_number}`
                  : stages.length > 0
                  ? "단계를 선택해주세요"
                  : "이 레시피에는 단계가 없습니다"}
              </Text>
              {stages.length > 0 && (
                <Ionicons
                  name={isStageOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={theme.neutral[400]}
                />
              )}
            </TouchableOpacity>

            {/* 단계 선택 드롭다운 메뉴 */}
            {isStageOpen && stages.length > 0 && (
              <View className="mt-2 bg-white dark:bg-neutral-800 rounded-[12px] border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                {stages
                  .sort((a, b) => a.stage_number - b.stage_number)
                  .map((stage) => (
                    <TouchableOpacity
                      key={stage.id}
                      className={`p-3 border-b border-neutral-100 dark:border-neutral-700 ${
                        selectedStageNumber === stage.stage_number
                          ? "bg-neutral-100 dark:bg-neutral-700"
                          : ""
                      }`}
                      onPress={() => {
                        setSelectedStageNumber(stage.stage_number);
                        setIsStageOpen(false);
                        console.log(`단계 ${stage.stage_number} 선택됨`);
                      }}
                    >
                      <View className="flex-row items-center">
                        <View className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-700 items-center justify-center mr-2">
                          <Text className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                            {stage.stage_number}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-neutral-900 dark:text-neutral-100">
                            {stage.title || `단계 ${stage.stage_number}`}
                          </Text>
                          <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                            {stage.duration_days > 0
                              ? `${stage.duration_days}일`
                              : "기간 미설정"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>
        )}

        {/* 내용 입력 */}
        <View className="mb-10">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            내용
          </Text>
          <TextInput
            style={{
              padding: 12,
              height: 120,
              backgroundColor: isDark ? theme.neutral[800] : "white",
              color: isDark ? "white" : theme.neutral[900],
              borderWidth: 0.5,
              borderColor: isDark ? theme.neutral[700] : theme.neutral[200],
              borderRadius: 12,
              textAlignVertical: "top",
            }}
            placeholder="양조일지 내용을 입력하세요"
            placeholderTextColor={theme.neutral[400]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
