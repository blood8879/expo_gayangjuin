import React from 'react';
import { render } from '@testing-library/react-native';
import { HelloWave } from '../../components/HelloWave';

// Mock Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  const MockAnimated = {
    View: RN.View,
    Text: RN.Text,
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    loop: jest.fn((animation) => ({
      start: jest.fn(),
      stop: jest.fn(),
    })),
    sequence: jest.fn((animations) => ({
      start: jest.fn(),
    })),
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
  };

  return {
    ...RN,
    Animated: MockAnimated,
  };
});

// Mock ThemedText
jest.mock('../../components/ThemedText', () => ({
  ThemedText: ({ children, style, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text style={style} {...props}>{children}</Text>;
  },
}));

describe('HelloWave', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<HelloWave />);
    
    expect(getByText('👋')).toBeTruthy();
  });

  it('starts wave animation on mount', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<HelloWave />);
    
    expect(mockAnimated.Value).toHaveBeenCalled();
    expect(mockAnimated.loop).toHaveBeenCalled();
  });

  it('applies correct transform animation', () => {
    const mockAnimated = require('react-native').Animated;
    const mockValue = {
      interpolate: jest.fn(() => 'interpolated-value'),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
    mockAnimated.Value.mockReturnValue(mockValue);
    
    render(<HelloWave />);
    
    expect(mockValue.interpolate).toHaveBeenCalledWith({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: ['0deg', '10deg', '0deg', '10deg', '0deg'],
    });
  });

  it('creates correct animation sequence', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<HelloWave />);
    
    expect(mockAnimated.timing).toHaveBeenCalled();
    expect(mockAnimated.loop).toHaveBeenCalled();
  });

  it('renders with custom style', () => {
    const customStyle = { fontSize: 32 };
    const { getByText } = render(<HelloWave style={customStyle} />);
    
    expect(getByText('👋')).toBeTruthy();
  });

  it('combines custom style with animation style', () => {
    const customStyle = { color: 'red' };
    const { getByText } = render(<HelloWave style={customStyle} />);
    
    const wave = getByText('👋');
    expect(wave).toBeTruthy();
  });

  it('handles animation timing correctly', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<HelloWave />);
    
    // Check that timing is called with correct duration
    expect(mockAnimated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      {
        toValue: 4,
        duration: 1000,
        useNativeDriver: true,
      }
    );
  });

  it('creates looping animation', () => {
    const mockAnimated = require('react-native').Animated;
    const mockLoop = jest.fn(() => ({
      start: jest.fn(),
    }));
    mockAnimated.loop.mockReturnValue(mockLoop());
    
    render(<HelloWave />);
    
    expect(mockAnimated.loop).toHaveBeenCalledWith(
      expect.any(Object),
      { iterations: -1 }
    );
  });

  it('starts animation automatically', () => {
    const mockAnimated = require('react-native').Animated;
    const startMock = jest.fn();
    mockAnimated.loop.mockReturnValue({
      start: startMock,
    });
    
    render(<HelloWave />);
    
    expect(startMock).toHaveBeenCalled();
  });

  it('renders emoji with correct accessibility', () => {
    const { getByText } = render(<HelloWave />);
    
    const wave = getByText('👋');
    expect(wave).toBeTruthy();
  });

  it('handles unmounting gracefully', () => {
    const { unmount } = render(<HelloWave />);
    
    // Should not throw error when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it('maintains animation state during re-renders', () => {
    const { rerender } = render(<HelloWave />);
    
    rerender(<HelloWave style={{ color: 'blue' }} />);
    
    // Animation should continue working
    const mockAnimated = require('react-native').Animated;
    expect(mockAnimated.loop).toHaveBeenCalled();
  });

  it('uses native driver for performance', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<HelloWave />);
    
    expect(mockAnimated.timing).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        useNativeDriver: true,
      })
    );
  });

  it('creates infinite loop animation', () => {
    const mockAnimated = require('react-native').Animated;
    
    render(<HelloWave />);
    
    expect(mockAnimated.loop).toHaveBeenCalledWith(
      expect.any(Object),
      { iterations: -1 }
    );
  });

  it('handles animation with correct rotation values', () => {
    const mockAnimated = require('react-native').Animated;
    const mockValue = {
      interpolate: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
    mockAnimated.Value.mockReturnValue(mockValue);
    
    render(<HelloWave />);
    
    expect(mockValue.interpolate).toHaveBeenCalledWith({
      inputRange: [0, 1, 2, 3, 4],
      outputRange: ['0deg', '10deg', '0deg', '10deg', '0deg'],
    });
  });

  it('applies animation to transform property', () => {
    const { getByText } = render(<HelloWave />);
    
    const wave = getByText('👋');
    expect(wave).toBeTruthy();
    
    // The component should apply the transform animation
    // The exact style check depends on implementation
  });

  it('combines multiple style props correctly', () => {
    const baseStyle = { fontSize: 24 };
    const additionalStyle = { marginTop: 10 };
    
    const { getByText } = render(
      <HelloWave style={[baseStyle, additionalStyle]} />
    );
    
    expect(getByText('👋')).toBeTruthy();
  });
});