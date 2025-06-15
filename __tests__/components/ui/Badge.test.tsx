import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../../../components/ui/Badge';

// Mock dependencies
jest.mock('../../../hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('../../../components/ThemedText', () => ({
  ThemedText: ({ children, style, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text style={style} {...props}>{children}</Text>;
  },
}));

jest.mock('../../../components/ThemedView', () => ({
  ThemedView: ({ children, style, ...props }: any) => {
    const { View } = require('react-native');
    return <View style={style} {...props}>{children}</View>;
  },
}));

describe('Badge', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Badge>Default Badge</Badge>);
    
    expect(getByText('Default Badge')).toBeTruthy();
  });

  it('renders with primary variant', () => {
    const { getByText } = render(
      <Badge variant="primary">Primary Badge</Badge>
    );
    
    expect(getByText('Primary Badge')).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    const { getByText } = render(
      <Badge variant="secondary">Secondary Badge</Badge>
    );
    
    expect(getByText('Secondary Badge')).toBeTruthy();
  });

  it('renders with success variant', () => {
    const { getByText } = render(
      <Badge variant="success">Success Badge</Badge>
    );
    
    expect(getByText('Success Badge')).toBeTruthy();
  });

  it('renders with warning variant', () => {
    const { getByText } = render(
      <Badge variant="warning">Warning Badge</Badge>
    );
    
    expect(getByText('Warning Badge')).toBeTruthy();
  });

  it('renders with danger variant', () => {
    const { getByText } = render(
      <Badge variant="danger">Danger Badge</Badge>
    );
    
    expect(getByText('Danger Badge')).toBeTruthy();
  });

  it('renders with small size', () => {
    const { getByText } = render(
      <Badge size="small">Small Badge</Badge>
    );
    
    expect(getByText('Small Badge')).toBeTruthy();
  });

  it('renders with medium size (default)', () => {
    const { getByText } = render(
      <Badge size="medium">Medium Badge</Badge>
    );
    
    expect(getByText('Medium Badge')).toBeTruthy();
  });

  it('renders with large size', () => {
    const { getByText } = render(
      <Badge size="large">Large Badge</Badge>
    );
    
    expect(getByText('Large Badge')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { margin: 10 };
    const { getByText } = render(
      <Badge style={customStyle}>Styled Badge</Badge>
    );
    
    expect(getByText('Styled Badge')).toBeTruthy();
  });

  it('applies custom text style', () => {
    const customTextStyle = { fontSize: 16 };
    const { getByText } = render(
      <Badge textStyle={customTextStyle}>Custom Text Badge</Badge>
    );
    
    expect(getByText('Custom Text Badge')).toBeTruthy();
  });

  it('renders with outline style', () => {
    const { getByText } = render(
      <Badge variant="primary" outline>Outline Badge</Badge>
    );
    
    expect(getByText('Outline Badge')).toBeTruthy();
  });

  it('renders with rounded style', () => {
    const { getByText } = render(
      <Badge rounded>Rounded Badge</Badge>
    );
    
    expect(getByText('Rounded Badge')).toBeTruthy();
  });

  it('combines multiple props correctly', () => {
    const { getByText } = render(
      <Badge 
        variant="success" 
        size="large" 
        outline 
        rounded
        style={{ margin: 5 }}
        textStyle={{ fontWeight: 'bold' }}
      >
        Complex Badge
      </Badge>
    );
    
    expect(getByText('Complex Badge')).toBeTruthy();
  });

  it('handles dark color scheme', () => {
    const mockUseColorScheme = require('../../../hooks/useColorScheme').useColorScheme;
    mockUseColorScheme.mockReturnValue('dark');
    
    const { getByText } = render(
      <Badge variant="primary">Dark Theme Badge</Badge>
    );
    
    expect(getByText('Dark Theme Badge')).toBeTruthy();
  });

  it('renders empty content', () => {
    const { container } = render(<Badge></Badge>);
    
    expect(container).toBeTruthy();
  });

  it('renders with number content', () => {
    const { getByText } = render(<Badge>{42}</Badge>);
    
    expect(getByText('42')).toBeTruthy();
  });

  it('renders with React element content', () => {
    const { getByText } = render(
      <Badge>
        <span>Complex Content</span>
      </Badge>
    );
    
    expect(getByText('Complex Content')).toBeTruthy();
  });
});