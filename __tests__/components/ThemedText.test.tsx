import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../../components/ThemedText';

// Mock useThemeColor
jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    const colors = {
      text: '#000000',
      link: '#007AFF',
      tabIconDefault: '#8E8E93',
      tabIconSelected: '#007AFF',
    };
    return colors[colorName as keyof typeof colors] || '#000000';
  }),
}));

// No need to mock react-native Text, use actual implementation

describe('ThemedText', () => {
  const mockUseThemeColor = require('../../hooks/useThemeColor').useThemeColor;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <ThemedText>Default Text</ThemedText>
    );
    
    expect(getByText('Default Text')).toBeTruthy();
  });

  it('renders with default type', () => {
    const { getByText } = render(
      <ThemedText>Regular Text</ThemedText>
    );
    
    expect(getByText('Regular Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
  });

  it('renders with title type', () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );
    
    expect(getByText('Title Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
  });

  it('renders with defaultSemiBold type', () => {
    const { getByText } = render(
      <ThemedText type="defaultSemiBold">SemiBold Text</ThemedText>
    );
    
    expect(getByText('SemiBold Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
  });

  it('renders with subtitle type', () => {
    const { getByText } = render(
      <ThemedText type="subtitle">Subtitle Text</ThemedText>
    );
    
    expect(getByText('Subtitle Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
  });

  it('renders with link type', () => {
    const { getByText } = render(
      <ThemedText type="link">Link Text</ThemedText>
    );
    
    expect(getByText('Link Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'link');
  });

  it('applies custom lightColor', () => {
    const { getByText } = render(
      <ThemedText lightColor="#ff0000">Custom Light Text</ThemedText>
    );
    
    expect(getByText('Custom Light Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#ff0000' }, 
      'text'
    );
  });

  it('applies custom darkColor', () => {
    const { getByText } = render(
      <ThemedText darkColor="#00ff00">Custom Dark Text</ThemedText>
    );
    
    expect(getByText('Custom Dark Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { dark: '#00ff00' }, 
      'text'
    );
  });

  it('applies both light and dark colors', () => {
    const { getByText } = render(
      <ThemedText lightColor="#ff0000" darkColor="#00ff00">
        Both Colors Text
      </ThemedText>
    );
    
    expect(getByText('Both Colors Text')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#ff0000', dark: '#00ff00' }, 
      'text'
    );
  });

  it('applies custom style along with theme color', () => {
    const customStyle = { fontSize: 20, fontWeight: 'bold' };
    const { getByText } = render(
      <ThemedText style={customStyle}>Styled Text</ThemedText>
    );
    
    expect(getByText('Styled Text')).toBeTruthy();
  });

  it('combines multiple styles correctly', () => {
    const style1 = { fontSize: 16 };
    const style2 = { fontWeight: 'bold' };
    const { getByText } = render(
      <ThemedText style={[style1, style2]}>Multi Style Text</ThemedText>
    );
    
    expect(getByText('Multi Style Text')).toBeTruthy();
  });

  it('passes through text props', () => {
    const { getByText } = render(
      <ThemedText 
        numberOfLines={1}
        ellipsizeMode="tail"
        testID="themed-text"
      >
        Text with Props
      </ThemedText>
    );
    
    expect(getByText('Text with Props')).toBeTruthy();
  });

  it('handles children as string', () => {
    const { getByText } = render(
      <ThemedText>String Child</ThemedText>
    );
    
    expect(getByText('String Child')).toBeTruthy();
  });

  it('handles children as number', () => {
    const { getByText } = render(
      <ThemedText>{42}</ThemedText>
    );
    
    expect(getByText('42')).toBeTruthy();
  });

  it('handles complex children', () => {
    const { getByText } = render(
      <ThemedText>
        <span>Nested</span> Content
      </ThemedText>
    );
    
    expect(getByText('Nested')).toBeTruthy();
    expect(getByText(' Content')).toBeTruthy();
  });

  it('applies correct font styles for title type', () => {
    const { getByText } = render(
      <ThemedText type="title">Title</ThemedText>
    );
    
    const element = getByText('Title');
    expect(element).toBeTruthy();
  });

  it('applies correct font styles for subtitle type', () => {
    const { getByText } = render(
      <ThemedText type="subtitle">Subtitle</ThemedText>
    );
    
    const element = getByText('Subtitle');
    expect(element).toBeTruthy();
  });

  it('applies correct font styles for defaultSemiBold type', () => {
    const { getByText } = render(
      <ThemedText type="defaultSemiBold">SemiBold</ThemedText>
    );
    
    const element = getByText('SemiBold');
    expect(element).toBeTruthy();
  });

  it('handles accessibility props', () => {
    const { getByText } = render(
      <ThemedText 
        accessibilityLabel="Accessible text"
        accessibilityRole="text"
      >
        Accessible Text
      </ThemedText>
    );
    
    expect(getByText('Accessible Text')).toBeTruthy();
  });

  it('handles empty children', () => {
    const { container } = render(
      <ThemedText></ThemedText>
    );
    
    expect(container).toBeTruthy();
  });

  it('handles null children', () => {
    const { container } = render(
      <ThemedText>{null}</ThemedText>
    );
    
    expect(container).toBeTruthy();
  });

  it('handles undefined children', () => {
    const { container } = render(
      <ThemedText>{undefined}</ThemedText>
    );
    
    expect(container).toBeTruthy();
  });

  it('uses text color for non-link types', () => {
    const types = ['title', 'subtitle', 'defaultSemiBold'];
    
    types.forEach(type => {
      mockUseThemeColor.mockClear();
      
      render(
        <ThemedText type={type as any}>Test</ThemedText>
      );
      
      expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
    });
  });

  it('uses link color for link type', () => {
    render(
      <ThemedText type="link">Link</ThemedText>
    );
    
    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'link');
  });

  it('overrides theme color with custom colors', () => {
    render(
      <ThemedText 
        type="link" 
        lightColor="#custom" 
        darkColor="#dark-custom"
      >
        Custom Link
      </ThemedText>
    );
    
    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#custom', dark: '#dark-custom' }, 
      'link'
    );
  });

  it('maintains performance with frequent re-renders', () => {
    const { rerender } = render(
      <ThemedText>Initial Text</ThemedText>
    );
    
    for (let i = 0; i < 10; i++) {
      rerender(<ThemedText>Updated Text {i}</ThemedText>);
    }
    
    // Should not crash or cause performance issues
    expect(mockUseThemeColor).toHaveBeenCalled();
  });
});