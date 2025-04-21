import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 생성
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_KEY as string,
  {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// 로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 현재 세션 가져오기
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

// 현재 사용자 가져오기
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Recipe 타입 정의
export type Recipe = {
  id?: string;
  title: string;
  description: string;
  category: string;
  is_public: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
};

// Ingredient 타입 정의
export type Ingredient = {
  id?: string;
  recipe_id: string;
  name: string;
  amount: string;
  unit: string;
  created_at?: string;
};

// Step 타입 정의
export type Step = {
  id?: string;
  recipe_id: string;
  description: string;
  days: string;
  order: number;
  created_at?: string;
};

// 레시피 저장 함수
export async function saveRecipe(recipe: Recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipe])
    .select();

  if (error) {
    throw error;
  }

  return data?.[0];
}

// 레시피 재료 저장 함수
export async function saveIngredients(
  ingredients: Omit<Ingredient, "id" | "created_at">[]
) {
  const { data, error } = await supabase
    .from("ingredients")
    .insert(ingredients)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// 레시피 단계 저장 함수
export async function saveSteps(steps: Omit<Step, "id" | "created_at">[]) {
  const { data, error } = await supabase.from("steps").insert(steps).select();

  if (error) {
    throw error;
  }

  return data;
}
