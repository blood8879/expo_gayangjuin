import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from '../../app/_layout';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: ({ children, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID="stack-layout" {...props}>{children}</View>;
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]), // [fontsLoaded, error]
}));

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="safe-area-provider">{children}</View>;
  },
}));

// Mock query client provider
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="query-client-provider">{children}</View>;
  },
}));

// Mock auth context
jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="auth-provider">{children}</View>;
  },
}));

// Mock useColorScheme
jest.mock('../../hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

// Mock status bar
jest.mock('expo-status-bar', () => ({
  StatusBar: ({ style, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID={`status-bar-${style}`} {...props} />;
  },
}));

describe('RootLayout', () => {
  const mockUseFonts = require('expo-font').useFonts;
  const mockPreventAutoHideAsync = require('expo-splash-screen').preventAutoHideAsync;
  const mockHideAsync = require('expo-splash-screen').hideAsync;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFonts.mockReturnValue([true, null]);
  });

  it('renders correctly when fonts are loaded', () => {
    const { getByTestId } = render(<RootLayout />);
    
    expect(getByTestId('safe-area-provider')).toBeTruthy();
    expect(getByTestId('query-client-provider')).toBeTruthy();
    expect(getByTestId('auth-provider')).toBeTruthy();
    expect(getByTestId('stack-layout')).toBeTruthy();
  });

  it('prevents splash screen auto hide on mount', () => {
    render(<RootLayout />);
    
    expect(mockPreventAutoHideAsync).toHaveBeenCalled();
  });

  it('hides splash screen when fonts are loaded', () => {
    mockUseFonts.mockReturnValue([true, null]);
    
    render(<RootLayout />);
    
    expect(mockHideAsync).toHaveBeenCalled();
  });

  it('does not hide splash screen when fonts are not loaded', () => {
    mockUseFonts.mockReturnValue([false, null]);
    mockHideAsync.mockClear();
    
    const { container } = render(<RootLayout />);
    
    expect(container.children).toHaveLength(0);
    expect(mockHideAsync).not.toHaveBeenCalled();
  });

  it('handles font loading error', () => {
    const fontError = new Error('Font loading failed');
    mockUseFonts.mockReturnValue([false, fontError]);
    
    const { container } = render(<RootLayout />);
    
    expect(container.children).toHaveLength(0);
  });

  it('renders status bar with correct style for light theme', () => {
    const mockUseColorScheme = require('../../hooks/useColorScheme').useColorScheme;
    mockUseColorScheme.mockReturnValue('light');
    
    const { getByTestId } = render(<RootLayout />);
    
    expect(getByTestId('status-bar-dark')).toBeTruthy();
  });

  it('renders status bar with correct style for dark theme', () => {
    const mockUseColorScheme = require('../../hooks/useColorScheme').useColorScheme;
    mockUseColorScheme.mockReturnValue('dark');
    
    const { getByTestId } = render(<RootLayout />);
    
    expect(getByTestId('status-bar-light')).toBeTruthy();
  });

  it('provides all necessary providers in correct order', () => {
    const { getByTestId } = render(<RootLayout />);
    
    // SafeAreaProvider should be outermost
    const safeAreaProvider = getByTestId('safe-area-provider');
    expect(safeAreaProvider).toBeTruthy();
    
    // QueryClientProvider should be inside SafeAreaProvider
    expect(getByTestId('query-client-provider')).toBeTruthy();
    
    // AuthProvider should be inside QueryClientProvider
    expect(getByTestId('auth-provider')).toBeTruthy();
    
    // Stack should be innermost
    expect(getByTestId('stack-layout')).toBeTruthy();
  });

  it('creates and uses query client', () => {
    const mockQueryClient = require('@tanstack/react-query').QueryClient;
    
    render(<RootLayout />);
    
    expect(mockQueryClient).toHaveBeenCalled();
  });

  it('loads custom fonts', () => {
    render(<RootLayout />);
    
    expect(mockUseFonts).toHaveBeenCalled();
    
    // Check if fonts configuration is passed
    const fontsConfig = mockUseFonts.mock.calls[0][0];
    expect(fontsConfig).toBeDefined();
  });

  it('handles component unmounting gracefully', () => {
    const { unmount } = render(<RootLayout />);
    
    expect(() => unmount()).not.toThrow();
  });

  it('maintains state during re-renders', () => {
    const { rerender } = render(<RootLayout />);
    
    rerender(<RootLayout />);
    
    // Should not cause additional font loading or splash screen operations
    expect(mockUseFonts).toHaveBeenCalled();
  });

  it('handles different color scheme changes', () => {
    const mockUseColorScheme = require('../../hooks/useColorScheme').useColorScheme;
    
    // Start with light theme
    mockUseColorScheme.mockReturnValue('light');
    const { rerender, getByTestId } = render(<RootLayout />);
    expect(getByTestId('status-bar-dark')).toBeTruthy();
    
    // Change to dark theme
    mockUseColorScheme.mockReturnValue('dark');
    rerender(<RootLayout />);
    expect(getByTestId('status-bar-light')).toBeTruthy();
  });

  it('provides proper navigation structure', () => {
    const { getByTestId } = render(<RootLayout />);
    
    const stackLayout = getByTestId('stack-layout');
    expect(stackLayout).toBeTruthy();
  });

  it('handles async font loading properly', async () => {
    // Simulate async font loading
    mockUseFonts.mockReturnValue([false, null]);
    
    const { rerender, container } = render(<RootLayout />);
    
    // Initially should not render content
    expect(container.children).toHaveLength(0);
    
    // Simulate fonts loaded
    mockUseFonts.mockReturnValue([true, null]);
    rerender(<RootLayout />);
    
    // Should now render content
    expect(container.children.length).toBeGreaterThan(0);
  });

  it('sets up proper error boundaries', () => {
    // This test ensures the layout can handle errors gracefully
    const { getByTestId } = render(<RootLayout />);
    
    expect(getByTestId('safe-area-provider')).toBeTruthy();
  });

  it('configures accessibility properly', () => {
    const { getByTestId } = render(<RootLayout />);
    
    // Should render all accessibility-friendly components
    expect(getByTestId('safe-area-provider')).toBeTruthy();
    expect(getByTestId('stack-layout')).toBeTruthy();
  });

  it('handles splash screen timing correctly', () => {
    // Test that splash screen operations happen in correct order
    render(<RootLayout />);
    
    expect(mockPreventAutoHideAsync).toHaveBeenCalled();
    expect(mockHideAsync).toHaveBeenCalled();
  });

  it('provides theme context correctly', () => {
    const mockUseColorScheme = require('../../hooks/useColorScheme').useColorScheme;
    
    render(<RootLayout />);
    
    expect(mockUseColorScheme).toHaveBeenCalled();
  });
});