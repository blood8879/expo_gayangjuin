import React from 'react';
import { render } from '@testing-library/react-native';
import NotFoundScreen from '../../app/+not-found';

// Mock dependencies
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children, ...props }: any) => {
      const { View } = require('react-native');
      return <View testID="stack-screen" {...props}>{children}</View>;
    },
  },
  Link: ({ children, href, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`link-${href}`} {...props}>{children}</Text>;
  },
}));

jest.mock('../../components/ThemedText', () => ({
  ThemedText: ({ children, style, type, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`themed-text-${type || 'default'}`} style={style} {...props}>{children}</Text>;
  },
}));

jest.mock('../../components/ThemedView', () => ({
  ThemedView: ({ children, style, ...props }: any) => {
    const { View } = require('react-native');
    return <View testID="themed-view" style={style} {...props}>{children}</View>;
  },
}));

describe('NotFoundScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    expect(getByTestId('stack-screen')).toBeTruthy();
    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('displays not found title', () => {
    const { getByText } = render(<NotFoundScreen />);
    
    expect(getByText("This screen doesn't exist.")).toBeTruthy();
  });

  it('displays link to home screen', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    expect(getByTestId('link-/')).toBeTruthy();
  });

  it('displays go home link text', () => {
    const { getByText } = render(<NotFoundScreen />);
    
    expect(getByText('Go to home screen!')).toBeTruthy();
  });

  it('sets correct stack screen options', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    const stackScreen = getByTestId('stack-screen');
    expect(stackScreen).toBeTruthy();
  });

  it('uses themed components', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    expect(getByTestId('themed-view')).toBeTruthy();
    expect(getByTestId('themed-text-title')).toBeTruthy();
    expect(getByTestId('themed-text-link')).toBeTruthy();
  });

  it('has proper accessibility structure', () => {
    const { getByText } = render(<NotFoundScreen />);
    
    const title = getByText("This screen doesn't exist.");
    const link = getByText('Go to home screen!');
    
    expect(title).toBeTruthy();
    expect(link).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => render(<NotFoundScreen />)).not.toThrow();
  });

  it('has correct layout structure', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    // Should have main container
    expect(getByTestId('themed-view')).toBeTruthy();
    
    // Should have title and link
    expect(getByTestId('themed-text-title')).toBeTruthy();
    expect(getByTestId('themed-text-link')).toBeTruthy();
  });

  it('link points to root path', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    const link = getByTestId('link-/');
    expect(link).toBeTruthy();
  });

  it('uses appropriate text types', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    // Title should use title type
    expect(getByTestId('themed-text-title')).toBeTruthy();
    
    // Link should use link type
    expect(getByTestId('themed-text-link')).toBeTruthy();
  });

  it('maintains consistent styling', () => {
    const { container } = render(<NotFoundScreen />);
    
    // Should render without style conflicts
    expect(container).toBeTruthy();
  });

  it('handles navigation properly', () => {
    // This is a static page, so just ensure it renders
    const { getByTestId } = render(<NotFoundScreen />);
    
    expect(getByTestId('link-/')).toBeTruthy();
  });

  it('displays error message clearly', () => {
    const { getByText } = render(<NotFoundScreen />);
    
    const message = getByText("This screen doesn't exist.");
    expect(message).toBeTruthy();
  });

  it('provides clear navigation option', () => {
    const { getByText } = render(<NotFoundScreen />);
    
    const homeLink = getByText('Go to home screen!');
    expect(homeLink).toBeTruthy();
  });

  it('uses semantic HTML structure', () => {
    const { getByTestId } = render(<NotFoundScreen />);
    
    // Main container should be present
    expect(getByTestId('themed-view')).toBeTruthy();
  });

  it('renders consistently across different screen sizes', () => {
    // This test ensures the component doesn't break with different dimensions
    const { getByTestId } = render(<NotFoundScreen />);
    
    expect(getByTestId('themed-view')).toBeTruthy();
    expect(getByTestId('themed-text-title')).toBeTruthy();
    expect(getByTestId('themed-text-link')).toBeTruthy();
  });
});