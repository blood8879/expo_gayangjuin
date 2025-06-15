import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from '../../hooks/useColorScheme';

// Mock react-native Appearance
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Appearance: {
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
}));

describe('useColorScheme', () => {
  const mockAppearance = require('react-native').Appearance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns light scheme by default', () => {
    mockAppearance.getColorScheme.mockReturnValue('light');
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
  });

  it('returns dark scheme when system is dark', () => {
    mockAppearance.getColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('dark');
  });

  it('returns light scheme when system returns null', () => {
    mockAppearance.getColorScheme.mockReturnValue(null);
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
  });

  it('returns light scheme when system returns undefined', () => {
    mockAppearance.getColorScheme.mockReturnValue(undefined);
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
  });

  it('adds and removes appearance change listener', () => {
    const addListenerSpy = jest.spyOn(mockAppearance, 'addChangeListener');
    const removeListenerSpy = jest.spyOn(mockAppearance, 'removeChangeListener');
    
    mockAppearance.getColorScheme.mockReturnValue('light');
    
    const { unmount } = renderHook(() => useColorScheme());
    
    expect(addListenerSpy).toHaveBeenCalledWith(expect.any(Function));
    
    unmount();
    
    expect(removeListenerSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('updates scheme when appearance changes', () => {
    let changeListener: ((preferences: any) => void) | null = null;
    
    mockAppearance.addChangeListener.mockImplementation((listener) => {
      changeListener = listener;
    });
    
    mockAppearance.getColorScheme.mockReturnValue('light');
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
    
    // Simulate appearance change
    mockAppearance.getColorScheme.mockReturnValue('dark');
    
    if (changeListener) {
      changeListener({ colorScheme: 'dark' });
    }
    
    expect(result.current).toBe('dark');
  });
});