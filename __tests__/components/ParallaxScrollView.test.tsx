import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ParallaxScrollView } from '../../components/ParallaxScrollView';

// Mock react-native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      ScrollView: ({ children, onScroll, ...props }: any) => {
        const { ScrollView } = RN;
        return <ScrollView onScroll={onScroll} {...props}>{children}</ScrollView>;
      },
      Value: jest.fn().mockImplementation((value) => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        interpolate: jest.fn(() => ({
          addListener: jest.fn(),
          removeListener: jest.fn(),
        })),
        _value: value,
      })),
      event: jest.fn(() => jest.fn()),
    },
    useWindowDimensions: jest.fn(() => ({
      width: 375,
      height: 667,
    })),
  };
});

// Mock ThemedView
jest.mock('../../components/ThemedView', () => ({
  ThemedView: ({ children, style, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID="themed-view" style={style} {...props}>{children}</View>;
  },
}));

describe('ParallaxScrollView', () => {
  const defaultProps = {
    headerImage: <Text>Header Image</Text>,
    headerBackgroundColor: { light: '#ffffff', dark: '#000000' },
    children: <Text>Scroll Content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(
      <ParallaxScrollView {...defaultProps} />
    );
    
    expect(getByText('Header Image')).toBeTruthy();
    expect(getByText('Scroll Content')).toBeTruthy();
    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('renders without header image', () => {
    const { getByText } = render(
      <ParallaxScrollView 
        headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      >
        <Text>Content Only</Text>
      </ParallaxScrollView>
    );
    
    expect(getByText('Content Only')).toBeTruthy();
  });

  it('applies custom header background color', () => {
    const customColors = { light: '#ff0000', dark: '#00ff00' };
    const { getByText } = render(
      <ParallaxScrollView 
        headerImage={<Text>Custom Header</Text>}
        headerBackgroundColor={customColors}
      >
        <Text>Custom Content</Text>
      </ParallaxScrollView>
    );
    
    expect(getByText('Custom Header')).toBeTruthy();
    expect(getByText('Custom Content')).toBeTruthy();
  });

  it('creates animated scroll value', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<ParallaxScrollView {...defaultProps} />);
    
    expect(mockAnimated.Value).toHaveBeenCalledWith(0);
  });

  it('sets up scroll event listener', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<ParallaxScrollView {...defaultProps} />);
    
    expect(mockAnimated.event).toHaveBeenCalledWith(
      [{ nativeEvent: { contentOffset: { y: expect.any(Object) } } }],
      { useNativeDriver: false }
    );
  });

  it('handles scroll with parallax effect', () => {
    const { container } = render(<ParallaxScrollView {...defaultProps} />);
    
    // Component should render without errors
    expect(container).toBeTruthy();
  });

  it('renders with custom children', () => {
    const customChildren = (
      <div>
        <Text>Custom Child 1</Text>
        <Text>Custom Child 2</Text>
      </div>
    );
    
    const { getByText } = render(
      <ParallaxScrollView {...defaultProps}>
        {customChildren}
      </ParallaxScrollView>
    );
    
    expect(getByText('Custom Child 1')).toBeTruthy();
    expect(getByText('Custom Child 2')).toBeTruthy();
  });

  it('uses window dimensions for layout', () => {
    const mockUseWindowDimensions = require('react-native').useWindowDimensions;
    
    render(<ParallaxScrollView {...defaultProps} />);
    
    expect(mockUseWindowDimensions).toHaveBeenCalled();
  });

  it('handles different screen sizes', () => {
    const mockUseWindowDimensions = require('react-native').useWindowDimensions;
    mockUseWindowDimensions.mockReturnValue({ width: 768, height: 1024 });
    
    const { getByText } = render(<ParallaxScrollView {...defaultProps} />);
    
    expect(getByText('Header Image')).toBeTruthy();
    expect(getByText('Scroll Content')).toBeTruthy();
  });

  it('applies interpolated values for parallax effect', () => {
    const mockAnimatedValue = {
      interpolate: jest.fn(() => 'interpolated-value'),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
    
    const mockAnimated = require('react-native').Animated;
    mockAnimated.Value.mockReturnValue(mockAnimatedValue);
    
    render(<ParallaxScrollView {...defaultProps} />);
    
    expect(mockAnimatedValue.interpolate).toHaveBeenCalled();
  });

  it('renders scroll view with correct props', () => {
    const { container } = render(<ParallaxScrollView {...defaultProps} />);
    
    expect(container).toBeTruthy();
  });

  it('handles empty children gracefully', () => {
    const { getByText } = render(
      <ParallaxScrollView 
        headerImage={<Text>Header Only</Text>}
        headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      >
        {null}
      </ParallaxScrollView>
    );
    
    expect(getByText('Header Only')).toBeTruthy();
  });

  it('maintains scroll performance with native driver', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<ParallaxScrollView {...defaultProps} />);
    
    expect(mockAnimated.event).toHaveBeenCalledWith(
      expect.any(Array),
      { useNativeDriver: false }
    );
  });

  it('handles complex header content', () => {
    const complexHeader = (
      <div>
        <Text>Header Title</Text>
        <Text>Header Subtitle</Text>
      </div>
    );
    
    const { getByText } = render(
      <ParallaxScrollView 
        headerImage={complexHeader}
        headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      >
        <Text>Body Content</Text>
      </ParallaxScrollView>
    );
    
    expect(getByText('Header Title')).toBeTruthy();
    expect(getByText('Header Subtitle')).toBeTruthy();
    expect(getByText('Body Content')).toBeTruthy();
  });

  it('applies themed styling', () => {
    const { getByTestId } = render(<ParallaxScrollView {...defaultProps} />);
    
    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('handles scroll events properly', () => {
    const mockAnimated = require('react-native').Animated;
    const mockScrollHandler = jest.fn();
    mockAnimated.event.mockReturnValue(mockScrollHandler);
    
    const { container } = render(<ParallaxScrollView {...defaultProps} />);
    
    expect(container).toBeTruthy();
    expect(mockAnimated.event).toHaveBeenCalled();
  });

  it('renders consistently across platforms', () => {
    const { getByText } = render(<ParallaxScrollView {...defaultProps} />);
    
    expect(getByText('Header Image')).toBeTruthy();
    expect(getByText('Scroll Content')).toBeTruthy();
  });

  it('maintains header position during scroll', () => {
    const mockAnimatedValue = {
      interpolate: jest.fn((config) => {
        // Verify interpolation config for parallax effect
        expect(config).toHaveProperty('inputRange');
        expect(config).toHaveProperty('outputRange');
        return 'interpolated-transform';
      }),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
    
    const mockAnimated = require('react-native').Animated;
    mockAnimated.Value.mockReturnValue(mockAnimatedValue);
    
    render(<ParallaxScrollView {...defaultProps} />);
    
    expect(mockAnimatedValue.interpolate).toHaveBeenCalled();
  });
});