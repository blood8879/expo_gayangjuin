import { 
  saveRecipe,
  saveIngredients,
  saveSteps,
  getRecipes,
  getRecipeById,
  deleteRecipeById,
  saveLegacyRecipe,
  saveLegacyIngredients,
  saveLegacySteps,
  updateRecipe,
  updateIngredients,
  updateSteps,
  Recipe,
  Ingredient,
  Step,
  RecipeFormData
} from '../../../lib/api/recipe';
import { supabase } from '../../../lib/supabase';

// Mock supabase
jest.mock('../../../lib/supabase', () => {
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    abortSignal: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    csv: jest.fn().mockResolvedValue({ data: null, error: null }),
    geojson: jest.fn().mockResolvedValue({ data: null, error: null }),
    explain: jest.fn().mockResolvedValue({ data: null, error: null }),
    rollback: jest.fn().mockResolvedValue({ data: null, error: null }),
    returns: jest.fn().mockReturnThis(),
    then: jest.fn((resolve) => resolve({ data: [], error: null })),
  };

  return {
    supabase: {
      from: jest.fn(() => mockQueryBuilder),
      rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
    },
  };
});

describe('Recipe API Functions', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  describe('saveRecipe', () => {
    const mockRecipeFormData: RecipeFormData = {
      title: 'Test Recipe',
      description: 'Test Description',
      category: 'Test Category',
      is_public: true,
      user_id: 'user123',
    };

    it('should save recipe successfully', async () => {
      const mockResponse = { 
        id: 'recipe123',
        name: 'Test Recipe',
        type: 'Test Category',
        description: 'Test Description',
        is_public: true,
        user_id: 'user123',
      };

      // Create proper mock chain
      const mockChain = {
        select: jest.fn().mockResolvedValue({
          data: [mockResponse],
          error: null,
        }),
      };
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockChain),
      } as any);

      const result = await saveRecipe(mockRecipeFormData);

      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when save fails', async () => {
      const mockError = new Error('Database error');
      
      const mockChain = {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockChain),
      } as any);

      await expect(saveRecipe(mockRecipeFormData)).rejects.toThrow(mockError);
      expect(console.error).toHaveBeenCalledWith('레시피 저장 에러:', mockError);
    });

    it('should return undefined when no data returned', async () => {
      const mockChain = {
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockChain),
      } as any);

      const result = await saveRecipe(mockRecipeFormData);
      expect(result).toBeUndefined();
    });
  });

  describe('getRecipes', () => {
    const mockRecipes = [
      {
        id: 'recipe1',
        name: 'Recipe 1',
        type: 'Category 1',
        description: 'Description 1',
        recipe_stages: [{ id: 'stage1' }],
      },
      {
        id: 'recipe2',
        name: 'Recipe 2',
        type: 'Category 2',
        description: 'Description 2',
        recipe_stages: [],
      },
    ];

    it('should get all recipes successfully', async () => {
      const mockChain = {
        order: jest.fn().mockResolvedValue({
          data: mockRecipes,
          error: null,
        }),
      };
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockChain),
      } as any);

      const result = await getRecipes();

      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(result).toEqual(mockRecipes);
      expect(console.log).toHaveBeenCalledWith('총 2개의 레시피를 로드했습니다.');
    });

    it('should get recipes for specific user', async () => {
      const mockChain = {
        order: jest.fn().mockResolvedValue({
          data: mockRecipes,
          error: null,
        }),
      };
      
      const mockEq = {
        eq: jest.fn().mockReturnValue(mockChain),
      };
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockEq),
      } as any);

      const userId = 'user123';
      const result = await getRecipes(userId);

      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(result).toEqual(mockRecipes);
    });
  });

  describe('deleteRecipeById', () => {
    it('should delete recipe and related data successfully', async () => {
      // Mock all three delete operations
      mockSupabase.from
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          }),
        } as any)
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          }),
        } as any)
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          }),
        } as any);

      const result = await deleteRecipeById('recipe123');

      expect(mockSupabase.from).toHaveBeenCalledWith('recipe_ingredients');
      expect(mockSupabase.from).toHaveBeenCalledWith('recipe_stages');
      expect(mockSupabase.from).toHaveBeenCalledWith('recipes');
      expect(result).toEqual({ success: true, id: 'recipe123' });
    });
  });
});