import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppUpdate, UpdateInfo } from '../hooks/useAppUpdate';

interface UpdateContextType {
  updateInfo: UpdateInfo;
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  reloadApp: () => Promise<void>;
  checkAndDownloadUpdate: () => Promise<void>;
}

const UpdateContext = createContext<UpdateContextType | null>(null);

export function UpdateProvider({ children }: { children: ReactNode }) {
  const updateMethods = useAppUpdate();

  // 앱 시작 후 5초 뒤에 자동으로 업데이트 체크
  useEffect(() => {
    const timer = setTimeout(() => {
      updateMethods.checkForUpdates();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UpdateContext.Provider value={updateMethods}>
      {children}
    </UpdateContext.Provider>
  );
}

export function useUpdate() {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdate must be used within an UpdateProvider');
  }
  return context;
}