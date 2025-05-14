import React, { useState } from "react";

import {
  LinearGradient as DefaultLinearGradient,
  LinearGradient,
} from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const {
    signInWithGoogleAuth,
    signInWithKakaoAuth,
    isLoading,
    isAuthenticated,
  } = useAuth();
  const [localLoading, setLocalLoading] = useState<string | null>(null);

  // 인증 상태가 변경될 때 자동으로 홈 화면으로 리다이렉트
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  // 구글 로그인 처리
  const handleGoogleLogin = async () => {
    try {
      setLocalLoading("google");
      await signInWithGoogleAuth();
      // 로그인 성공 시 AuthContext의 isAuthenticated가 true로 변경되면서
      // useEffect 훅에서 자동으로 리다이렉트됩니다.
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      Alert.alert(
        "로그인 실패",
        "구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLocalLoading(null);
    }
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    try {
      setLocalLoading("kakao");
      await signInWithKakaoAuth();
      // 로그인 성공 시 AuthContext의 isAuthenticated가 true로 변경되면서
      // useEffect 훅에서 자동으로 리다이렉트됩니다.
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      Alert.alert(
        "로그인 실패",
        "카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLocalLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center", // 수직 중앙 정렬
          }}
        >
          <View className="px-6 py-10">
            {/* 로고 및 헤더 */}
            <View className="items-center mb-10">
              <View className="w-24 h-24 items-center justify-center mb-6 rounded-full overflow-hidden">
                <LinearGradient
                  colors={["#8a4f7d", "#9d6090"]} // 자주색/보라색 계열 (전통주 컨셉)
                  className="absolute w-full h-full"
                />
                <Ionicons name="wine-outline" size={48} color="white" />
              </View>
              <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
                전통주 양조 기록
              </Text>
              <Text className="text-base text-neutral-500 dark:text-neutral-400 text-center mt-2">
                나만의 전통주 레시피를 기록하고 공유하세요
              </Text>
            </View>

            {/* 소셜 로그인 버튼 */}
            <View className="mb-8 space-y-4">
              {isLoading ? (
                <View className="items-center py-6">
                  <ActivityIndicator size="large" color="#10b981" />
                  <Text className="mt-2 text-emerald-600">
                    로그인 상태 확인 중...
                  </Text>
                </View>
              ) : (
                <>
                  {/* <Button
                    size="lg"
                    iconPosition="left"
                    style={{
                      borderRadius: 12,
                      height: 50,
                      backgroundColor: "white",
                      borderColor: "#000",
                      borderWidth: 1,
                    }}
                    textStyle={{ color: "#000" }}
                    onPress={handleGoogleLogin}
                    disabled={isLoading || localLoading !== null}
                  >
                    {localLoading === "google" ? (
                      <View className="flex-row items-center">
                        <ActivityIndicator size="small" color="#4285F4" />
                        <Text className="ml-2 text-neutral-600">
                          처리 중...
                        </Text>
                      </View>
                    ) : (
                      "구글로 시작하기"
                    )}
                  </Button> */}

                  <Button
                    size="lg"
                    style={{
                      backgroundColor: "#FEE500",
                      borderRadius: 12,
                      // borderWidth: 0, // 테두리 제거
                      marginTop: 16,
                      height: 50,
                    }}
                    textStyle={{ color: "#000" }}
                    onPress={handleKakaoLogin}
                    disabled={isLoading || localLoading !== null}
                  >
                    {localLoading === "kakao" ? (
                      <View className="flex-row items-center">
                        <ActivityIndicator size="small" color="#3C1E1E" />
                        <Text className="ml-2 text-neutral-600">
                          처리 중...
                        </Text>
                      </View>
                    ) : (
                      "카카오로 시작하기"
                    )}
                  </Button>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
