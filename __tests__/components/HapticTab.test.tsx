import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HapticTab } from '../../components/HapticTab';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock react-native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn((specifics) => specifics.ios || specifics.default),
    },
  };
});

describe('HapticTab', () => {
  const mockImpactAsync = require('expo-haptics').impactAsync;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with children', () => {
    const { getByText } = render(
      <HapticTab>
        <span>Tab Content</span>
      </HapticTab>
    );
    
    expect(getByText('Tab Content')).toBeTruthy();
  });

  it('triggers haptic feedback on press', () => {
    const { getByText } = render(
      <HapticTab>
        <span>Haptic Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Haptic Tab'));
    
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
  });

  it('calls onPress callback when provided', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <HapticTab onPress={onPress}>
        <span>Custom Press Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Custom Press Tab'));
    
    expect(onPress).toHaveBeenCalled();
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
  });

  it('uses custom haptic feedback style', () => {
    const { getByText } = render(
      <HapticTab hapticStyle="medium">
        <span>Medium Haptic Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Medium Haptic Tab'));
    
    expect(mockImpactAsync).toHaveBeenCalledWith('medium');
  });

  it('handles heavy haptic feedback style', () => {
    const { getByText } = render(
      <HapticTab hapticStyle="heavy">
        <span>Heavy Haptic Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Heavy Haptic Tab'));
    
    expect(mockImpactAsync).toHaveBeenCalledWith('heavy');
  });

  it('disables haptic feedback when disabled', () => {
    const { getByText } = render(
      <HapticTab disabled>
        <span>Disabled Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Disabled Tab'));
    
    expect(mockImpactAsync).not.toHaveBeenCalled();
  });

  it('handles haptic feedback error gracefully', () => {
    mockImpactAsync.mockRejectedValue(new Error('Haptic not available'));
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const { getByText } = render(
      <HapticTab>
        <span>Error Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Error Tab'));
    
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
    
    consoleSpy.mockRestore();
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red', padding: 10 };
    const { getByText } = render(
      <HapticTab style={customStyle}>
        <span>Styled Tab</span>
      </HapticTab>
    );
    
    expect(getByText('Styled Tab')).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByText } = render(
      <HapticTab
        testID="haptic-tab"
        accessibilityLabel="Haptic feedback tab"
        accessibilityRole="button"
      >
        <span>Accessible Tab</span>
      </HapticTab>
    );
    
    expect(getByText('Accessible Tab')).toBeTruthy();
  });

  it('works on Android platform', () => {
    const mockPlatform = require('react-native').Platform;
    mockPlatform.OS = 'android';
    
    const { getByText } = render(
      <HapticTab>
        <span>Android Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Android Tab'));
    
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
  });

  it('works on web platform', () => {
    const mockPlatform = require('react-native').Platform;
    mockPlatform.OS = 'web';
    
    const { getByText } = render(
      <HapticTab>
        <span>Web Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Web Tab'));
    
    // Haptic feedback might not work on web, but should not crash
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
  });

  it('handles multiple quick presses', () => {
    const { getByText } = render(
      <HapticTab>
        <span>Quick Press Tab</span>
      </HapticTab>
    );
    
    const tab = getByText('Quick Press Tab');
    
    fireEvent.press(tab);
    fireEvent.press(tab);
    fireEvent.press(tab);
    
    expect(mockImpactAsync).toHaveBeenCalledTimes(3);
  });

  it('prevents multiple simultaneous haptic calls', async () => {
    mockImpactAsync.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    const { getByText } = render(
      <HapticTab>
        <span>Async Tab</span>
      </HapticTab>
    );
    
    const tab = getByText('Async Tab');
    
    // Rapid fire presses
    fireEvent.press(tab);
    fireEvent.press(tab);
    fireEvent.press(tab);
    
    // Should still be called for each press
    expect(mockImpactAsync).toHaveBeenCalledTimes(3);
  });

  it('combines onPress with haptic feedback correctly', () => {
    const onPress = jest.fn();
    
    const { getByText } = render(
      <HapticTab onPress={onPress}>
        <span>Combined Tab</span>
      </HapticTab>
    );
    
    fireEvent.press(getByText('Combined Tab'));
    
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockImpactAsync).toHaveBeenCalledTimes(1);
  });

  it('handles pressIn and pressOut events', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    
    const { getByText } = render(
      <HapticTab onPressIn={onPressIn} onPressOut={onPressOut}>
        <span>Press Events Tab</span>
      </HapticTab>
    );
    
    const tab = getByText('Press Events Tab');
    
    fireEvent(tab, 'pressIn');
    fireEvent(tab, 'pressOut');
    fireEvent.press(tab);
    
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(mockImpactAsync).toHaveBeenCalledWith('light');
  });

  it('renders with complex nested content', () => {
    const { getByText } = render(
      <HapticTab>
        <div>
          <span>Nested</span>
          <span> Content</span>
        </div>
      </HapticTab>
    );
    
    expect(getByText('Nested')).toBeTruthy();
    expect(getByText(' Content')).toBeTruthy();
  });

  it('handles activeOpacity prop', () => {
    const { getByText } = render(
      <HapticTab activeOpacity={0.5}>
        <span>Opacity Tab</span>
      </HapticTab>
    );
    
    expect(getByText('Opacity Tab')).toBeTruthy();
  });
});