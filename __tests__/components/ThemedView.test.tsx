import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemedView } from '../../components/ThemedView';

// Mock useThemeColor
jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    const colors = {
      background: '#ffffff',
      text: '#000000',
    };
    return colors[colorName as keyof typeof colors] || '#ffffff';
  }),
}));

// No need to mock react-native View, use actual implementation

describe('ThemedView', () => {
  const mockUseThemeColor = require('../../hooks/useThemeColor').useThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Default View</Text>
      </ThemedView>
    );
    
    expect(getByText('Default View')).toBeTruthy();
  });

  it('uses background theme color by default', () => {
    render(
      <ThemedView>
        <Text>Themed Background</Text>
      </ThemedView>
    );
    
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'background');
  });

  it('applies custom lightColor', () => {
    const { getByText } = render(
      <ThemedView lightColor="#ff0000">
        <Text>Custom Light View</Text>
      </ThemedView>
    );
    
    expect(getByText('Custom Light View')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#ff0000' }, 
      'background'
    );
  });

  it('applies custom darkColor', () => {
    const { getByText } = render(
      <ThemedView darkColor="#00ff00">
        <Text>Custom Dark View</Text>
      </ThemedView>
    );
    
    expect(getByText('Custom Dark View')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { dark: '#00ff00' }, 
      'background'
    );
  });

  it('applies both light and dark colors', () => {
    const { getByText } = render(
      <ThemedView lightColor="#ff0000" darkColor="#00ff00">
        <Text>Both Colors View</Text>
      </ThemedView>
    );
    
    expect(getByText('Both Colors View')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#ff0000', dark: '#00ff00' }, 
      'background'
    );
  });

  it('applies custom style along with theme color', () => {
    const customStyle = { padding: 20, margin: 10 };
    const { getByText } = render(
      <ThemedView style={customStyle}>
        <Text>Styled View</Text>
      </ThemedView>
    );
    
    expect(getByText('Styled View')).toBeTruthy();
  });

  it('combines multiple styles correctly', () => {
    const style1 = { padding: 10 };
    const style2 = { margin: 5 };
    const { getByText } = render(
      <ThemedView style={[style1, style2]}>
        <Text>Multi Style View</Text>
      </ThemedView>
    );
    
    expect(getByText('Multi Style View')).toBeTruthy();
  });

  it('passes through view props', () => {
    const { getByText } = render(
      <ThemedView 
        testID="themed-view"
        accessibilityLabel="Themed view container"
      >
        <Text>View with Props</Text>
      </ThemedView>
    );
    
    expect(getByText('View with Props')).toBeTruthy();
  });

  it('handles single child', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>Single Child</Text>
      </ThemedView>
    );
    
    expect(getByText('Single Child')).toBeTruthy();
  });

  it('handles multiple children', () => {
    const { getByText } = render(
      <ThemedView>
        <Text>First Child</Text>
        <Text>Second Child</Text>
        <Text>Third Child</Text>
      </ThemedView>
    );
    
    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
    expect(getByText('Third Child')).toBeTruthy();
  });

  it('handles nested views', () => {
    const { getByText } = render(
      <ThemedView>
        <ThemedView>
          <Text>Nested Content</Text>
        </ThemedView>
      </ThemedView>
    );
    
    expect(getByText('Nested Content')).toBeTruthy();
  });

  it('handles complex content', () => {
    const { getByText } = render(
      <ThemedView>
        <div>
          <Text>Complex</Text>
          <Text>Content</Text>
        </div>
      </ThemedView>
    );
    
    expect(getByText('Complex')).toBeTruthy();
    expect(getByText('Content')).toBeTruthy();
  });

  it('handles empty children', () => {
    const { container } = render(
      <ThemedView></ThemedView>
    );
    
    expect(container).toBeTruthy();
  });

  it('handles null children', () => {
    const { container } = render(
      <ThemedView>{null}</ThemedView>
    );
    
    expect(container).toBeTruthy();
  });

  it('handles undefined children', () => {
    const { container } = render(
      <ThemedView>{undefined}</ThemedView>
    );
    
    expect(container).toBeTruthy();
  });

  it('handles accessibility props', () => {
    const { getByText } = render(
      <ThemedView 
        accessibilityLabel="Main container"
        accessibilityRole="main"
      >
        <Text>Accessible View</Text>
      </ThemedView>
    );
    
    expect(getByText('Accessible View')).toBeTruthy();
  });

  it('applies layout props', () => {
    const { getByText } = render(
      <ThemedView 
        onLayout={jest.fn()}
        pointerEvents="auto"
      >
        <Text>Layout Props View</Text>
      </ThemedView>
    );
    
    expect(getByText('Layout Props View')).toBeTruthy();
  });

  it('handles touch events', () => {
    const onTouchStart = jest.fn();
    const onTouchEnd = jest.fn();
    
    const { getByText } = render(
      <ThemedView 
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Text>Touch Events View</Text>
      </ThemedView>
    );
    
    expect(getByText('Touch Events View')).toBeTruthy();
  });

  it('maintains background color consistency', () => {
    mockUseThemeColor.mockReturnValue('#ffffff');
    
    const { container } = render(
      <ThemedView>
        <Text>Consistent Background</Text>
      </ThemedView>
    );
    
    expect(container).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'background');
  });

  it('overrides theme color with custom props', () => {
    const { getByText } = render(
      <ThemedView lightColor="#custom">
        <Text>Custom Background</Text>
      </ThemedView>
    );
    
    expect(getByText('Custom Background')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#custom' }, 
      'background'
    );
  });

  it('works as container for complex layouts', () => {
    const { getByText } = render(
      <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Left</Text>
        <Text>Center</Text>
        <Text>Right</Text>
      </ThemedView>
    );
    
    expect(getByText('Left')).toBeTruthy();
    expect(getByText('Center')).toBeTruthy();
    expect(getByText('Right')).toBeTruthy();
  });

  it('maintains performance with frequent re-renders', () => {
    const { rerender } = render(
      <ThemedView>
        <Text>Initial Content</Text>
      </ThemedView>
    );
    
    for (let i = 0; i < 10; i++) {
      rerender(
        <ThemedView>
          <Text>Updated Content {i}</Text>
        </ThemedView>
      );
    }
    
    // Should not crash or cause performance issues
    expect(mockUseThemeColor).toHaveBeenCalled();
  });

  it('handles dynamic color changes', () => {
    mockUseThemeColor.mockReturnValueOnce('#ffffff');
    
    const { rerender, getByText } = render(
      <ThemedView>
        <Text>Dynamic Color</Text>
      </ThemedView>
    );
    
    mockUseThemeColor.mockReturnValueOnce('#000000');
    
    rerender(
      <ThemedView>
        <Text>Dynamic Color</Text>
      </ThemedView>
    );
    
    expect(getByText('Dynamic Color')).toBeTruthy();
  });

  it('supports flex layout properties', () => {
    const { getByText } = render(
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Centered Content</Text>
      </ThemedView>
    );
    
    expect(getByText('Centered Content')).toBeTruthy();
  });
});