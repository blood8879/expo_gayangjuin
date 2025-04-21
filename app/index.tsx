import { useEffect } from "react";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";

// 스플래시 화면 유지
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // 인증 정보 로드 완료 시 스플래시 화면 숨김
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // 인증 상태에 따라 적절한 화면으로 리디렉션
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}
