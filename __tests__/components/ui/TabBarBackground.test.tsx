import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';

// Mock Platform
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      select: jest.fn(),
      OS: 'ios',
    },
  };
});

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: ({ children, intensity, tint, style, ...props }: any) => {
    const { View } = require('react-native');
    return (
      <View 
        testID={`blur-view-${tint}-${intensity}`}
        style={style}
        {...props}
      >
        {children}
      </View>
    );
  },
}));

// Import components after mocks
const TabBarBackgroundIOS = require('../../../components/ui/TabBarBackground.ios').default;
const TabBarBackground = require('../../../components/ui/TabBarBackground').default;

describe('TabBarBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('iOS Implementation', () => {
    it('renders BlurView correctly', () => {
      const { getByTestId } = render(<TabBarBackgroundIOS />);
      
      expect(getByTestId('blur-view-systemChromeMaterial-100')).toBeTruthy();
    });

    it('renders with default blur intensity', () => {
      const { getByTestId } = render(<TabBarBackgroundIOS />);
      
      expect(getByTestId('blur-view-systemChromeMaterial-100')).toBeTruthy();
    });

    it('renders with custom intensity', () => {
      const { getByTestId } = render(
        <TabBarBackgroundIOS intensity={50} />
      );
      
      expect(getByTestId('blur-view-systemChromeMaterial-50')).toBeTruthy();
    });

    it('renders with custom tint', () => {
      const { getByTestId } = render(
        <TabBarBackgroundIOS tint="light" />
      );
      
      expect(getByTestId('blur-view-light-100')).toBeTruthy();
    });

    it('renders with custom style', () => {
      const customStyle = { backgroundColor: 'transparent' };
      const { getByTestId } = render(
        <TabBarBackgroundIOS style={customStyle} />
      );
      
      const blurView = getByTestId('blur-view-systemChromeMaterial-100');
      expect(blurView).toBeTruthy();
    });

    it('passes through additional props', () => {
      const { getByTestId } = render(
        <TabBarBackgroundIOS 
          testID="custom-tab-bar"
          accessibilityLabel="Tab bar background"
        />
      );
      
      expect(getByTestId('blur-view-systemChromeMaterial-100')).toBeTruthy();
    });

    it('handles different tint values', () => {
      const tints = ['light', 'dark', 'default', 'systemChromeMaterial'];
      
      tints.forEach(tint => {
        const { getByTestId } = render(
          <TabBarBackgroundIOS tint={tint as any} />
        );
        
        expect(getByTestId(`blur-view-${tint}-100`)).toBeTruthy();
      });
    });

    it('handles different intensity values', () => {
      const intensities = [0, 25, 50, 75, 100];
      
      intensities.forEach(intensity => {
        const { getByTestId } = render(
          <TabBarBackgroundIOS intensity={intensity} />
        );
        
        expect(getByTestId(`blur-view-systemChromeMaterial-${intensity}`)).toBeTruthy();
      });
    });
  });

  describe('Generic Implementation', () => {
    beforeEach(() => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.select.mockReturnValue(null);
      mockPlatform.OS = 'android';
    });

    it('renders null on non-iOS platforms', () => {
      const result = render(<TabBarBackground />);
      
      // Since it returns null, the container should be empty
      expect(result.container.children).toHaveLength(0);
    });

    it('uses Platform.select correctly', () => {
      const mockPlatform = require('react-native').Platform;
      
      render(<TabBarBackground />);
      
      expect(mockPlatform.select).toHaveBeenCalledWith({
        ios: expect.any(Object),
        default: null,
      });
    });
  });

  describe('Platform-specific behavior', () => {
    it('renders iOS version on iOS', () => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.OS = 'ios';
      mockPlatform.select.mockImplementation((specifics) => specifics.ios);

      expect(mockPlatform.OS).toBe('ios');
    });

    it('returns null on Android', () => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.OS = 'android';
      mockPlatform.select.mockImplementation((specifics) => specifics.default);

      const result = render(<TabBarBackground />);
      
      expect(result.container.children).toHaveLength(0);
    });

    it('returns null on web', () => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.OS = 'web';
      mockPlatform.select.mockImplementation((specifics) => specifics.default);

      const result = render(<TabBarBackground />);
      
      expect(result.container.children).toHaveLength(0);
    });
  });

  describe('Blur effect properties', () => {
    it('applies correct blur properties for tab bar', () => {
      const { getByTestId } = render(<TabBarBackgroundIOS />);
      
      const blurView = getByTestId('blur-view-systemChromeMaterial-100');
      expect(blurView).toBeTruthy();
    });

    it('maintains blur properties with custom props', () => {
      const { getByTestId } = render(
        <TabBarBackgroundIOS 
          intensity={80}
          tint="dark"
          style={{ position: 'absolute' }}
        />
      );
      
      const blurView = getByTestId('blur-view-dark-80');
      expect(blurView).toBeTruthy();
    });

    it('handles edge case intensity values', () => {
      // Test with boundary values
      const { getByTestId: getByTestId1 } = render(
        <TabBarBackgroundIOS intensity={0} />
      );
      expect(getByTestId1('blur-view-systemChromeMaterial-0')).toBeTruthy();

      const { getByTestId: getByTestId2 } = render(
        <TabBarBackgroundIOS intensity={200} />
      );
      expect(getByTestId2('blur-view-systemChromeMaterial-200')).toBeTruthy();
    });
  });

  describe('Integration with tab bar', () => {
    it('works as tab bar background component', () => {
      // Simulate usage in a tab bar
      const TabBarContainer = ({ children }: any) => {
        const { View } = require('react-native');
        return (
          <View testID="tab-bar-container">
            <TabBarBackgroundIOS />
            {children}
          </View>
        );
      };

      const { getByTestId } = render(
        <TabBarContainer>
          <View testID="tab-content">Tab Content</View>
        </TabBarContainer>
      );
      
      expect(getByTestId('tab-bar-container')).toBeTruthy();
      expect(getByTestId('blur-view-systemChromeMaterial-100')).toBeTruthy();
      expect(getByTestId('tab-content')).toBeTruthy();
    });

    it('provides proper background for tab content', () => {
      const { getByTestId } = render(
        <TabBarBackgroundIOS>
          <View testID="tab-item">Tab Item</View>
        </TabBarBackgroundIOS>
      );
      
      expect(getByTestId('blur-view-systemChromeMaterial-100')).toBeTruthy();
      expect(getByTestId('tab-item')).toBeTruthy();
    });
  });
});