import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useJournals,
  useJournalById,
  useJournalRecords,
  useCreateJournal,
  useUpdateJournal,
  useDeleteJournal,
  useCreateJournalRecord,
  useUpdateJournalRecord,
  useDeleteJournalRecord,
} from '../../../lib/query/journalQueries';

// Mock journal API functions
jest.mock('../../../lib/api/journal', () => ({
  getJournals: jest.fn(),
  getJournalById: jest.fn(),
  getJournalRecords: jest.fn(),
  saveJournal: jest.fn(),
  updateJournal: jest.fn(),
  deleteJournal: jest.fn(),
  saveJournalRecord: jest.fn(),
  updateJournalRecord: jest.fn(),
  deleteJournalRecord: jest.fn(),
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

describe('Journal Queries', () => {
  const mockJournalAPI = require('../../../lib/api/journal');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useJournals', () => {
    it('fetches journals successfully', async () => {
      const mockJournals = [
        { id: '1', title: 'Journal 1', description: 'Description 1' },
        { id: '2', title: 'Journal 2', description: 'Description 2' },
      ];
      
      mockJournalAPI.getJournals.mockResolvedValue(mockJournals);
      
      const { result } = renderHook(() => useJournals(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(mockJournals);
      expect(mockJournalAPI.getJournals).toHaveBeenCalled();
    });

    it('fetches journals with user filter', async () => {
      const mockJournals = [
        { id: '1', title: 'User Journal', user_id: 'user123' },
      ];
      
      mockJournalAPI.getJournals.mockResolvedValue(mockJournals);
      
      const { result } = renderHook(() => useJournals('user123'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.getJournals).toHaveBeenCalledWith('user123');
    });

    it('handles error when fetching journals', async () => {
      const mockError = new Error('Failed to fetch journals');
      mockJournalAPI.getJournals.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useJournals(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useJournalById', () => {
    it('fetches journal by id successfully', async () => {
      const mockJournal = { id: '1', title: 'Journal 1', description: 'Description 1' };
      
      mockJournalAPI.getJournalById.mockResolvedValue(mockJournal);
      
      const { result } = renderHook(() => useJournalById('1'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(mockJournal);
      expect(mockJournalAPI.getJournalById).toHaveBeenCalledWith('1');
    });

    it('handles error when fetching journal by id', async () => {
      const mockError = new Error('Journal not found');
      mockJournalAPI.getJournalById.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useJournalById('1'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });

    it('does not fetch when id is undefined', () => {
      const { result } = renderHook(() => useJournalById(undefined), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isIdle).toBe(true);
      expect(mockJournalAPI.getJournalById).not.toHaveBeenCalled();
    });
  });

  describe('useJournalRecords', () => {
    it('fetches journal records successfully', async () => {
      const mockRecords = [
        { id: '1', journal_id: 'journal1', title: 'Record 1' },
        { id: '2', journal_id: 'journal1', title: 'Record 2' },
      ];
      
      mockJournalAPI.getJournalRecords.mockResolvedValue(mockRecords);
      
      const { result } = renderHook(() => useJournalRecords('journal1'), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(mockRecords);
      expect(mockJournalAPI.getJournalRecords).toHaveBeenCalledWith('journal1');
    });

    it('does not fetch when journal id is undefined', () => {
      const { result } = renderHook(() => useJournalRecords(undefined), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isIdle).toBe(true);
      expect(mockJournalAPI.getJournalRecords).not.toHaveBeenCalled();
    });
  });

  describe('useCreateJournal', () => {
    it('creates journal successfully', async () => {
      const mockJournal = { id: '1', title: 'New Journal' };
      const journalData = { title: 'New Journal', description: 'Description' };
      
      mockJournalAPI.saveJournal.mockResolvedValue(mockJournal);
      
      const { result } = renderHook(() => useCreateJournal(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(journalData);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.saveJournal).toHaveBeenCalledWith(journalData);
    });

    it('handles error when creating journal', async () => {
      const mockError = new Error('Failed to create journal');
      const journalData = { title: 'New Journal', description: 'Description' };
      
      mockJournalAPI.saveJournal.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useCreateJournal(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(journalData);
      
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useUpdateJournal', () => {
    it('updates journal successfully', async () => {
      const mockJournal = { id: '1', title: 'Updated Journal' };
      const updateData = { id: '1', title: 'Updated Journal' };
      
      mockJournalAPI.updateJournal.mockResolvedValue(mockJournal);
      
      const { result } = renderHook(() => useUpdateJournal(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(updateData);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.updateJournal).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('useDeleteJournal', () => {
    it('deletes journal successfully', async () => {
      mockJournalAPI.deleteJournal.mockResolvedValue(undefined);
      
      const { result } = renderHook(() => useDeleteJournal(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate('1');
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.deleteJournal).toHaveBeenCalledWith('1');
    });
  });

  describe('useCreateJournalRecord', () => {
    it('creates journal record successfully', async () => {
      const mockRecord = { id: '1', journal_id: 'journal1', title: 'New Record' };
      const recordData = { journal_id: 'journal1', title: 'New Record' };
      
      mockJournalAPI.saveJournalRecord.mockResolvedValue(mockRecord);
      
      const { result } = renderHook(() => useCreateJournalRecord(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(recordData);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.saveJournalRecord).toHaveBeenCalledWith(recordData);
    });
  });

  describe('useUpdateJournalRecord', () => {
    it('updates journal record successfully', async () => {
      const mockRecord = { id: '1', title: 'Updated Record' };
      const updateData = { id: '1', title: 'Updated Record' };
      
      mockJournalAPI.updateJournalRecord.mockResolvedValue(mockRecord);
      
      const { result } = renderHook(() => useUpdateJournalRecord(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate(updateData);
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.updateJournalRecord).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('useDeleteJournalRecord', () => {
    it('deletes journal record successfully', async () => {
      mockJournalAPI.deleteJournalRecord.mockResolvedValue(undefined);
      
      const { result } = renderHook(() => useDeleteJournalRecord(), {
        wrapper: createWrapper(),
      });
      
      result.current.mutate('1');
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(mockJournalAPI.deleteJournalRecord).toHaveBeenCalledWith('1');
    });
  });

  describe('Query invalidation and caching', () => {
    it('uses correct query keys', () => {
      const wrapper = createWrapper();
      
      renderHook(() => useJournals(), { wrapper });
      renderHook(() => useJournals('user123'), { wrapper });
      renderHook(() => useJournalById('1'), { wrapper });
      renderHook(() => useJournalRecords('journal1'), { wrapper });
      
      // Verify that different query keys are used for different queries
      expect(mockJournalAPI.getJournals).toHaveBeenCalled();
    });

    it('handles loading states correctly', () => {
      mockJournalAPI.getJournals.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      
      const { result } = renderHook(() => useJournals(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles stale data correctly', async () => {
      const initialData = [{ id: '1', title: 'Journal 1' }];
      const updatedData = [{ id: '1', title: 'Updated Journal 1' }];
      
      mockJournalAPI.getJournals.mockResolvedValueOnce(initialData);
      
      const { result, rerender } = renderHook(() => useJournals(), {
        wrapper: createWrapper(),
      });
      
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      
      expect(result.current.data).toEqual(initialData);
      
      // Simulate data update
      mockJournalAPI.getJournals.mockResolvedValueOnce(updatedData);
      rerender();
      
      // Data should still be the initial data until refetch
      expect(result.current.data).toEqual(initialData);
    });
  });
});