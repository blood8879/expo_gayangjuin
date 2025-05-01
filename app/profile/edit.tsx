import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profileImage: string | null;
}

export default function EditProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser, refreshSession } = useAuth();

  // 편집할 프로필 정보
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    profileImage: null,
  });

  // 사용자 정보 로드
  const fetchUserProfile = async () => {
    if (!authUser) {
      setError("로그인이 필요합니다");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("full_name, email, bio, avatar_url")
        .eq("id", authUser.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setProfile({
          name: data.full_name || authUser.user_metadata?.full_name || "",
          email: data.email || authUser.email || "",
          bio: data.bio || "",
          profileImage: data.avatar_url || null,
        });
      }
    } catch (err: any) {
      console.error("사용자 프로필 로드 오류:", err);
      setError("프로필 정보를 불러오는 데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 프로필 정보 로드
  useEffect(() => {
    fetchUserProfile();
  }, [authUser]);

  // 필드 값 변경 처리
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 프로필 저장
  const handleSave = async () => {
    if (!authUser) {
      Alert.alert("오류", "로그인 상태를 확인할 수 없습니다");
      return;
    }

    // 이름이 비어있는지 확인
    if (!profile.name.trim()) {
      Alert.alert("오류", "이름을 입력해주세요");
      return;
    }

    try {
      setIsSaving(true);

      // Supabase users 테이블 업데이트
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: profile.name,
          bio: profile.bio,
          // avatar_url은 별도 처리 필요
        })
        .eq("id", authUser.id);

      if (updateError) throw updateError;

      // Auth 사용자 메타데이터도 업데이트 (UI에 즉시 반영되도록)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: profile.name },
      });

      if (metadataError) {
        console.error("사용자 메타데이터 업데이트 오류:", metadataError);
      }

      // Auth 컨텍스트의 사용자 정보 갱신
      await refreshSession();

      Alert.alert("성공", "프로필이 업데이트되었습니다", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error("프로필 업데이트 오류:", err);
      Alert.alert("오류", "프로필 업데이트에 실패했습니다");
    } finally {
      setIsSaving(false);
    }
  };

  // 뒤로가기 처리
  const handleGoBack = () => {
    router.back();
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
        <Text className="mt-4 text-neutral-500 dark:text-neutral-400">
          프로필 정보를 불러오는 중...
        </Text>
      </SafeAreaView>
    );
  }

  // 오류 발생 시
  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.status.error}
        />
        <Text className="mt-4 text-red-500 text-center px-4">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-primary-500 rounded-full px-6 py-3"
          onPress={fetchUserProfile}
        >
          <Text className="text-white font-medium">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
        <StatusBar style="auto" />

        {/* 상단 헤더 */}
        <View
          className="flex-row items-center px-4 pt-4 pb-2 border-b border-neutral-200 dark:border-neutral-700"
          style={{ borderBottomWidth: 1 }}
        >
          <TouchableOpacity
            onPress={handleGoBack}
            className="p-2"
            style={{ backgroundColor: "transparent" }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.neutral[700]} />
          </TouchableOpacity>

          <Text className="flex-1 text-center text-lg font-bold text-neutral-900 dark:text-white">
            프로필 수정
          </Text>

          {/* 우측 상단 저장 버튼 제거 */}
          <View style={{ width: 40 }} />
        </View>

        <ScrollView className="flex-1 px-5 pt-4 pb-20">
          {/* 프로필 이미지 */}
          <View className="items-center my-6">
            <View className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 items-center justify-center mb-3">
              {profile.profileImage ? (
                <Image
                  source={{ uri: profile.profileImage }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={40} color={theme.neutral[400]} />
              )}
            </View>
            <TouchableOpacity
              className="bg-neutral-100 dark:bg-neutral-800 py-1 px-4 rounded-full"
              disabled={isSaving}
            >
              <Text className="text-primary-500 font-medium">사진 변경</Text>
            </TouchableOpacity>
          </View>

          {/* 이름 입력 */}
          <View className="mb-4">
            <Text className="text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
              이름
            </Text>
            <TextInput
              value={profile.name}
              onChangeText={(text) => handleChange("name", text)}
              className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-lg text-neutral-900 dark:text-white"
              placeholder="이름을 입력하세요"
              placeholderTextColor={theme.neutral[400]}
              editable={!isSaving}
            />
          </View>

          {/* 이메일 입력 */}
          <View className="mb-4">
            <Text className="text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
              이메일
            </Text>
            <TextInput
              value={profile.email}
              className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-lg text-neutral-500 dark:text-neutral-500"
              keyboardType="email-address"
              placeholderTextColor={theme.neutral[400]}
              editable={false} // 이메일은 수정 불가능하게 설정
            />
          </View>

          {/* 소개 입력 */}
          <View className="mb-6">
            <Text className="text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
              소개
            </Text>
            <TextInput
              value={profile.bio}
              onChangeText={(text) => handleChange("bio", text)}
              className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-lg text-neutral-900 dark:text-white min-h-[120px]"
              multiline
              textAlignVertical="top"
              placeholder="자신을 소개해보세요"
              placeholderTextColor={theme.neutral[400]}
              editable={!isSaving}
            />
          </View>

          {/* 높이 여백 추가 */}
          <View style={{ height: 60 }} />
        </ScrollView>

        {/* 하단 저장 버튼 (고정 위치) */}
        <View className=" dark:bg-neutral-800 border-t bg-white border-neutral-200 dark:border-neutral-700">
          <View className="px-4 py-2">
            <TouchableOpacity
              className={`py-3 rounded-lg items-center border-[1px] ${
                isSaving
                  ? "bg-emerald-300 border-emerald-200"
                  : "bg-emerald-500 border-emerald-400"
              }`}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <View className="flex-row items-center justify-center px-5">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-semibold ml-2">
                    저장 중...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold">저장하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
