import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUpdate } from '@/contexts/UpdateContext';

export default function UpdateStatus() {
  const { updateInfo, checkForUpdates, downloadUpdate, reloadApp } = useUpdate();

  const handleUpdateCheck = async () => {
    await checkForUpdates();
    
    if (!updateInfo.isUpdateAvailable) {
      Alert.alert('업데이트', '이미 최신 버전입니다.');
    }
  };

  const handleUpdateDownload = async () => {
    Alert.alert(
      '업데이트',
      '새로운 버전을 다운로드하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '다운로드', onPress: downloadUpdate },
      ]
    );
  };

  const handleRestart = () => {
    Alert.alert(
      '앱 재시작',
      '업데이트를 적용하기 위해 앱을 재시작합니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '재시작', onPress: reloadApp },
      ]
    );
  };

  const getStatusColor = () => {
    if (updateInfo.isUpdatePending) return '#F59E0B'; // orange
    if (updateInfo.isUpdateAvailable) return '#EF4444'; // red  
    return '#10B981'; // green
  };

  const getStatusText = () => {
    if (updateInfo.isChecking) return '업데이트 확인 중...';
    if (updateInfo.isDownloading) return '업데이트 다운로드 중...';
    if (updateInfo.isUpdatePending) return '재시작 대기 중';
    if (updateInfo.isUpdateAvailable) return '업데이트 가능';
    return '최신 버전';
  };

  const getStatusIcon = () => {
    if (updateInfo.isChecking || updateInfo.isDownloading) {
      return <ActivityIndicator size="small" color={getStatusColor()} />;
    }
    if (updateInfo.isUpdatePending) return 'refresh-circle';
    if (updateInfo.isUpdateAvailable) return 'download-circle';
    return 'checkmark-circle';
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mx-4 mb-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {updateInfo.isChecking || updateInfo.isDownloading ? (
            <ActivityIndicator size="small" color={getStatusColor()} />
          ) : (
            <Ionicons 
              name={getStatusIcon() as any} 
              size={24} 
              color={getStatusColor()} 
            />
          )}
          <View className="ml-3 flex-1">
            <Text className="text-gray-900 dark:text-white font-medium">
              앱 업데이트
            </Text>
            <Text 
              className={`text-sm mt-1`}
              style={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          {/* 업데이트 체크 버튼 */}
          <TouchableOpacity
            onPress={handleUpdateCheck}
            disabled={updateInfo.isChecking || updateInfo.isDownloading}
            className="bg-blue-500 px-3 py-2 rounded-lg disabled:opacity-50"
          >
            <Text className="text-white font-medium text-sm">체크</Text>
          </TouchableOpacity>

          {/* 업데이트 다운로드 버튼 */}
          {updateInfo.isUpdateAvailable && (
            <TouchableOpacity
              onPress={handleUpdateDownload}
              disabled={updateInfo.isDownloading}
              className="bg-green-500 px-3 py-2 rounded-lg disabled:opacity-50"
            >
              <Text className="text-white font-medium text-sm">다운로드</Text>
            </TouchableOpacity>
          )}

          {/* 재시작 버튼 */}
          {updateInfo.isUpdatePending && (
            <TouchableOpacity
              onPress={handleRestart}
              className="bg-orange-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white font-medium text-sm">재시작</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}