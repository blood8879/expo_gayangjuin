import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IngredientFormProps = {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
};

type Ingredient = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isCustomUnit: boolean;
};

export default function IngredientsForm({
  ingredients,
  setIngredients,
}: IngredientFormProps) {
  // 단위 선택 모달 상태
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);

  // 자주 사용되는 단위 목록
  const commonUnits = ["g", "kg", "ml", "L", "개", "Tbsp", "tsp", "직접 입력"];

  // 각 재료 입력 필드의 ref를 저장하기 위한 객체
  const customUnitInputRefs = useRef<{
    [key: string]: React.RefObject<TextInput> | null;
  }>({});

  // 재료 추가 함수
  const addIngredient = () => {
    const newId = String(ingredients.length + 1);
    setIngredients([
      ...ingredients,
      { id: newId, name: "", amount: "", unit: "g", isCustomUnit: false },
    ]);
  };

  // 재료 삭제 함수
  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  // 재료 정보 업데이트 함수
  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string | boolean
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  // 단위 선택 처리 함수
  const handleUnitSelection = (unit: string, ingredientId: string) => {
    if (unit === "직접 입력") {
      // 직접 입력 모드로 전환
      setIngredients(
        ingredients.map((ing) =>
          ing.id === ingredientId
            ? { ...ing, isCustomUnit: true, unit: "" }
            : ing
        )
      );
    } else {
      // 단위 선택
      setIngredients(
        ingredients.map((ing) =>
          ing.id === ingredientId ? { ...ing, isCustomUnit: false, unit } : ing
        )
      );
    }
    setShowUnitModal(false);
    setSelectedIngredientId(null);
  };

  // 각 재료마다 ref 생성
  const createInputRef = (id: string) => {
    if (!customUnitInputRefs.current[id]) {
      customUnitInputRefs.current[id] = React.createRef<TextInput>();
    }
    return customUnitInputRefs.current[id];
  };

  // 스타일 클래스
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

  const customUnitInputClass =
    Platform.OS === "android"
      ? "flex-1 mr-2 w-[60px] h-12 text-center border-2 border-emerald-400 p-3 text-base rounded-[8px] bg-white"
      : "flex-1 mr-2 w-[60px] h-12 text-center border-2 border-emerald-400 p-3 bg-white text-base rounded-[8px]";

  return (
    <View className="mb-4 bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">재료</Text>

      {ingredients.map((ingredient) => (
        <View key={ingredient.id} className="flex-row items-center mb-3">
          <TextInput
            className={ingredientNameClass}
            value={ingredient.name}
            onChangeText={(value) =>
              updateIngredient(ingredient.id, "name", value)
            }
            placeholder="재료명"
          />

          <TextInput
            className={ingredientAmountClass}
            value={ingredient.amount}
            onChangeText={(value) =>
              updateIngredient(ingredient.id, "amount", value)
            }
            placeholder="양"
            keyboardType="numeric"
          />

          {ingredient.isCustomUnit ? (
            <TextInput
              ref={createInputRef(ingredient.id)}
              className={customUnitInputClass}
              value={ingredient.unit}
              onChangeText={(value) =>
                updateIngredient(ingredient.id, "unit", value)
              }
              placeholder="직접 입력"
              blurOnSubmit={false}
              returnKeyType="done"
              selectTextOnFocus={false}
            />
          ) : (
            <TouchableOpacity
              className={`${ingredientUnitClass} justify-center items-center flex-row`}
              onPress={() => {
                setSelectedIngredientId(ingredient.id);
                setShowUnitModal(true);
              }}
            >
              <Text className="text-gray-700">{ingredient.unit || "단위"}</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#666"
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="p-1"
            onPress={() => removeIngredient(ingredient.id)}
            disabled={ingredients.length === 1}
          >
            <Ionicons
              name="close-circle"
              size={24}
              color={ingredients.length === 1 ? "#ccc" : "#ff6b6b"}
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        className="flex-row items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg mt-2"
        onPress={addIngredient}
      >
        <Ionicons name="add-circle" size={20} color="#10b981" />
        <Text className="ml-2 text-emerald-600 font-medium">재료 추가</Text>
      </TouchableOpacity>

      {/* 단위 선택 모달 */}
      <Modal
        visible={showUnitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowUnitModal(false);
          setSelectedIngredientId(null);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-4 w-[250px] shadow-xl">
            <Text className="text-lg font-bold text-gray-800 mb-3 text-center">
              단위 선택
            </Text>

            {commonUnits.map((unit) => (
              <TouchableOpacity
                key={unit}
                className="py-3 px-4 border-b border-gray-100"
                onPress={() => {
                  if (selectedIngredientId) {
                    handleUnitSelection(unit, selectedIngredientId);
                  }
                }}
              >
                <Text className="text-center text-gray-700">{unit}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-3 py-2 px-4 bg-gray-200 rounded-lg"
              onPress={() => {
                setShowUnitModal(false);
                setSelectedIngredientId(null);
              }}
            >
              <Text className="text-center text-gray-700">취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
