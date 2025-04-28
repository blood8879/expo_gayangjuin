import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Journal,
  JournalRecord,
  JournalImage,
  getJournals,
  saveJournal,
  getJournalById,
  updateJournal,
  deleteJournal,
  saveJournalRecord,
  updateJournalRecord,
  deleteJournalRecord,
  saveJournalImage,
  getJournalRecords,
  uploadJournalImage,
  listTables,
  getJournalRecordById,
  getJournalRecordImages,
  deleteJournalImage,
} from "../api/journal";
import { useAuth } from "../../contexts/AuthContext";

/**
 * 양조일지 목록을 가져오는 쿼리 훅
 */
export function useJournals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["journals", user?.id],
    queryFn: async () => {
      // 디버깅 메시지만 출력
      console.log("양조일지 데이터 조회 중...");

      return getJournals();
    },
    enabled: !!user?.id,
  });
}

/**
 * 양조일지 상세 정보를 가져오는 쿼리 훅
 */
export function useJournal(id: string) {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => getJournalById(id),
    enabled: !!id,
  });
}

/**
 * 양조일지 생성을 위한 뮤테이션 훅
 */
export function useCreateJournal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (journal: Omit<Journal, "id" | "user_id" | "created_at">) => {
      return saveJournal({
        ...journal,
        user_id: user?.id || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * 양조일지 업데이트를 위한 뮤테이션 훅
 */
export function useUpdateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, journal }: { id: string; journal: Partial<Journal> }) =>
      updateJournal(id, journal),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["journal", variables.id] });
    },
  });
}

/**
 * 양조일지 삭제를 위한 뮤테이션 훅
 */
export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * 양조일지 기록 생성을 위한 뮤테이션 훅
 */
export function useCreateJournalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: Omit<JournalRecord, "id" | "created_at">) =>
      saveJournalRecord(record),
    onSuccess: (_, variables) => {
      const { journal_id } = variables;
      queryClient.invalidateQueries({ queryKey: ["journal", journal_id] });
      queryClient.invalidateQueries({
        queryKey: ["journalRecords", journal_id],
      });
    },
  });
}

/**
 * 양조일지 기록 업데이트를 위한 뮤테이션 훅
 */
export function useUpdateJournalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: Partial<JournalRecord> & { id: string }) => {
      const { id, ...recordData } = record;
      return updateJournalRecord(id, recordData);
    },
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["journalRecord", id] });
      queryClient.invalidateQueries({ queryKey: ["journalRecordImages", id] });
      // 연결된 journal 데이터도 갱신
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

/**
 * 양조일지 기록 삭제를 위한 뮤테이션 훅
 */
export function useDeleteJournalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, journalId }: { id: string; journalId: string }) =>
      deleteJournalRecord(id),
    onSuccess: (_, variables) => {
      const { journalId } = variables;
      queryClient.invalidateQueries({ queryKey: ["journal", journalId] });
      queryClient.invalidateQueries({
        queryKey: ["journalRecords", journalId],
      });
    },
  });
}

/**
 * 이미지 업로드를 위한 뮤테이션 훅
 */
export function useUploadJournalImage() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ file, journalId }: { file: File; journalId: string }) => {
      if (!user?.id) throw new Error("사용자 인증이 필요합니다");
      return uploadJournalImage(file, user.id, journalId);
    },
  });
}

/**
 * 양조일지 이미지 저장을 위한 뮤테이션 훅
 */
export function useSaveJournalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: Omit<JournalImage, "id" | "created_at">) =>
      saveJournalImage(image),
    onSuccess: (_, variables) => {
      const { journal_entry_id } = variables;
      queryClient.invalidateQueries({
        queryKey: ["journalRecordImages", journal_entry_id],
      });
      // 연결된 journal 데이터도 갱신
      queryClient.invalidateQueries({ queryKey: ["journal"] });
    },
  });
}

/**
 * 특정 양조일지의 모든 기록 조회를 위한 쿼리 훅
 */
export function useJournalRecords(journalId: string) {
  return useQuery({
    queryKey: ["journalRecords", journalId],
    queryFn: () => getJournalRecords(journalId),
    enabled: !!journalId,
  });
}

/**
 * 단일 양조일지 기록을 가져오는 쿼리 훅
 */
export function useJournalRecord(id: string) {
  return useQuery({
    queryKey: ["journalRecord", id],
    queryFn: () => getJournalRecordById(id),
    enabled: !!id,
  });
}

/**
 * 특정 기록의 이미지를 가져오는 쿼리 훅
 */
export function useJournalRecordImages(recordId: string) {
  return useQuery({
    queryKey: ["journalRecordImages", recordId],
    queryFn: () => getJournalRecordImages(recordId),
    enabled: !!recordId,
  });
}

/**
 * 양조일지 이미지 삭제를 위한 뮤테이션 훅
 */
export function useDeleteJournalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJournalImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalRecordImages"] });
    },
  });
}
