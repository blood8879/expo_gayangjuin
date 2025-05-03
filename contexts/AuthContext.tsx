import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signOut as supabaseSignOut,
  getCurrentUser,
  getCurrentSession,
} from "../lib/api/auth";
import { supabase } from "../lib/supabase";
import { User, Session } from "@supabase/supabase-js";

import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { login, me } from "@react-native-kakao/user";

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
      GoogleSignin.configure({
        webClientId:
          "464345605389-619ib62kn4sm2oojv9ljnmi3i5p9maq9.apps.googleusercontent.com",
        offlineAccess: true,
      });

      const userInfo = await GoogleSignin.signInSilently();

      console.log("🔥 userInfo:", userInfo);

      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        console.log(error, data);
      } else {
        throw new Error("no ID token present!");
      }
      // 세션 확인 및 사용자 정보 가져오기
      await refreshSession();

      return;
    } catch (error) {
      console.error("구글 로그인 오류:", JSON.stringify(error, null, 2));
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

      // const token = await login();
      // console.log("🔥 token:", token);
      // const userInfo = await me();
      // console.log("🔥 userInfo:", userInfo);

      Promise.all([login(), me()]).then(async ([token, userInfo]) => {
        console.log("🔥 token:", token);
        console.log("🔥 userInfo:", userInfo);
        if (!token || !token.idToken) {
          // 사용자에게 알림을 표시하거나 다른 방식으로 처리할 수 있습니다.
          Alert.alert("로그인 실패", "로그인을 다시 시도해 주세요.");
          // idToken이 없으면 Supabase 로그인을 시도할 수 없으므로 함수를 종료합니다.
          // 또는 accessToken만 사용하는 다른 로직을 수행할 수 있습니다.
          return;
        }

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "kakao",
          token: token.idToken,
        });

        setSession(data.session);
        setUser(data.user);

        setTimeout(async () => {
          await refreshSession();
          if (data.user?.id) {
            router.replace("/(tabs)"); // 로그인 후 이동
          }
        }, 500);
      });
    } catch (error: any) {
      console.error("❌ Kakao sign-in error (전체):", error);
      Alert.alert(
        "로그인 실패",
        error.message || "카카오 로그인 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
      // await WebBrowser.coolDownAsync();
    }
  };

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
