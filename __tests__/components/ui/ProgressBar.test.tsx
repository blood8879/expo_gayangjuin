import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressBar } from '../../../components/ui/ProgressBar';

// Mock dependencies
jest.mock('../../../hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('../../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    const colors = {
      light: {
        background: '#f0f0f0',
        primary: '#007AFF',
        text: '#000000',
      },
      dark: {
        background: '#2c2c2c',
        primary: '#0A84FF',
        text: '#ffffff',
      }
    };
    return colors.light[colorName as keyof typeof colors.light] || '#000000';
  }),
}));

describe('ProgressBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { container } = render(<ProgressBar progress={50} />);
    
    expect(container).toBeTruthy();
  });

  it('renders with 0% progress', () => {
    const { container } = render(<ProgressBar progress={0} />);
    
    expect(container).toBeTruthy();
  });

  it('renders with 100% progress', () => {
    const { container } = render(<ProgressBar progress={100} />);
    
    expect(container).toBeTruthy();
  });

  it('renders with custom height', () => {
    const { container } = render(
      <ProgressBar progress={50} height={20} />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { container } = render(
      <ProgressBar progress={50} color="#ff0000" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with custom background color', () => {
    const { container } = render(
      <ProgressBar progress={50} backgroundColor="#00ff00" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with custom style', () => {
    const customStyle = { margin: 10, borderRadius: 5 };
    const { container } = render(
      <ProgressBar progress={50} style={customStyle} />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(
      <ProgressBar progress={50} showLabel label="50%" />
    );
    
    expect(getByText('50%')).toBeTruthy();
  });

  it('renders with custom label', () => {
    const { getByText } = render(
      <ProgressBar progress={75} showLabel label="Loading..." />
    );
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders with percentage label when showLabel is true but no label provided', () => {
    const { getByText } = render(
      <ProgressBar progress={75} showLabel />
    );
    
    expect(getByText('75%')).toBeTruthy();
  });

  it('does not render label when showLabel is false', () => {
    const { queryByText } = render(
      <ProgressBar progress={50} showLabel={false} label="Hidden" />
    );
    
    expect(queryByText('Hidden')).toBeFalsy();
  });

  it('handles progress values over 100', () => {
    const { container } = render(<ProgressBar progress={150} />);
    
    expect(container).toBeTruthy();
  });

  it('handles negative progress values', () => {
    const { container } = render(<ProgressBar progress={-10} />);
    
    expect(container).toBeTruthy();
  });

  it('renders with animated prop', () => {
    const { container } = render(
      <ProgressBar progress={50} animated />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with rounded corners', () => {
    const { container } = render(
      <ProgressBar progress={50} rounded />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with striped pattern', () => {
    const { container } = render(
      <ProgressBar progress={50} striped />
    );
    
    expect(container).toBeTruthy();
  });

  it('combines multiple styling props', () => {
    const { getByText, container } = render(
      <ProgressBar 
        progress={75} 
        height={25}
        color="#ff6b6b"
        backgroundColor="#f1f3f4"
        showLabel
        label="Custom Progress"
        animated
        rounded
        striped
        style={{ margin: 20 }}
      />
    );
    
    expect(container).toBeTruthy();
    expect(getByText('Custom Progress')).toBeTruthy();
  });

  it('handles dark color scheme', () => {
    const mockUseColorScheme = require('../../../hooks/useColorScheme').useColorScheme;
    const mockUseThemeColor = require('../../../hooks/useThemeColor').useThemeColor;
    
    mockUseColorScheme.mockReturnValue('dark');
    mockUseThemeColor.mockImplementation((props, colorName) => {
      const colors = {
        background: '#2c2c2c',
        primary: '#0A84FF',
        text: '#ffffff',
      };
      return colors[colorName as keyof typeof colors] || '#ffffff';
    });
    
    const { container } = render(<ProgressBar progress={50} />);
    
    expect(container).toBeTruthy();
  });

  it('renders with small size', () => {
    const { container } = render(
      <ProgressBar progress={50} size="small" />
    );
    
    expect(container).toBeTruthy();
  });

  it('renders with large size', () => {
    const { container } = render(
      <ProgressBar progress={50} size="large" />
    );
    
    expect(container).toBeTruthy();
  });

  it('updates progress dynamically', () => {
    const { rerender, container } = render(
      <ProgressBar progress={25} />
    );
    
    expect(container).toBeTruthy();
    
    rerender(<ProgressBar progress={75} />);
    
    expect(container).toBeTruthy();
  });
});