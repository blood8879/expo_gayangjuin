import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 컴포넌트 불러오기
import FormHeader from "../../components/recipe/FormHeader";
import BasicInfo from "../../components/recipe/BasicInfo";
import IngredientsForm from "../../components/recipe/IngredientsForm";
import StepsForm from "../../components/recipe/StepsForm";

// 새로운 API 모듈에서 함수 불러오기
import { RecipeFormData } from "../../lib/api/recipe";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateRecipe } from "@/lib/query/recipeQueries";

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

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, refreshSession } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("막걸리");
  const [isPublic, setIsPublic] = useState(true);

  // React Query 훅 사용
  const { mutate: createRecipe, isPending: isSaving } = useCreateRecipe();

  const [ingredients, setIngredients] = useState<IngredientType[]>([
    { id: "1", name: "", amount: "", unit: "g", isCustomUnit: false },
  ]);

  const [steps, setSteps] = useState<StepType[]>([
    { id: "1", description: "", days: "" },
  ]);

  // 초기 데이터 로딩 (임시 저장된 레시피)
  useEffect(() => {
    // 처음 한 번만 세션 확인
    const init = async () => {
      try {
        await refreshSession();
        await loadTempRecipe();
      } catch (error) {
        console.error("초기화 오류:", error);
      }
    };

    init();
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 임시 저장 데이터 로드 함수
  const loadTempRecipe = async () => {
    try {
      const tempRecipeString = await AsyncStorage.getItem("temp-recipe");

      if (tempRecipeString) {
        const tempRecipe = JSON.parse(tempRecipeString);

        // 임시 저장 데이터로 상태 복원
        setTitle(tempRecipe.title || "");
        setDescription(tempRecipe.description || "");
        setCategory(tempRecipe.category || "막걸리");
        setIsPublic(tempRecipe.isPublic);

        if (tempRecipe.ingredients && tempRecipe.ingredients.length > 0) {
          setIngredients(tempRecipe.ingredients);
        }

        if (tempRecipe.steps && tempRecipe.steps.length > 0) {
          setSteps(tempRecipe.steps);
        }

        // 데이터를 불러온 후 임시 저장 데이터 삭제
        await AsyncStorage.removeItem("temp-recipe");

        // 알림 표시
        Alert.alert("알림", "임시 저장된 레시피를 불러왔습니다.");
      }
    } catch (error) {
      console.error("임시 레시피 로드 오류:", error);
    }
  };

  const handleSave = async () => {
    try {
      // 로그인 확인
      if (!isAuthenticated || !user) {
        // 현재 작성 중인 레시피 데이터 임시 저장
        const tempRecipeData = {
          title,
          description,
          category,
          isPublic,
          ingredients,
          steps,
        };

        // AsyncStorage에 임시 저장
        await AsyncStorage.setItem(
          "temp-recipe",
          JSON.stringify(tempRecipeData)
        );

        Alert.alert(
          "로그인 필요",
          "레시피를 저장하려면 로그인이 필요합니다. 작성 중인 내용은 임시 저장됩니다.",
          [
            {
              text: "로그인 화면으로",
              onPress: () => router.push("/login"),
            },
            {
              text: "취소",
              style: "cancel",
            },
          ]
        );
        return;
      }

      // 폼 유효성 검사
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

      // 사용자 ID 사용 (인증된 사용자의 ID 사용)
      const userId = user.id;

      // 레시피 폼 데이터 준비
      const recipeData: RecipeFormData = {
        title,
        description,
        category,
        is_public: isPublic,
        user_id: userId,
      };

      // React Query 뮤테이션 사용
      createRecipe(
        {
          recipeData,
          ingredients: ingredients.map((ing) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          })),
          steps: steps.map((step) => ({
            description: step.description,
            days: step.days,
          })),
        },
        {
          onSuccess: () => {
            // 저장 성공 알림
            Alert.alert("성공", "레시피가 저장되었습니다.", [
              {
                text: "확인",
                onPress: () => router.back(),
              },
            ]);
          },
          onError: (error) => {
            console.error("레시피 저장 오류:", error);
            Alert.alert(
              "오류",
              "레시피 저장 중 오류가 발생했습니다. 다시 시도해주세요."
            );
          },
        }
      );
    } catch (error) {
      console.error("레시피 저장 오류:", error);
      Alert.alert(
        "오류",
        "레시피 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
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

  const categories = ["막걸리", "맥주", "와인", "기타"];

  const inputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const multilineInputClass =
    Platform.OS === "android"
      ? "border border-gray-200 p-3 text-base min-h-[80px] rounded-[8px]"
      : "border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base min-h-[80px]";

  const smallInputClass =
    Platform.OS === "android"
      ? "w-16 border border-gray-200 p-1.5 bg-white text-center mr-1 rounded-[8px]"
      : "w-16 border border-gray-300 rounded-[8px] p-1.5 bg-white text-center mr-1";

  // 재료 입력 필드용 클래스 추가
  const ingredientNameClass =
    Platform.OS === "android"
      ? "flex-2 mr-2 h-12 min-w-[120px] border border-gray-200 p-3 text-base rounded-[8px]"
      : "flex-2 mr-2 h-12 min-w-[120px] border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const ingredientAmountClass =
    Platform.OS === "android"
      ? "flex-1 mr-2 w-[80px] h-12 text-center border border-gray-200 p-3 text-base rounded-[8px]"
      : "flex-1 mr-2 w-[80px] h-12 text-center border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const ingredientUnitClass =
    Platform.OS === "android"
      ? "flex-1 mr-2 w-[60px] h-12 text-center border border-gray-200 p-3 text-base rounded-[8px]"
      : "flex-1 mr-2 w-[60px] h-12 text-center border border-gray-300 rounded-[8px] p-3 bg-gray-50 text-base";

  const [unitPickerVisible, setUnitPickerVisible] = useState<string | null>(
    null
  );

  // 자주 사용되는 단위 목록과 '직접 입력' 옵션
  const commonUnits = ["g", "kg", "ml", "L", "개", "Tbsp", "tsp", "직접 입력"];

  // 모달 방식으로 단위 선택기 구현을 위한 상태
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);
  const [showUnitModal, setShowUnitModal] = useState(false);

  // 입력 필드 값 변경 처리 함수 - 별도 분리하여 리렌더링 최소화
  const handleUnitChange = (id: string, value: string) => {
    // 단위 값만 변경하고 isCustomUnit은 유지
    updateIngredient(id, "unit", value);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* 헤더 */}
      <FormHeader
        title="레시피 만들기"
        onSave={handleSave}
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
