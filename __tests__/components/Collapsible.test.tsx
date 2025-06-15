import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Collapsible } from '../../components/Collapsible';

// Mock dependencies
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text 
        testID={`icon-${name}`} 
        style={{ fontSize: size, color }} 
        {...props}
      >
        {name}
      </Text>
    );
  },
}));

jest.mock('../../components/ThemedText', () => ({
  ThemedText: ({ children, style, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text style={style} {...props}>{children}</Text>;
  },
}));

jest.mock('../../components/ThemedView', () => ({
  ThemedView: ({ children, style, ...props }: any) => {
    const { View } = require('react-native');
    return <View style={style} {...props}>{children}</View>;
  },
}));

jest.mock('../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

describe('Collapsible', () => {
  const defaultProps = {
    title: 'Collapsible Title',
    children: <Text>Collapsible Content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(<Collapsible {...defaultProps} />);
    
    expect(getByText('Collapsible Title')).toBeTruthy();
    expect(getByText('Collapsible Content')).toBeTruthy();
  });

  it('renders with chevron down icon when collapsed', () => {
    const { getByTestId } = render(
      <Collapsible {...defaultProps} defaultExpanded={false} />
    );
    
    expect(getByTestId('icon-chevron-down')).toBeTruthy();
  });

  it('renders with chevron up icon when expanded', () => {
    const { getByTestId } = render(
      <Collapsible {...defaultProps} defaultExpanded={true} />
    );
    
    expect(getByTestId('icon-chevron-up')).toBeTruthy();
  });

  it('toggles expansion when header is pressed', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <Collapsible {...defaultProps} defaultExpanded={false} />
    );
    
    // Initially collapsed - should show chevron down
    expect(getByTestId('icon-chevron-down')).toBeTruthy();
    
    // Tap the header to expand
    fireEvent.press(getByText('Collapsible Title'));
    
    // Should now show chevron up
    expect(queryByTestId('icon-chevron-down')).toBeFalsy();
    expect(getByTestId('icon-chevron-up')).toBeTruthy();
  });

  it('shows content when expanded by default', () => {
    const { getByText } = render(
      <Collapsible {...defaultProps} defaultExpanded={true} />
    );
    
    expect(getByText('Collapsible Content')).toBeTruthy();
  });

  it('hides content when collapsed by default', () => {
    const { queryByText } = render(
      <Collapsible {...defaultProps} defaultExpanded={false} />
    );
    
    expect(queryByText('Collapsible Content')).toBeFalsy();
  });

  it('toggles content visibility when pressed', () => {
    const { getByText, queryByText } = render(
      <Collapsible {...defaultProps} defaultExpanded={false} />
    );
    
    // Initially collapsed - content should not be visible
    expect(queryByText('Collapsible Content')).toBeFalsy();
    
    // Tap to expand
    fireEvent.press(getByText('Collapsible Title'));
    
    // Content should now be visible
    expect(getByText('Collapsible Content')).toBeTruthy();
    
    // Tap again to collapse
    fireEvent.press(getByText('Collapsible Title'));
    
    // Content should be hidden again
    expect(queryByText('Collapsible Content')).toBeFalsy();
  });

  it('calls onToggle callback when provided', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <Collapsible 
        {...defaultProps} 
        defaultExpanded={false}
        onToggle={onToggle}
      />
    );
    
    fireEvent.press(getByText('Collapsible Title'));
    
    expect(onToggle).toHaveBeenCalledWith(true);
    
    fireEvent.press(getByText('Collapsible Title'));
    
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('renders with custom style', () => {
    const customStyle = { margin: 10 };
    const { getByText } = render(
      <Collapsible {...defaultProps} style={customStyle} />
    );
    
    expect(getByText('Collapsible Title')).toBeTruthy();
  });

  it('renders with custom header style', () => {
    const customHeaderStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <Collapsible {...defaultProps} headerStyle={customHeaderStyle} />
    );
    
    expect(getByText('Collapsible Title')).toBeTruthy();
  });

  it('renders with custom content style', () => {
    const customContentStyle = { padding: 20 };
    const { getByText } = render(
      <Collapsible 
        {...defaultProps} 
        contentStyle={customContentStyle}
        defaultExpanded={true}
      />
    );
    
    expect(getByText('Collapsible Content')).toBeTruthy();
  });

  it('handles complex content', () => {
    const complexContent = (
      <div>
        <Text>Line 1</Text>
        <Text>Line 2</Text>
        <Text>Line 3</Text>
      </div>
    );
    
    const { getByText } = render(
      <Collapsible 
        title="Complex Content" 
        defaultExpanded={true}
      >
        {complexContent}
      </Collapsible>
    );
    
    expect(getByText('Complex Content')).toBeTruthy();
    expect(getByText('Line 1')).toBeTruthy();
    expect(getByText('Line 2')).toBeTruthy();
    expect(getByText('Line 3')).toBeTruthy();
  });

  it('renders without content', () => {
    const { getByText } = render(
      <Collapsible title="Empty Collapsible" />
    );
    
    expect(getByText('Empty Collapsible')).toBeTruthy();
  });

  it('handles disabled state', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <Collapsible 
        {...defaultProps} 
        disabled={true}
        onToggle={onToggle}
      />
    );
    
    fireEvent.press(getByText('Collapsible Title'));
    
    // Should not call onToggle when disabled
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('uses theme colors correctly', () => {
    const mockUseThemeColor = require('../../hooks/useThemeColor').useThemeColor;
    mockUseThemeColor.mockReturnValue('#ff0000');
    
    const { getByText } = render(<Collapsible {...defaultProps} />);
    
    expect(getByText('Collapsible Title')).toBeTruthy();
    expect(mockUseThemeColor).toHaveBeenCalled();
  });

  it('handles animation props', () => {
    const { getByText } = render(
      <Collapsible 
        {...defaultProps}
        animated={true}
        animationDuration={300}
      />
    );
    
    expect(getByText('Collapsible Title')).toBeTruthy();
  });

  it('renders with custom icon', () => {
    const { getByText, getByTestId } = render(
      <Collapsible 
        {...defaultProps}
        expandedIcon="arrow-up"
        collapsedIcon="arrow-down"
        defaultExpanded={false}
      />
    );
    
    expect(getByText('Collapsible Title')).toBeTruthy();
    expect(getByTestId('icon-arrow-down')).toBeTruthy();
  });

  it('maintains state across re-renders', () => {
    const { getByText, rerender } = render(
      <Collapsible {...defaultProps} defaultExpanded={false} />
    );
    
    // Expand the collapsible
    fireEvent.press(getByText('Collapsible Title'));
    
    // Re-render with different props
    rerender(<Collapsible title="Updated Title" defaultExpanded={false}>
      <Text>Updated Content</Text>
    </Collapsible>);
    
    expect(getByText('Updated Title')).toBeTruthy();
  });
});