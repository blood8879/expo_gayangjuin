import { supabase } from "../supabase";

// Recipe 인터페이스 - 데이터베이스 스키마와 일치하도록 정의
export interface Recipe {
  id?: string;
  name: string; // 타이틀(제목) 필드
  type: string; // 카테고리 필드
  description: string;
  is_public: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  cover_image_url?: string;
  total_duration_days?: number;
  estimated_abv?: number;
}

// Ingredient 인터페이스
export interface Ingredient {
  id?: string;
  recipe_id: string;
  name: string;
  amount: string;
  unit: string;
  stage: number;
  created_at?: string;
}

// Step 인터페이스
export interface Step {
  id?: string;
  recipe_id: string;
  description: string;
  duration_days: number;
  stage_number: number;
  title: string;
  created_at?: string;
}

// UI에서 사용하는 데이터 타입
export interface RecipeFormData {
  title: string; // UI에서는 title로 사용
  description: string;
  category: string; // UI에서는 category로 사용
  is_public: boolean;
  user_id: string;
}

/**
 * 레시피 저장 함수
 * UI에서 사용하는 필드명을 DB 스키마에 맞게 변환하여 저장
 */
export async function saveRecipe(recipeData: RecipeFormData) {
  // UI 데이터를 DB 스키마 형식으로 변환
  const dbRecipe: Recipe = {
    name: recipeData.title, // title -> name으로 변환
    type: recipeData.category, // category -> type으로 변환
    description: recipeData.description,
    is_public: recipeData.is_public,
    user_id: recipeData.user_id,
  };

  const { data, error } = await supabase
    .from("recipes")
    .insert([dbRecipe])
    .select();

  if (error) {
    console.error("레시피 저장 에러:", error);
    throw error;
  }

  return data?.[0];
}

/**
 * 레시피 재료 저장 함수
 */
export async function saveIngredients(
  ingredients: Omit<Ingredient, "id" | "created_at">[]
) {
  const { data, error } = await supabase
    .from("recipe_ingredients")
    .insert(ingredients)
    .select();

  if (error) {
    console.error("레시피 재료 저장 에러:", error);
    throw error;
  }

  return data;
}

/**
 * 레시피 단계 저장 함수
 */
export async function saveSteps(steps: Omit<Step, "id" | "created_at">[]) {
  // stagesData에 title 필드 포함
  const stagesData = steps.map((step) => ({
    recipe_id: step.recipe_id,
    description: step.description,
    duration_days: step.duration_days,
    stage_number: step.stage_number,
    title: step.title,
  }));

  const { data, error } = await supabase
    .from("recipe_stages")
    .insert(stagesData)
    .select();

  if (error) {
    console.error("레시피 단계 저장 에러:", error);
    throw error;
  }

  return data;
}

/**
 * 레시피 목록 조회 함수
 */
export async function getRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("레시피 목록 조회 에러:", error);
    throw error;
  }

  return data;
}

/**
 * 레시피 상세 조회 함수
 */
export async function getRecipeById(id: string) {
  console.log(`Retrieving recipe with ID: ${id}`);

  // 스키마 디버깅: 테이블 스키마 확인
  try {
    // 레시피 테이블 스키마 확인
    const { data: recipeSchema } = await supabase
      .from("recipes")
      .select("*")
      .limit(1);

    if (recipeSchema && recipeSchema.length > 0) {
      console.log("RECIPE TABLE SCHEMA:", Object.keys(recipeSchema[0]));
    }

    // 레시피 단계 테이블 스키마 확인
    const { data: stageSchema } = await supabase
      .from("recipe_stages")
      .select("*")
      .limit(1);

    if (stageSchema && stageSchema.length > 0) {
      console.log("RECIPE_STAGES TABLE SCHEMA:", Object.keys(stageSchema[0]));
    }
  } catch (e) {
    console.error("Schema inspection failed:", e);
  }

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      recipe_ingredients(*),
      recipe_stages(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("레시피 상세 조회 에러:", error);
    throw error;
  }

  // 성공 시 결과 로깅
  if (data) {
    console.log(
      `Successfully retrieved recipe: ${data.id} - ${data.name}, Type: ${data.type}`
    );
    console.log(`Number of stages: ${data.recipe_stages?.length || 0}`);
    if (data.recipe_stages && data.recipe_stages.length > 0) {
      console.log(
        `Sample stage keys: ${Object.keys(data.recipe_stages[0]).join(", ")}`
      );
    }
  }

  return data;
}

/**
 * 기존 스키마와의 호환성을 위한 함수들
 */
export async function saveLegacyRecipe(recipe: {
  title: string;
  description: string;
  category: string;
  is_public: boolean;
  user_id: string;
}) {
  // UI 데이터를 DB 스키마 형식으로 변환
  const dbRecipe: Recipe = {
    name: recipe.title,
    type: recipe.category,
    description: recipe.description,
    is_public: recipe.is_public,
    user_id: recipe.user_id,
  };

  const { data, error } = await supabase
    .from("recipes")
    .insert([dbRecipe])
    .select();

  if (error) {
    console.error("레시피 저장 에러:", error);
    throw error;
  }

  return data?.[0];
}

export async function saveLegacyIngredients(
  ingredients: Omit<
    { recipe_id: string; name: string; amount: string; unit: string },
    "id" | "created_at"
  >[]
) {
  const { data, error } = await supabase
    .from("ingredients")
    .insert(ingredients)
    .select();

  if (error) {
    console.error("레시피 재료 저장 에러:", error);
    throw error;
  }

  return data;
}

export async function saveLegacySteps(
  steps: Omit<
    { recipe_id: string; description: string; days: string; order: number },
    "id" | "created_at"
  >[]
) {
  const { data, error } = await supabase.from("steps").insert(steps).select();

  if (error) {
    console.error("레시피 단계 저장 에러:", error);
    throw error;
  }

  return data;
}

/**
 * 레시피 업데이트 함수
 */
export async function updateRecipe(
  id: string,
  recipeData: Partial<RecipeFormData>
) {
  // UI 데이터를 DB 스키마 형식으로 변환
  const dbRecipe: Partial<Recipe> = {};

  if (recipeData.title !== undefined) dbRecipe.name = recipeData.title;
  if (recipeData.category !== undefined) dbRecipe.type = recipeData.category;
  if (recipeData.description !== undefined)
    dbRecipe.description = recipeData.description;
  if (recipeData.is_public !== undefined)
    dbRecipe.is_public = recipeData.is_public;

  const { data, error } = await supabase
    .from("recipes")
    .update(dbRecipe)
    .eq("id", id)
    .select();

  if (error) {
    console.error("레시피 업데이트 에러:", error);
    throw error;
  }

  return data?.[0];
}

/**
 * 레시피 재료 업데이트 함수 (기존 재료 삭제 후 새로 추가)
 */
export async function updateIngredients(
  recipeId: string,
  ingredients: Omit<Ingredient, "id" | "created_at">[]
) {
  // 1. 기존 재료 데이터 삭제
  const { error: deleteError } = await supabase
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", recipeId);

  if (deleteError) {
    console.error("레시피 재료 삭제 에러:", deleteError);
    throw deleteError;
  }

  // 2. 새 재료 데이터 추가
  if (ingredients.length === 0) return []; // 새 재료가 없으면 빈 배열 반환

  const { data, error } = await supabase
    .from("recipe_ingredients")
    .insert(ingredients)
    .select();

  if (error) {
    console.error("레시피 재료 업데이트 에러:", error);
    throw error;
  }

  return data;
}

/**
 * 레시피 단계 업데이트 함수 (기존 단계 삭제 후 새로 추가)
 */
export async function updateSteps(
  recipeId: string,
  steps: Omit<Step, "id" | "created_at">[]
) {
  // 1. 기존 단계 데이터 삭제
  const { error: deleteError } = await supabase
    .from("recipe_stages")
    .delete()
    .eq("recipe_id", recipeId);

  if (deleteError) {
    console.error("레시피 단계 삭제 에러:", deleteError);
    throw deleteError;
  }

  // 2. 새 단계 데이터 추가
  if (steps.length === 0) return []; // 새 단계가 없으면 빈 배열 반환

  // stagesData에 title 필드 포함 (기존 saveSteps와 동일한 처리)
  const stagesData = steps.map((step) => ({
    recipe_id: step.recipe_id,
    description: step.description,
    duration_days: step.duration_days,
    stage_number: step.stage_number,
    title: step.title,
  }));

  const { data, error } = await supabase
    .from("recipe_stages")
    .insert(stagesData)
    .select();

  if (error) {
    console.error("레시피 단계 업데이트 에러:", error);
    throw error;
  }

  return data;
}
