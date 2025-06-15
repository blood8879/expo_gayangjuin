import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// 환경 변수 확인
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase 환경 변수가 설정되지 않았습니다:");
  console.error("EXPO_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.error("EXPO_PUBLIC_SUPABASE_KEY:", !!supabaseKey);
  throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
}

// Supabase 클라이언트 생성
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
