import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

// Mock useColorScheme
jest.mock('../../hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

// Mock Colors
jest.mock('../../constants/Colors', () => ({
  Colors: {
    light: {
      text: '#000000',
      background: '#ffffff',
      primary: '#007AFF',
      secondary: '#5AC8FA',
    },
    dark: {
      text: '#ffffff',
      background: '#000000',
      primary: '#0A84FF',
      secondary: '#64D2FF',
    },
  },
}));

describe('useThemeColor', () => {
  const mockUseColorScheme = require('../../hooks/useColorScheme').useColorScheme;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns light theme color by default', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => 
      useThemeColor({}, 'text')
    );

    expect(result.current).toBe('#000000');
  });

  it('returns dark theme color when scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => 
      useThemeColor({}, 'text')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('uses override color when provided for light theme', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => 
      useThemeColor({ light: '#ff0000' }, 'text')
    );

    expect(result.current).toBe('#ff0000');
  });

  it('uses override color when provided for dark theme', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => 
      useThemeColor({ dark: '#00ff00' }, 'text')
    );

    expect(result.current).toBe('#00ff00');
  });

  it('falls back to theme color when override not provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => 
      useThemeColor({ dark: '#00ff00' }, 'background')
    );

    expect(result.current).toBe('#ffffff');
  });

  it('works with different color keys', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result: primaryResult } = renderHook(() => 
      useThemeColor({}, 'primary')
    );
    
    const { result: secondaryResult } = renderHook(() => 
      useThemeColor({}, 'secondary')
    );

    expect(primaryResult.current).toBe('#007AFF');
    expect(secondaryResult.current).toBe('#5AC8FA');
  });

  it('handles both light and dark overrides', () => {
    const props = { light: '#ff0000', dark: '#00ff00' };

    // Test light theme
    mockUseColorScheme.mockReturnValue('light');
    const { result: lightResult } = renderHook(() => 
      useThemeColor(props, 'text')
    );
    expect(lightResult.current).toBe('#ff0000');

    // Test dark theme  
    mockUseColorScheme.mockReturnValue('dark');
    const { result: darkResult } = renderHook(() => 
      useThemeColor(props, 'text')
    );
    expect(darkResult.current).toBe('#00ff00');
  });

  it('updates when color scheme changes', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result, rerender } = renderHook(() => 
      useThemeColor({}, 'text')
    );

    expect(result.current).toBe('#000000');

    // Change color scheme
    mockUseColorScheme.mockReturnValue('dark');
    rerender();

    expect(result.current).toBe('#ffffff');
  });

  it('handles undefined color key gracefully', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => 
      useThemeColor({}, 'nonexistent' as any)
    );

    expect(result.current).toBeUndefined();
  });
});