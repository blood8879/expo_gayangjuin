import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecipes,
  getRecipeById,
  saveRecipe,
  saveIngredients,
  saveSteps,
  updateRecipe,
  updateIngredients,
  updateSteps,
  RecipeFormData,
} from "../api/recipe";
import { recipeKeys } from "./queryClient";
import { useAuth } from "../../contexts/AuthContext";

/**
 * 레시피 목록을 가져오는 쿼리 훅
 */
export function useRecipes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: () => getRecipes(user?.id),
    enabled: !!user?.id,
  });
}

/**
 * 레시피 상세 정보를 가져오는 쿼리 훅
 */
export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipeById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
}

/**
 * 레시피 생성을 위한 뮤테이션 훅
 */
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recipeData,
      ingredients,
      steps,
    }: {
      recipeData: RecipeFormData;
      ingredients: any[];
      steps: any[];
    }) => {
      const savedRecipe = await saveRecipe(recipeData);
      const recipeId = savedRecipe.id;

      const ingredientsData = ingredients.map((ing) => ({
        recipe_id: recipeId,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        stage: 1,
      }));

      const stepsData = steps.map((step, index) => ({
        recipe_id: recipeId,
        description: step.description,
        duration_days: parseInt(step.days) || 0,
        stage_number: index + 1,
        title: `단계 ${index + 1}`,
      }));

      await Promise.all([
        saveIngredients(ingredientsData),
        saveSteps(stepsData),
      ]);

      return savedRecipe;
    },
    onSuccess: () => {
      // 레시피 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * 레시피 수정을 위한 뮤테이션 훅
 */
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      recipeData,
      ingredients,
      steps,
    }: {
      id: string;
      recipeData: Partial<RecipeFormData>;
      ingredients: any[];
      steps: any[];
    }) => {
      const updatedRecipe = await updateRecipe(id, recipeData);

      const ingredientsData = ingredients.map((ing) => ({
        recipe_id: id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        stage: 1,
      }));

      const stepsData = steps.map((step, index) => ({
        recipe_id: id,
        description: step.description,
        duration_days: parseInt(step.days) || 0,
        stage_number: index + 1,
        title: `단계 ${index + 1}`,
      }));

      await Promise.all([
        updateIngredients(id, ingredientsData),
        updateSteps(id, stepsData),
      ]);

      return updatedRecipe;
    },
    onSuccess: (data, variables) => {
      // 해당 레시피 상세 쿼리와 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}
