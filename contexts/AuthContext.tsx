import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signOut as supabaseSignOut,
  getCurrentUser,
  getCurrentSession,
} from "../lib/api/auth";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import {
  getProfile,
  KakaoProfile,
  login,
} from "@react-native-seoul/kakao-login";
import { router } from "expo-router";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogleAuth: () => Promise<void>;
  signInWithKakaoAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  signInWithGoogleAuth: async () => {},
  signInWithKakaoAuth: async () => {},
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 상태 체크
  const refreshSession = async () => {
    try {
      setIsLoading(true);
      console.log("세션 새로고침 시도 중...");

      // 세션 가져오기
      const currentSession = await getCurrentSession();
      console.log("현재 세션 상태:", currentSession ? "있음" : "없음");

      setSession(currentSession);

      // 사용자 정보 가져오기
      if (currentSession) {
        const currentUser = await getCurrentUser();
        console.log("사용자 정보 가져옴:", currentUser?.id);
        setUser(currentUser);
      } else {
        console.log("세션이 없어 사용자 정보를 null로 설정");
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 상태 확인 오류:", error);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로그인 상태 확인
  useEffect(() => {
    refreshSession();

    // 세션 변경 감지 이벤트 리스너 설정
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth 상태 변경:", event);
        setSession(newSession);

        if (newSession) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      }
    );

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 구글 로그인
  const signInWithGoogleAuth = async () => {
    try {
      setIsLoading(true);

      // 세션 확인 및 사용자 정보 가져오기
      await refreshSession();

      return;
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인
  const signInWithKakaoAuth = async () => {
    console.log("✅ handleKakaoSignIn 함수 실행됨");

    try {
      setIsLoading(true);
      console.log("🔄 카카오 로그인 시도 중...");

      let token;
      try {
        token = await login();
        console.log("🔥 token:", token);
      } catch (error) {
        console.error("🔥 login() 내부에서 에러 발생:", error);
        throw error;
      }

      // console.log("✅ 카카오 로그인 성공:", token);

      if (!token || !token.accessToken) {
        throw new Error("카카오 로그인 실패: 액세스 토큰이 없음");
      }

      console.log("🔄 카카오 프로필 가져오는 중...");
      const kakaoProfile: KakaoProfile = await getProfile();
      console.log("✅ Kakao profile:", kakaoProfile);

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        token: token.idToken,
      });

      if (error) {
        console.error("❌ Supabase 로그인 오류:", error);
        Alert.alert("로그인 실패", "Supabase 로그인 중 오류 발생.");
        return;
      }

      console.log("✅ Supabase 로그인 성공:", data.user?.id);

      // 로그인 성공 후 세션 상태 갱신
      setSession(data.session);
      setUser(data.user);

      // 로그인 완료 후 세션 상태 확인
      setTimeout(async () => {
        await refreshSession();
        console.log("로그인 후 세션 확인 완료");
        router.replace("/(tabs)"); // 로그인 후 이동
      }, 500);
    } catch (error: any) {
      console.error("❌ Kakao sign-in error (전체):", error);
      Alert.alert(
        "로그인 실패",
        error.message || "카카오 로그인 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
      await WebBrowser.coolDownAsync();
    }
  };

  // 로그아웃
  const signOutUser = async () => {
    try {
      setIsLoading(true);
      console.log("로그아웃 시도 중...");
      await supabaseSignOut();
      console.log("로그아웃 성공");
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("로그아웃 오류:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signInWithGoogleAuth,
        signInWithKakaoAuth,
        signOut: signOutUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
