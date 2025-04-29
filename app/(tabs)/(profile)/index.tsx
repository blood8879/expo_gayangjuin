import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  GestureResponderEvent,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profileImage: string | null;
  recipes: number;
  journals: number;
  events: number;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: (event: GestureResponderEvent) => void;
  showChevron?: boolean;
}

interface ToggleItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotification, setPushNotification] = React.useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { user: authUser, signOut } = useAuth();

  // 유저 정보 상태 (초기값은 빈 객체, Supabase에서 로드)
  const [user, setUser] = React.useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    profileImage: null,
    recipes: 0,
    journals: 0,
    events: 0,
  });

  // 프로필 수정을 위한 임시 상태 값
  const [editingProfile, setEditingProfile] = React.useState<UserProfile>({
    ...user,
  });

  // Supabase에서 사용자 프로필 정보 가져오기
  const fetchUserProfile = async () => {
    if (!authUser) {
      setError("로그인이 필요합니다");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // users 테이블에서 현재 로그인한 사용자 정보 가져오기
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("full_name, email, bio, avatar_url")
        .eq("id", authUser.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // 카운트 정보 가져오기 (실제 데이터 또는 API 연동)
        // TODO: 실제 카운트는 별도 쿼리 필요 (현재는 더미 데이터)
        const recipesCount = 0; // 실제로는 레시피 테이블 쿼리
        const journalsCount = 0; // 실제로는 양조일지 테이블 쿼리
        const eventsCount = 0; // 실제로는 시음회 테이블 쿼리

        const userProfile: UserProfile = {
          name: data.full_name || authUser.user_metadata?.full_name || "",
          email: data.email || authUser.email || "",
          bio: data.bio || "",
          profileImage: data.avatar_url || null,
          recipes: recipesCount,
          journals: journalsCount,
          events: eventsCount,
        };

        setUser(userProfile);
      }
    } catch (err: any) {
      console.error("사용자 프로필 로드 오류:", err);
      setError("프로필 정보를 불러오는 데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    fetchUserProfile();
  }, [authUser]);

  // 메뉴 아이템 컴포넌트
  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 px-4 bg-white dark:bg-neutral-800 rounded-[12px] shadow-sm mb-3"
      onPress={onPress}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: "#e6f2fe" }}
      >
        <Ionicons name={icon} size={20} color="#4a91db" />
      </View>
      <View className="flex-1">
        <Text className="text-neutral-900 dark:text-white font-medium">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={theme.neutral[400]} />
      )}
    </TouchableOpacity>
  );

  // 토글 아이템 컴포넌트
  const ToggleItem: React.FC<ToggleItemProps> = ({
    icon,
    title,
    value,
    onValueChange,
  }) => (
    <View className="flex-row items-center py-3 px-4 bg-white dark:bg-neutral-800 rounded-[12px] shadow-sm mb-3">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: "#ffeee6" }}
      >
        <Ionicons name={icon} size={20} color="#e8845e" />
      </View>
      <Text className="flex-1 text-neutral-900 dark:text-white font-medium">
        {title}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.neutral[300], true: theme.primary.DEFAULT }}
        thumbColor="white"
      />
    </View>
  );

  // 프로필 수정 모달 열기
  const handleOpenEditModal = () => {
    setEditingProfile({ ...user });
    setIsEditModalVisible(true);
  };

  // 프로필 수정 취소
  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };

  // 프로필 수정 저장 (Supabase로 업데이트)
  const handleSaveEdit = async () => {
    if (!authUser) {
      Alert.alert("오류", "로그인 상태를 확인할 수 없습니다");
      return;
    }

    try {
      setIsLoading(true);

      // Supabase users 테이블 업데이트
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: editingProfile.name,
          bio: editingProfile.bio,
          // 이메일과 프로필 이미지는 별도 로직 필요 (Auth 업데이트 등)
        })
        .eq("id", authUser.id);

      if (updateError) throw updateError;

      // 로컬 상태 업데이트
      setUser(editingProfile);
      setIsEditModalVisible(false);
      Alert.alert("성공", "프로필이 업데이트되었습니다");
    } catch (err: any) {
      console.error("프로필 업데이트 오류:", err);
      Alert.alert("오류", "프로필 업데이트에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 수정할 값 변경 처리
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditingProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut();
      // 로그아웃 후 로그인 화면으로 이동 (필요에 따라 조정)
      router.replace("/");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다");
    }
  };

  // 로딩 중 표시
  if (isLoading && !user.name) {
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
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <StatusBar style="auto" />

      {/* 헤더 */}
      <View className="px-5 pt-12 pb-4">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
          마이페이지
        </Text>
      </View>

      <ScrollView className="flex-1 px-5">
        {/* 프로필 카드 */}
        <View className="bg-white dark:bg-neutral-800 rounded-[16px] shadow-sm p-5 mb-6">
          <View className="flex-row">
            <View className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-700 items-center justify-center mr-4">
              {user.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={30} color={theme.neutral[400]} />
              )}
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                {user.name || "이름 없음"}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 mb-2">
                {user.email || "이메일 없음"}
              </Text>
              <TouchableOpacity
                className="bg-neutral-100 dark:bg-neutral-700 py-1 px-3 rounded-full self-start"
                onPress={handleOpenEditModal}
                disabled={isLoading}
              >
                <Text className="text-neutral-500 dark:text-neutral-300 text-xs font-medium">
                  {isLoading ? "로딩중..." : "프로필 수정"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-neutral-700 dark:text-neutral-300 mt-4 mb-5">
            {user.bio || "자기소개가 없습니다."}
          </Text>

          <View className="flex-row justify-between border-t border-neutral-100 dark:border-neutral-700 pt-4">
            <View className="items-center">
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.recipes}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                레시피
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.journals}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                양조일지
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.events}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                시음회
              </Text>
            </View>
          </View>
        </View>

        {/* 나의 활동 */}
        <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
          나의 활동
        </Text>

        <MenuItem
          icon="book-outline"
          title="내 레시피"
          subtitle="작성한 레시피 관리"
          onPress={() => {
            /* TODO: 내 레시피 화면으로 이동 */
          }}
        />

        <MenuItem
          icon="beer-outline"
          title="양조일지"
          subtitle="기록한 양조일지 보기"
          onPress={() => {
            /* TODO: 양조일지 화면으로 이동 */
          }}
        />

        <MenuItem
          icon="bookmark-outline"
          title="저장한 레시피"
          subtitle="다른 사용자의 레시피"
          onPress={() => {
            /* TODO: 저장한 레시피 화면으로 이동 */
          }}
        />

        {/* 설정 */}
        <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3 mt-5">
          설정
        </Text>

        <ToggleItem
          icon="notifications-outline"
          title="푸시 알림"
          value={pushNotification}
          onValueChange={setPushNotification}
        />

        <ToggleItem
          icon="moon-outline"
          title="다크 모드"
          value={darkMode}
          onValueChange={setDarkMode}
        />

        <MenuItem
          icon="shield-outline"
          title="개인정보 보호"
          subtitle="개인정보 보호 설정"
          onPress={() => {
            /* TODO: 개인정보 보호 화면으로 이동 */
          }}
        />

        <MenuItem
          icon="help-circle-outline"
          title="도움말"
          subtitle="도움말 및 지원"
          onPress={() => {
            /* TODO: 도움말 화면으로 이동 */
          }}
        />

        <MenuItem
          icon="information-circle-outline"
          title="앱 정보"
          subtitle="앱 정보 및 버전"
          onPress={() => {
            /* TODO: 앱 정보 화면으로 이동 */
          }}
        />

        {/* 로그아웃 버튼 */}
        <TouchableOpacity className="mt-5 mb-10" onPress={handleLogout}>
          <View className="bg-neutral-100 dark:bg-neutral-800 rounded-[12px] py-4 flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#f87171" />
            <Text className="ml-2 font-medium text-[#f87171]">로그아웃</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* 프로필 수정 모달 */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
          <SafeAreaView className="flex-1">
            {/* 모달 헤더 */}
            <View className="px-5 pt-12 pb-4 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleCancelEdit}
                className="p-2"
                disabled={isLoading}
              >
                <Ionicons name="close" size={24} color={theme.neutral[900]} />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                프로필 수정
              </Text>
              <TouchableOpacity
                onPress={handleSaveEdit}
                className="bg-primary-500 px-4 py-2 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium">저장</Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-5">
              {/* 프로필 이미지 */}
              <View className="items-center my-6">
                <View className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-700 items-center justify-center mb-3">
                  {editingProfile.profileImage ? (
                    <Image
                      source={{ uri: editingProfile.profileImage }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <Ionicons
                      name="person"
                      size={40}
                      color={theme.neutral[400]}
                    />
                  )}
                </View>
                <TouchableOpacity
                  className="bg-neutral-100 dark:bg-neutral-800 py-1 px-4 rounded-full"
                  disabled={isLoading}
                >
                  <Text className="text-primary-500 font-medium">
                    사진 변경
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 이름 입력 */}
              <View className="mb-4">
                <Text className="text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  이름
                </Text>
                <TextInput
                  value={editingProfile.name}
                  onChangeText={(text) => handleProfileChange("name", text)}
                  className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-lg text-neutral-900 dark:text-white"
                  placeholder="이름을 입력하세요"
                  placeholderTextColor={theme.neutral[400]}
                  editable={!isLoading}
                />
              </View>

              {/* 이메일 입력 */}
              <View className="mb-4">
                <Text className="text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  이메일
                </Text>
                <TextInput
                  value={editingProfile.email}
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
                  value={editingProfile.bio}
                  onChangeText={(text) => handleProfileChange("bio", text)}
                  className="bg-white dark:bg-neutral-800 px-4 py-3 rounded-lg text-neutral-900 dark:text-white min-h-[120px]"
                  multiline
                  textAlignVertical="top"
                  placeholder="자신을 소개해보세요"
                  placeholderTextColor={theme.neutral[400]}
                  editable={!isLoading}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
