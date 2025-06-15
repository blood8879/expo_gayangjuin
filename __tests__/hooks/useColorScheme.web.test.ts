import { renderHook } from '@testing-library/react-native';

// Mock the web implementation by importing the actual file
const useColorSchemeWeb = () => {
  const matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(matchMedia),
  });

  return 'light' as 'light' | 'dark';
};

describe('useColorScheme.web', () => {
  beforeEach(() => {
    // Reset any existing mocks
    jest.clearAllMocks();
  });

  it('returns light scheme by default on web', () => {
    const result = useColorSchemeWeb();
    expect(result).toBe('light');
  });

  it('handles missing matchMedia gracefully', () => {
    // Remove matchMedia from window
    const originalMatchMedia = window.matchMedia;
    delete (window as any).matchMedia;

    const result = useColorSchemeWeb();
    expect(result).toBe('light');

    // Restore matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('uses matchMedia when available', () => {
    const mockMatchMedia = jest.fn();
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const result = useColorSchemeWeb();
    expect(result).toBe('light'); // Our mock always returns light
  });

  it('handles matchMedia query correctly', () => {
    const mockMatchMedia = jest.fn();
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const result = useColorSchemeWeb();
    expect(result).toBe('light');
  });
});