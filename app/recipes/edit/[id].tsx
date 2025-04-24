import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

// 컴포넌트 불러오기
import FormHeader from "../../../components/recipe/FormHeader";
import BasicInfo from "../../../components/recipe/BasicInfo";
import IngredientsForm from "../../../components/recipe/IngredientsForm";
import StepsForm from "../../../components/recipe/StepsForm";

// API 모듈 및 Query Hooks 불러오기
import { RecipeFormData } from "../../../lib/api/recipe";
import { useRecipe, useUpdateRecipe } from "../../../lib/query/recipeQueries";
import { useAuth } from "../../../contexts/AuthContext";

type IngredientType = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isCustomUnit: boolean;
};

type StepType = {
  id: string;
  description: string;
  days: string;
};

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated, refreshSession } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("막걸리");
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [ingredients, setIngredients] = useState<IngredientType[]>([
    { id: "1", name: "", amount: "", unit: "g", isCustomUnit: false },
  ]);

  const [steps, setSteps] = useState<StepType[]>([
    { id: "1", description: "", days: "" },
  ]);

  // React Query Hooks
  const { data: recipe, isLoading, isError, error } = useRecipe(id as string);

  const updateRecipeMutation = useUpdateRecipe();

  // 데이터 로딩 - Recipe Query에서 데이터가 로드되면 폼 상태 업데이트
  useEffect(() => {
    const init = async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.error("초기화 오류:", error);
      }
    };

    init();
  }, []);

  // 레시피 데이터가 로드되면 폼 상태 업데이트
  useEffect(() => {
    if (recipe) {
      // 기본 레시피 정보 설정
      setTitle(recipe.name || "");
      setDescription(recipe.description || "");
      setCategory(recipe.type || "막걸리");
      setIsPublic(recipe.is_public);

      // 재료 정보 설정
      if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        const mappedIngredients = recipe.recipe_ingredients.map(
          (ing: any, index: number) => ({
            id: String(index + 1),
            name: ing.name || "",
            amount: String(ing.amount) || "",
            unit: ing.unit || "g",
            isCustomUnit: false,
          })
        );
        setIngredients(mappedIngredients);
      }

      // 단계 정보 설정
      if (recipe.recipe_stages && recipe.recipe_stages.length > 0) {
        // stage_number를 기준으로 오름차순 정렬
        const sortedStages = [...recipe.recipe_stages].sort(
          (a, b) => a.stage_number - b.stage_number
        );

        const mappedSteps = sortedStages.map((stage: any, index: number) => ({
          id: String(index + 1),
          description: stage.description || "",
          days: String(stage.duration_days || ""),
        }));
        setSteps(mappedSteps);
      }
    }
  }, [recipe]);

  // 레시피 업데이트 처리
  const handleUpdate = async () => {
    try {
      // 로그인 확인
      if (!isAuthenticated || !user) {
        Alert.alert("로그인 필요", "레시피를 수정하려면 로그인이 필요합니다.", [
          {
            text: "로그인 화면으로",
            onPress: () => router.push("/login"),
          },
          {
            text: "취소",
            style: "cancel",
          },
        ]);
        return;
      }

      // 유효성 검사
      if (!title.trim()) {
        Alert.alert("알림", "레시피 제목을 입력해주세요.");
        return;
      }

      if (!category) {
        Alert.alert("알림", "카테고리를 선택해주세요.");
        return;
      }

      // 재료 유효성 검사
      const hasEmptyIngredient = ingredients.some((ing) => !ing.name.trim());
      if (hasEmptyIngredient) {
        Alert.alert(
          "알림",
          "비어있는 재료가 있습니다. 모든 재료명을 입력하거나 불필요한 항목을 삭제해주세요."
        );
        return;
      }

      // 단계 유효성 검사
      const hasEmptyStep = steps.some((step) => !step.description.trim());
      if (hasEmptyStep) {
        Alert.alert(
          "알림",
          "비어있는 단계가 있습니다. 모든 단계를 입력하거나 불필요한 항목을 삭제해주세요."
        );
        return;
      }

      // 키보드 닫기
      Keyboard.dismiss();

      // 저장 중 상태로 변경
      setIsSaving(true);

      // 레시피 폼 데이터 준비
      const recipeData: Partial<RecipeFormData> = {
        title,
        description,
        category,
        is_public: isPublic,
      };

      // React Query 뮤테이션으로 업데이트
      await updateRecipeMutation.mutateAsync({
        id: id as string,
        recipeData,
        ingredients,
        steps,
      });

      // 저장 성공 알림
      Alert.alert("성공", "레시피가 수정되었습니다.", [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("레시피 수정 오류:", error);
      Alert.alert(
        "오류",
        "레시피 수정 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 재료 추가
  const addIngredient = () => {
    const newId = String(ingredients.length + 1);
    setIngredients([
      ...ingredients,
      { id: newId, name: "", amount: "", unit: "g", isCustomUnit: false },
    ]);
  };

  // 재료 제거
  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  // 재료 업데이트
  const updateIngredient = (
    id: string,
    field: keyof IngredientType,
    value: any
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  // 단계 추가
  const addStep = () => {
    const newId = String(steps.length + 1);
    setSteps([...steps, { id: newId, description: "", days: "" }]);
  };

  // 단계 제거
  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter((step) => step.id !== id));
    }
  };

  // 단계 업데이트
  const updateStep = (id: string, field: keyof StepType, value: string) => {
    setSteps(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  // 각 재료 입력 필드의 ref를 저장하기 위한 객체
  const customUnitInputRefs = useRef<{
    [key: string]: React.RefObject<TextInput> | null;
  }>({});

  // 각 재료마다 ref 생성
  const createInputRef = (id: string) => {
    if (!customUnitInputRefs.current[id]) {
      customUnitInputRefs.current[id] = React.createRef<TextInput>();
    }
    return customUnitInputRefs.current[id];
  };

  // 로딩 화면
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#4a91db" />
        <Text className="mt-4 text-neutral-500">레시피를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 에러 화면
  if (isError || !recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="px-4 py-6">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#4a91db" />
            <Text className="ml-2 text-blue-500">뒤로 가기</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
          <Text className="mt-4 text-lg text-center text-neutral-600">
            {error instanceof Error
              ? error.message
              : "레시피를 불러오는 중 오류가 발생했습니다."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* 헤더 */}
      <FormHeader
        title="레시피 수정"
        onSave={handleUpdate}
        isSaving={isSaving}
      />

      {/* 스크롤 영역 */}
      <ScrollView className="flex-1 px-4 py-4">
        {/* 기본 정보 */}
        <BasicInfo
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
        />

        {/* 재료 입력 폼 */}
        <IngredientsForm
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        {/* 단계 입력 폼 */}
        <StepsForm steps={steps} setSteps={setSteps} />
      </ScrollView>
    </SafeAreaView>
  );
}
