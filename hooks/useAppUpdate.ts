import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export interface UpdateInfo {
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
  isChecking: boolean;
  isDownloading: boolean;
  manifest?: Updates.Manifest;
}

export function useAppUpdate() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    isUpdateAvailable: false,
    isUpdatePending: false,
    isChecking: false,
    isDownloading: false,
  });

  // 앱 시작 시 업데이트 체크
  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      if (!Updates.isEnabled) {
        console.log('📱 Updates가 비활성화되어 있습니다. (개발 모드)');
        return;
      }

      setUpdateInfo(prev => ({ ...prev, isChecking: true }));

      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        console.log('🔄 새로운 업데이트가 있습니다!');
        setUpdateInfo(prev => ({
          ...prev,
          isUpdateAvailable: true,
          manifest: update.manifest,
        }));
      } else {
        console.log('✅ 앱이 최신 버전입니다.');
      }
    } catch (error) {
      console.error('❌ 업데이트 체크 오류:', error);
    } finally {
      setUpdateInfo(prev => ({ ...prev, isChecking: false }));
    }
  };

  const downloadUpdate = async () => {
    try {
      if (!Updates.isEnabled) {
        console.log('📱 Updates가 비활성화되어 있습니다. (개발 모드)');
        return;
      }

      setUpdateInfo(prev => ({ ...prev, isDownloading: true }));

      const result = await Updates.fetchUpdateAsync();
      
      if (result.isNew) {
        console.log('📥 새 업데이트를 다운로드했습니다!');
        setUpdateInfo(prev => ({
          ...prev,
          isUpdatePending: true,
          isUpdateAvailable: false,
        }));
        
        // 사용자에게 재시작 확인
        Alert.alert(
          '업데이트 완료',
          '새로운 버전이 준비되었습니다. 앱을 재시작하시겠습니까?',
          [
            { text: '나중에', style: 'cancel' },
            { text: '재시작', onPress: reloadApp },
          ],
        );
      }
    } catch (error) {
      console.error('❌ 업데이트 다운로드 오류:', error);
      Alert.alert('업데이트 오류', '업데이트 다운로드 중 오류가 발생했습니다.');
    } finally {
      setUpdateInfo(prev => ({ ...prev, isDownloading: false }));
    }
  };

  const reloadApp = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('❌ 앱 재시작 오류:', error);
    }
  };

  const checkAndDownloadUpdate = async () => {
    await checkForUpdates();
    if (updateInfo.isUpdateAvailable) {
      await downloadUpdate();
    }
  };

  return {
    updateInfo,
    checkForUpdates,
    downloadUpdate,
    reloadApp,
    checkAndDownloadUpdate,
  };
}