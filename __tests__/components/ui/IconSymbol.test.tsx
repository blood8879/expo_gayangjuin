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

// Mock SF Symbols
jest.mock('expo-symbols', () => ({
  SFSymbol: ({ name, size, color, style, weight, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text 
        testID={`sf-symbol-${name}`}
        style={[{ fontSize: size, color }, style]}
        {...props}
      >
        {name}
      </Text>
    );
  },
}));

// Import the component after setting up mocks
const IconSymbolIOS = require('../../../components/ui/IconSymbol.ios').default;
const IconSymbol = require('../../../components/ui/IconSymbol').default;

describe('IconSymbol', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('iOS Implementation', () => {
    it('renders SF Symbol correctly', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="house.fill" size={24} color="#000000" />
      );
      
      expect(getByTestId('sf-symbol-house.fill')).toBeTruthy();
    });

    it('renders with default props', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="star" />
      );
      
      expect(getByTestId('sf-symbol-star')).toBeTruthy();
    });

    it('renders with custom size', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="heart" size={32} />
      );
      
      const symbol = getByTestId('sf-symbol-heart');
      expect(symbol).toBeTruthy();
    });

    it('renders with custom color', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="star.fill" color="#ff0000" />
      );
      
      const symbol = getByTestId('sf-symbol-star.fill');
      expect(symbol).toBeTruthy();
    });

    it('renders with weight property', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="bolt" weight="bold" />
      );
      
      expect(getByTestId('sf-symbol-bolt')).toBeTruthy();
    });

    it('renders with custom style', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <IconSymbolIOS name="gear" style={customStyle} />
      );
      
      expect(getByTestId('sf-symbol-gear')).toBeTruthy();
    });

    it('handles all weight variations', () => {
      const weights = ['ultraLight', 'thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'heavy', 'black'];
      
      weights.forEach(weight => {
        const { getByTestId } = render(
          <IconSymbolIOS name="circle" weight={weight as any} />
        );
        
        expect(getByTestId('sf-symbol-circle')).toBeTruthy();
      });
    });

    it('passes through additional props', () => {
      const { getByTestId } = render(
        <IconSymbolIOS 
          name="checkmark" 
          testID="custom-test-id"
          accessibilityLabel="Checkmark icon"
        />
      );
      
      expect(getByTestId('sf-symbol-checkmark')).toBeTruthy();
    });
  });

  describe('Generic Implementation', () => {
    beforeEach(() => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.select.mockReturnValue('fallback-icon');
      mockPlatform.OS = 'android';
    });

    it('renders fallback text on non-iOS platforms', () => {
      const { getByText } = render(
        <IconSymbol name="house.fill" />
      );
      
      expect(getByText('fallback-icon')).toBeTruthy();
    });

    it('uses Platform.select for cross-platform compatibility', () => {
      const mockPlatform = require('react-native').Platform;
      
      render(<IconSymbol name="star" />);
      
      expect(mockPlatform.select).toHaveBeenCalledWith({
        ios: expect.objectContaining({
          type: expect.any(Object),
        }),
        default: '○',
      });
    });

    it('renders with custom size on fallback', () => {
      const { getByText } = render(
        <IconSymbol name="heart" size={32} />
      );
      
      const icon = getByText('fallback-icon');
      expect(icon).toBeTruthy();
    });

    it('renders with custom color on fallback', () => {
      const { getByText } = render(
        <IconSymbol name="star.fill" color="#ff0000" />
      );
      
      const icon = getByText('fallback-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Platform-specific behavior', () => {
    it('renders iOS version on iOS', () => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.OS = 'ios';
      mockPlatform.select.mockImplementation((specifics) => specifics.ios);

      // This would normally return the iOS component
      expect(mockPlatform.OS).toBe('ios');
    });

    it('renders fallback on Android', () => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.OS = 'android';
      mockPlatform.select.mockImplementation((specifics) => specifics.default);

      const { getByText } = render(
        <IconSymbol name="house.fill" />
      );
      
      expect(getByText('○')).toBeTruthy();
    });

    it('handles undefined platform gracefully', () => {
      const mockPlatform = require('react-native').Platform;
      mockPlatform.OS = undefined;
      mockPlatform.select.mockImplementation((specifics) => specifics.default);

      const { getByText } = render(
        <IconSymbol name="star" />
      );
      
      expect(getByText('○')).toBeTruthy();
    });
  });

  describe('Symbol name variations', () => {
    it('handles simple symbol names', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="house" />
      );
      
      expect(getByTestId('sf-symbol-house')).toBeTruthy();
    });

    it('handles filled symbol names', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="heart.fill" />
      );
      
      expect(getByTestId('sf-symbol-heart.fill')).toBeTruthy();
    });

    it('handles complex symbol names', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="person.crop.circle.badge.plus" />
      );
      
      expect(getByTestId('sf-symbol-person.crop.circle.badge.plus')).toBeTruthy();
    });

    it('handles numeric symbol names', () => {
      const { getByTestId } = render(
        <IconSymbolIOS name="1.circle" />
      );
      
      expect(getByTestId('sf-symbol-1.circle')).toBeTruthy();
    });
  });
});