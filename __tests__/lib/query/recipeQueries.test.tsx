import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useRecipes,
  useRecipeById,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from '../../../lib/query/recipeQueries';

// Mock recipe API functions
jest.mock('../../../lib/api/recipe', () => ({
  getRecipes: jest.fn(),
  getRecipeById: jest.fn(),
  saveRecipe: jest.fn(),
  updateRecipe: jest.fn(),
  deleteRecipeById: jest.fn(),
}));

// Create a wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Recipe Queries', () => {
  const mockRecipeAPI = require('../../../lib/api/recipe');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipes', () => {
    it('fetches recipes successfully', async () => {
      const mockRecipes = [
        { id: '1', title: 'Recipe 1', description: 'Description 1' },
        { id: '2', title: 'Recipe 2', description: 'Description 2' },
      ];
      
      mockRecipeAPI.getRecipes.mockResolvedValue(mockRecipes);
      
      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(mockRecipes);
      expect(mockRecipeAPI.getRecipes).toHaveBeenCalled();
    });

    it('fetches recipes with user filter', async () => {
      const mockRecipes = [
        { id: '1', title: 'User Recipe', user_id: 'user123' },
      ];
      
      mockRecipeAPI.getRecipes.mockResolvedValue(mockRecipes);
      
      const { result } = renderHook(() => useRecipes('user123'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockRecipeAPI.getRecipes).toHaveBeenCalledWith('user123');
    });

    it('handles error when fetching recipes', async () => {
      const mockError = new Error('Failed to fetch recipes');
      mockRecipeAPI.getRecipes.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });

    it('handles empty recipes array', async () => {
      mockRecipeAPI.getRecipes.mockResolvedValue([]);
      
      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual([]);
    });
  });

  describe('useRecipeById', () => {
    it('fetches recipe by id successfully', async () => {
      const mockRecipe = { 
        id: '1', 
        title: 'Recipe 1', 
        description: 'Description 1',
        ingredients: [],
        steps: []
      };
      
      mockRecipeAPI.getRecipeById.mockResolvedValue(mockRecipe);
      
      const { result } = renderHook(() => useRecipeById('1'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(mockRecipe);
      expect(mockRecipeAPI.getRecipeById).toHaveBeenCalledWith('1');
    });

    it('handles error when fetching recipe by id', async () => {
      const mockError = new Error('Recipe not found');
      mockRecipeAPI.getRecipeById.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useRecipeById('1'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });

    it('does not fetch when id is undefined', () => {
      const { result } = renderHook(() => useRecipeById(undefined), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isIdle).toBe(true);
      expect(mockRecipeAPI.getRecipeById).not.toHaveBeenCalled();
    });

    it('does not fetch when id is null', () => {
      const { result } = renderHook(() => useRecipeById(null), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isIdle).toBe(true);
      expect(mockRecipeAPI.getRecipeById).not.toHaveBeenCalled();
    });

    it('does not fetch when id is empty string', () => {
      const { result } = renderHook(() => useRecipeById(''), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isIdle).toBe(true);
      expect(mockRecipeAPI.getRecipeById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateRecipe', () => {
    it('creates recipe successfully', async () => {
      const mockRecipe = { id: '1', title: 'New Recipe' };
      const recipeData = { 
        title: 'New Recipe', 
        description: 'Description',
        category: 'Test',
        is_public: true,
        user_id: 'user123'
      };
      
      mockRecipeAPI.saveRecipe.mockResolvedValue(mockRecipe);
      
      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(recipeData);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockRecipeAPI.saveRecipe).toHaveBeenCalledWith(recipeData);
      expect(result.current.data).toEqual(mockRecipe);
    });

    it('handles error when creating recipe', async () => {
      const mockError = new Error('Failed to create recipe');
      const recipeData = { 
        title: 'New Recipe', 
        description: 'Description',
        category: 'Test',
        is_public: true,
        user_id: 'user123'
      };
      
      mockRecipeAPI.saveRecipe.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(recipeData);
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });

    it('handles mutation loading state', () => {
      const recipeData = { 
        title: 'New Recipe', 
        description: 'Description',
        category: 'Test',
        is_public: true,
        user_id: 'user123'
      };
      
      mockRecipeAPI.saveRecipe.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ id: '1' }), 100))
      );
      
      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(recipeData);
      
      expect(result.current.isPending).toBe(true);
    });
  });

  describe('useUpdateRecipe', () => {
    it('updates recipe successfully', async () => {
      const mockRecipe = { id: '1', title: 'Updated Recipe' };
      const updateData = { id: '1', title: 'Updated Recipe' };
      
      mockRecipeAPI.updateRecipe.mockResolvedValue(mockRecipe);
      
      const { result } = renderHook(() => useUpdateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(updateData);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockRecipeAPI.updateRecipe).toHaveBeenCalledWith('1', updateData);
      expect(result.current.data).toEqual(mockRecipe);
    });

    it('handles error when updating recipe', async () => {
      const mockError = new Error('Failed to update recipe');
      const updateData = { id: '1', title: 'Updated Recipe' };
      
      mockRecipeAPI.updateRecipe.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useUpdateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(updateData);
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });

    it('requires id in update data', async () => {
      const updateData = { title: 'Updated Recipe' }; // missing id
      
      const { result } = renderHook(() => useUpdateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(updateData);
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useDeleteRecipe', () => {
    it('deletes recipe successfully', async () => {
      mockRecipeAPI.deleteRecipeById.mockResolvedValue(undefined);
      
      const { result } = renderHook(() => useDeleteRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate('1');
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockRecipeAPI.deleteRecipeById).toHaveBeenCalledWith('1');
    });

    it('handles error when deleting recipe', async () => {
      const mockError = new Error('Failed to delete recipe');
      mockRecipeAPI.deleteRecipeById.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useDeleteRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate('1');
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });

    it('handles delete with invalid id', async () => {
      const mockError = new Error('Recipe not found');
      mockRecipeAPI.deleteRecipeById.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useDeleteRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate('invalid-id');
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(mockRecipeAPI.deleteRecipeById).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('Query invalidation and caching', () => {
    it('uses correct query keys for different queries', () => {
      const wrapper = createWrapper();
      
      renderHook(() => useRecipes(), { wrapper });
      renderHook(() => useRecipes('user123'), { wrapper });
      renderHook(() => useRecipeById('1'), { wrapper });
      
      // Verify that different queries are called
      expect(mockRecipeAPI.getRecipes).toHaveBeenCalled();
    });

    it('handles loading states correctly', () => {
      mockRecipeAPI.getRecipes.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      
      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles successful data fetch', async () => {
      const mockData = [{ id: '1', title: 'Recipe 1' }];
      mockRecipeAPI.getRecipes.mockResolvedValue(mockData);
      
      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('handles error states correctly', async () => {
      const mockError = new Error('Network error');
      mockRecipeAPI.getRecipes.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('maintains data consistency across re-renders', async () => {
      const mockData = [{ id: '1', title: 'Recipe 1' }];
      mockRecipeAPI.getRecipes.mockResolvedValue(mockData);
      
      const { result, rerender } = renderHook(() => useRecipes(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      const initialData = result.current.data;
      
      rerender();
      
      expect(result.current.data).toEqual(initialData);
    });
  });

  describe('Mutation callbacks', () => {
    it('calls onSuccess callback for successful creation', async () => {
      const mockRecipe = { id: '1', title: 'New Recipe' };
      const onSuccess = jest.fn();
      const recipeData = { 
        title: 'New Recipe', 
        description: 'Description',
        category: 'Test',
        is_public: true,
        user_id: 'user123'
      };
      
      mockRecipeAPI.saveRecipe.mockResolvedValue(mockRecipe);
      
      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(recipeData, { onSuccess });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(onSuccess).toHaveBeenCalledWith(mockRecipe, recipeData, undefined);
    });

    it('calls onError callback for failed creation', async () => {
      const mockError = new Error('Creation failed');
      const onError = jest.fn();
      const recipeData = { 
        title: 'New Recipe', 
        description: 'Description',
        category: 'Test',
        is_public: true,
        user_id: 'user123'
      };
      
      mockRecipeAPI.saveRecipe.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useCreateRecipe(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(recipeData, { onError });
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(onError).toHaveBeenCalledWith(mockError, recipeData, undefined);
    });
  });
});