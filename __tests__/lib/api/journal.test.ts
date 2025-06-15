// Create a chainable mock query builder that works with all Supabase operations
const createMockQueryBuilder = () => {
  const queryBuilder = {
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
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    csv: jest.fn().mockResolvedValue({ data: '', error: null }),
    // Make it a thenable so it can be awaited
    then: jest.fn((resolve) => {
      return Promise.resolve({ data: [], error: null }).then(resolve);
    }),
  };
  return queryBuilder;
};

// Mock Supabase
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => createMockQueryBuilder()),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'mock-url' } })),
      })),
    },
  },
}));

import {
  saveJournal,
  saveJournalRecord,
  getJournals,
  getJournalById,
  updateJournal,
  updateJournalRecord,
  deleteJournal,
  deleteJournalRecord,
  saveJournalImage,
  getJournalRecords,
  uploadJournalImage,
  listTables,
  getJournalRecordById,
  getJournalRecordImages,
  deleteJournalImage,
  Journal,
  JournalRecord,
  JournalImage,
  JournalFormData,
  JournalRecordFormData,
} from '../../../lib/api/journal';

import { supabase } from '../../../lib/supabase';

// Mock console methods to avoid noise during tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Journal API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('saveJournal', () => {
    it('should save a journal successfully', async () => {
      const mockJournal = {
        id: 'journal-id',
        title: 'Test Journal',
        recipe_id: 'recipe-id',
        user_id: 'user-id',
        start_date: '2023-01-01',
        expected_completion: '2023-12-31',
        status: 'active' as const,
        notes: 'Test notes',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: [mockJournal], error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const journalData: JournalFormData = {
        title: 'Test Journal',
        recipe_id: 'recipe-id',
        user_id: 'user-id',
        start_date: '2023-01-01',
        expected_completion: '2023-12-31',
        status: 'active',
        notes: 'Test notes',
      };

      const result = await saveJournal(journalData);

      expect(result).toEqual(mockJournal);
      expect(supabase.from).toHaveBeenCalledWith('journals');
    });

    it('should handle save journal error', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: null, error: new Error('Database error') }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const journalData: JournalFormData = {
        title: 'Test Journal',
        recipe_id: 'recipe-id',
        user_id: 'user-id',
        start_date: '2023-01-01',
        expected_completion: '2023-12-31',
        status: 'active',
        notes: 'Test notes',
      };

      await expect(saveJournal(journalData)).rejects.toThrow('Database error');
    });
  });

  describe('getJournals', () => {
    it('should get all journals successfully', async () => {
      const mockJournals = [
        {
          id: 'journal-1',
          title: 'Journal 1',
          recipe_id: 'recipe-1',
          user_id: 'user-1',
          start_date: '2023-01-01',
          expected_completion: '2023-12-31',
          status: 'active' as const,
          notes: 'Notes 1',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        },
      ];

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: mockJournals, error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await getJournals();

      expect(result).toEqual(mockJournals);
    });

    it('should get journals for specific user', async () => {
      const mockJournals = [
        {
          id: 'journal-1',
          title: 'Journal 1',
          recipe_id: 'recipe-1',
          user_id: 'user-1',
          start_date: '2023-01-01',
          expected_completion: '2023-12-31',
          status: 'active' as const,
          notes: 'Notes 1',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        },
      ];

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: mockJournals, error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await getJournals('user-1');

      expect(result).toEqual(mockJournals);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user-1');
    });

    it('should throw error when fetch fails', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: null, error: new Error('Database error') }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(getJournals()).rejects.toThrow('Database error');
    });

    it('should handle null/undefined user_id', async () => {
      const mockJournals = [];

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: mockJournals, error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await getJournals(null);
      expect(mockQueryBuilder.eq).not.toHaveBeenCalled();

      await getJournals(undefined);
      expect(mockQueryBuilder.eq).not.toHaveBeenCalled();
    });
  });

  describe('getJournalById', () => {
    it('should get journal by ID successfully', async () => {
      const mockJournal = {
        id: 'journal-1',
        title: 'Journal 1',
        recipe_id: 'recipe-1',
        user_id: 'user-1',
        start_date: '2023-01-01',
        expected_completion: '2023-12-31',
        status: 'active' as const,
        notes: 'Notes 1',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.single = jest.fn().mockResolvedValue({ data: mockJournal, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await getJournalById('journal-1');

      expect(result).toEqual(mockJournal);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'journal-1');
    });

    it('should throw error when journal not found', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.single = jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(getJournalById('nonexistent')).rejects.toThrow('Not found');
    });
  });

  describe('updateJournal', () => {
    it('should update journal successfully', async () => {
      const updatedJournal = {
        id: 'journal-1',
        title: 'Updated Journal',
        recipe_id: 'recipe-1',
        user_id: 'user-1',
        start_date: '2023-01-01',
        expected_completion: '2023-12-31',
        status: 'completed' as const,
        notes: 'Updated notes',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.single = jest.fn().mockResolvedValue({ data: updatedJournal, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const updateData = {
        title: 'Updated Journal',
        status: 'completed' as const,
        notes: 'Updated notes',
      };

      const result = await updateJournal('journal-1', updateData);

      expect(result).toEqual(updatedJournal);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'journal-1');
    });

    it('should handle update error', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.single = jest.fn().mockResolvedValue({ data: null, error: new Error('Update failed') });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const updateData = { title: 'Updated Journal' };

      await expect(updateJournal('journal-1', updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteJournal', () => {
    it('should delete journal successfully', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: null, error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await deleteJournal('journal-1');

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'journal-1');
    });

    it('should handle delete error', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: null, error: new Error('Delete failed') }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(deleteJournal('journal-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('saveJournalRecord', () => {
    it('should save journal record successfully', async () => {
      const mockRecord = {
        id: 'record-1',
        journal_id: 'journal-1',
        title: 'Test Record',
        content: 'Test content',
        date: '2023-01-01',
        temperature: 25,
        humidity: 60,
        ph: 4.5,
        brix: 12,
        specific_gravity: 1.045,
        alcohol_content: 5.5,
        notes: 'Test notes',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      };

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.single = jest.fn().mockResolvedValue({ data: mockRecord, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const recordData: JournalRecordFormData = {
        journal_id: 'journal-1',
        title: 'Test Record',
        content: 'Test content',
        date: '2023-01-01',
        temperature: 25,
        humidity: 60,
        ph: 4.5,
        brix: 12,
        specific_gravity: 1.045,
        alcohol_content: 5.5,
        notes: 'Test notes',
      };

      const result = await saveJournalRecord(recordData);

      expect(result).toEqual(mockRecord);
    });

    it('should handle save record error', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.single = jest.fn().mockResolvedValue({ data: null, error: new Error('Save failed') });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const recordData: JournalRecordFormData = {
        journal_id: 'journal-1',
        title: 'Test Record',
        content: 'Test content',
        date: '2023-01-01',
      };

      await expect(saveJournalRecord(recordData)).rejects.toThrow('Save failed');
    });
  });

  describe('getJournalRecords', () => {
    it('should get journal records successfully', async () => {
      const mockRecords = [
        {
          id: 'record-1',
          journal_id: 'journal-1',
          title: 'Record 1',
          content: 'Content 1',
          date: '2023-01-01',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        },
      ];

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: mockRecords, error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await getJournalRecords('journal-1');

      expect(result).toEqual(mockRecords);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('journal_id', 'journal-1');
    });

    it('should handle fetch records error', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: null, error: new Error('Fetch failed') }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(getJournalRecords('journal-1')).rejects.toThrow('Fetch failed');
    });
  });

  describe('uploadJournalImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const mockStorage = {
        upload: jest.fn().mockResolvedValue({ data: { path: 'uploads/test.jpg' }, error: null }),
      };
      
      (supabase.storage.from as jest.Mock).mockReturnValue(mockStorage);

      const result = await uploadJournalImage(mockFile, 'journal-1');

      expect(result).toBe('uploads/test.jpg');
      expect(mockStorage.upload).toHaveBeenCalled();
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const mockStorage = {
        upload: jest.fn().mockResolvedValue({ data: null, error: new Error('Upload failed') }),
      };
      
      (supabase.storage.from as jest.Mock).mockReturnValue(mockStorage);

      await expect(uploadJournalImage(mockFile, 'journal-1')).rejects.toThrow('Upload failed');
    });
  });

  describe('listTables', () => {
    it('should list tables successfully', async () => {
      const mockTables = [{ table_name: 'journals' }, { table_name: 'journal_records' }];

      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: mockTables, error: null }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      const result = await listTables();

      expect(result).toEqual(mockTables);
    });

    it('should handle list tables error', async () => {
      const mockQueryBuilder = createMockQueryBuilder();
      mockQueryBuilder.then = jest.fn((resolve) => {
        return Promise.resolve({ data: null, error: new Error('List failed') }).then(resolve);
      });
      
      (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);

      await expect(listTables()).rejects.toThrow('List failed');
    });
  });
});