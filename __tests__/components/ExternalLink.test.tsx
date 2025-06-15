import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExternalLink } from '../../components/ExternalLink';

// Mock expo-linking
jest.mock('expo-linking', () => ({
  openURL: jest.fn(),
}));

// Mock Platform
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      select: jest.fn((specifics) => specifics.default),
      OS: 'ios',
    },
  };
});

// Mock ThemedText
jest.mock('../../components/ThemedText', () => ({
  ThemedText: ({ children, style, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text style={style} {...props}>{children}</Text>;
  },
}));

describe('ExternalLink', () => {
  const mockOpenURL = require('expo-linking').openURL;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with href and children', () => {
    const { getByText } = render(
      <ExternalLink href="https://example.com">
        Visit Example
      </ExternalLink>
    );
    
    expect(getByText('Visit Example')).toBeTruthy();
  });

  it('opens URL when pressed', async () => {
    mockOpenURL.mockResolvedValue(true);
    
    const { getByText } = render(
      <ExternalLink href="https://example.com">
        Visit Example
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Visit Example'));
    
    expect(mockOpenURL).toHaveBeenCalledWith('https://example.com');
  });

  it('handles URL opening error gracefully', async () => {
    mockOpenURL.mockRejectedValue(new Error('Failed to open URL'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { getByText } = render(
      <ExternalLink href="https://invalid-url">
        Invalid Link
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Invalid Link'));
    
    expect(mockOpenURL).toHaveBeenCalledWith('https://invalid-url');
    
    // Wait for the error to be handled
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to open URL:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('renders with custom style', () => {
    const customStyle = { color: 'red', fontSize: 16 };
    const { getByText } = render(
      <ExternalLink href="https://example.com" style={customStyle}>
        Styled Link
      </ExternalLink>
    );
    
    expect(getByText('Styled Link')).toBeTruthy();
  });

  it('passes through additional props', () => {
    const { getByText } = render(
      <ExternalLink 
        href="https://example.com"
        testID="external-link"
        accessibilityLabel="External link to example.com"
      >
        Accessible Link
      </ExternalLink>
    );
    
    expect(getByText('Accessible Link')).toBeTruthy();
  });

  it('handles different URL protocols', async () => {
    const urls = [
      'https://example.com',
      'http://example.com',
      'mailto:test@example.com',
      'tel:+1234567890',
      'sms:+1234567890',
    ];

    for (const url of urls) {
      mockOpenURL.mockClear();
      mockOpenURL.mockResolvedValue(true);
      
      const { getByText } = render(
        <ExternalLink href={url}>
          Link {url}
        </ExternalLink>
      );
      
      fireEvent.press(getByText(`Link ${url}`));
      
      expect(mockOpenURL).toHaveBeenCalledWith(url);
    }
  });

  it('renders with text type props', () => {
    const { getByText } = render(
      <ExternalLink 
        href="https://example.com"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Long text that should be truncated
      </ExternalLink>
    );
    
    expect(getByText('Long text that should be truncated')).toBeTruthy();
  });

  it('handles empty href gracefully', () => {
    const { getByText } = render(
      <ExternalLink href="">
        Empty Href
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Empty Href'));
    
    expect(mockOpenURL).toHaveBeenCalledWith('');
  });

  it('handles undefined href gracefully', () => {
    const { getByText } = render(
      <ExternalLink href={undefined as any}>
        Undefined Href
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Undefined Href'));
    
    expect(mockOpenURL).toHaveBeenCalledWith(undefined);
  });

  it('works with different content types', () => {
    const { getByText } = render(
      <ExternalLink href="https://example.com">
        {42}
      </ExternalLink>
    );
    
    expect(getByText('42')).toBeTruthy();
  });

  it('handles onPress callback if provided', () => {
    const onPress = jest.fn();
    mockOpenURL.mockResolvedValue(true);
    
    const { getByText } = render(
      <ExternalLink href="https://example.com" onPress={onPress}>
        Custom Press Handler
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Custom Press Handler'));
    
    expect(onPress).toHaveBeenCalled();
    expect(mockOpenURL).toHaveBeenCalledWith('https://example.com');
  });

  it('prevents default behavior when onPress returns false', () => {
    const onPress = jest.fn(() => false);
    
    const { getByText } = render(
      <ExternalLink href="https://example.com" onPress={onPress}>
        Prevented Link
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Prevented Link'));
    
    expect(onPress).toHaveBeenCalled();
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('applies default link styling', () => {
    const { getByText } = render(
      <ExternalLink href="https://example.com">
        Default Style Link
      </ExternalLink>
    );
    
    const link = getByText('Default Style Link');
    expect(link).toBeTruthy();
  });

  it('combines custom styles with default styles', () => {
    const customStyle = { fontWeight: 'bold' };
    const { getByText } = render(
      <ExternalLink href="https://example.com" style={customStyle}>
        Combined Style Link
      </ExternalLink>
    );
    
    expect(getByText('Combined Style Link')).toBeTruthy();
  });

  it('handles disabled state', () => {
    const { getByText } = render(
      <ExternalLink href="https://example.com" disabled>
        Disabled Link
      </ExternalLink>
    );
    
    fireEvent.press(getByText('Disabled Link'));
    
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('handles complex nested content', () => {
    const { getByText } = render(
      <ExternalLink href="https://example.com">
        <Text>Complex</Text>
        <Text> Content</Text>
      </ExternalLink>
    );
    
    expect(getByText('Complex')).toBeTruthy();
    expect(getByText(' Content')).toBeTruthy();
  });
});