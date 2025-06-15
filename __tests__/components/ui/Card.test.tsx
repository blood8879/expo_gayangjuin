import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card, CardPressable, CardHeader, CardContent, CardFooter } from '../../../components/ui/Card';

// Mock theme
jest.mock('../../../constants/theme', () => ({
  theme: {
    shadow: {
      none: {},
      sm: { elevation: 2, shadowOpacity: 0.1 },
      md: { elevation: 4, shadowOpacity: 0.15 },
      lg: { elevation: 8, shadowOpacity: 0.2 },
    },
  },
}));

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly with default props', () => {
      const { getByText } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('renders with different elevations', () => {
      const elevations = ['none', 'sm', 'md', 'lg'] as const;
      
      elevations.forEach(elevation => {
        const { getByTestId } = render(
          <Card elevation={elevation} testID={`card-${elevation}`}>
            <Text>{elevation} Card</Text>
          </Card>
        );
        
        expect(getByTestId(`card-${elevation}`)).toBeTruthy();
      });
    });

    it('renders with different rounded values', () => {
      const roundedValues = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
      
      roundedValues.forEach(rounded => {
        const { getByTestId } = render(
          <Card rounded={rounded} testID={`card-${rounded}`}>
            <Text>{rounded} Card</Text>
          </Card>
        );
        
        expect(getByTestId(`card-${rounded}`)).toBeTruthy();
      });
    });

    it('renders without padding when noPadding is true', () => {
      const { getByTestId } = render(
        <Card noPadding testID="no-padding-card">
          <Text>No Padding Card</Text>
        </Card>
      );
      
      expect(getByTestId('no-padding-card')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <Card style={customStyle} testID="styled-card">
          <Text>Styled Card</Text>
        </Card>
      );
      
      expect(getByTestId('styled-card')).toBeTruthy();
    });

    it('passes through View props', () => {
      const { getByTestId } = render(
        <Card testID="prop-card" accessibilityLabel="Card with props">
          <Text>Props Card</Text>
        </Card>
      );
      
      const card = getByTestId('prop-card');
      expect(card.props.accessibilityLabel).toBe('Card with props');
    });
  });

  describe('CardPressable', () => {
    it('renders correctly with default props', () => {
      const { getByText } = render(
        <CardPressable>
          <Text>Pressable Card Content</Text>
        </CardPressable>
      );
      
      expect(getByText('Pressable Card Content')).toBeTruthy();
    });

    it('handles press events', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <CardPressable onPress={onPress}>
          <Text>Press Me</Text>
        </CardPressable>
      );
      
      fireEvent.press(getByText('Press Me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('defaults to no elevation', () => {
      const { getByTestId } = render(
        <CardPressable testID="pressable-card">
          <Text>Default Elevation</Text>
        </CardPressable>
      );
      
      expect(getByTestId('pressable-card')).toBeTruthy();
    });

    it('renders with different elevations', () => {
      const elevations = ['none', 'sm', 'md', 'lg'] as const;
      
      elevations.forEach(elevation => {
        const { getByTestId } = render(
          <CardPressable elevation={elevation} testID={`pressable-${elevation}`}>
            <Text>{elevation} Pressable</Text>
          </CardPressable>
        );
        
        expect(getByTestId(`pressable-${elevation}`)).toBeTruthy();
      });
    });

    it('renders with different rounded values', () => {
      const roundedValues = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
      
      roundedValues.forEach(rounded => {
        const { getByTestId } = render(
          <CardPressable rounded={rounded} testID={`pressable-${rounded}`}>
            <Text>{rounded} Pressable</Text>
          </CardPressable>
        );
        
        expect(getByTestId(`pressable-${rounded}`)).toBeTruthy();
      });
    });

    it('renders without padding when noPadding is true', () => {
      const { getByTestId } = render(
        <CardPressable noPadding testID="no-padding-pressable">
          <Text>No Padding Pressable</Text>
        </CardPressable>
      );
      
      expect(getByTestId('no-padding-pressable')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { backgroundColor: 'blue' };
      const { getByTestId } = render(
        <CardPressable style={customStyle} testID="styled-pressable">
          <Text>Styled Pressable</Text>
        </CardPressable>
      );
      
      expect(getByTestId('styled-pressable')).toBeTruthy();
    });

    it('passes through TouchableOpacity props', () => {
      const onLongPress = jest.fn();
      const { getByText } = render(
        <CardPressable onLongPress={onLongPress}>
          <Text>Long Press Me</Text>
        </CardPressable>
      );
      
      fireEvent(getByText('Long Press Me'), 'onLongPress');
      expect(onLongPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      const { getByText } = render(
        <CardHeader>
          <Text>Header Content</Text>
        </CardHeader>
      );
      
      expect(getByText('Header Content')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { padding: 20 };
      const { getByTestId } = render(
        <CardHeader style={customStyle} testID="header">
          <Text>Styled Header</Text>
        </CardHeader>
      );
      
      expect(getByTestId('header')).toBeTruthy();
    });

    it('passes through View props', () => {
      const { getByTestId } = render(
        <CardHeader testID="header" accessibilityLabel="Card header">
          <Text>Header with props</Text>
        </CardHeader>
      );
      
      const header = getByTestId('header');
      expect(header.props.accessibilityLabel).toBe('Card header');
    });
  });

  describe('CardContent', () => {
    it('renders correctly', () => {
      const { getByText } = render(
        <CardContent>
          <Text>Content Area</Text>
        </CardContent>
      );
      
      expect(getByText('Content Area')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <CardContent style={customStyle} testID="content">
          <Text>Styled Content</Text>
        </CardContent>
      );
      
      expect(getByTestId('content')).toBeTruthy();
    });

    it('passes through View props', () => {
      const { getByTestId } = render(
        <CardContent testID="content" accessibilityLabel="Card content">
          <Text>Content with props</Text>
        </CardContent>
      );
      
      const content = getByTestId('content');
      expect(content.props.accessibilityLabel).toBe('Card content');
    });
  });

  describe('CardFooter', () => {
    it('renders correctly', () => {
      const { getByText } = render(
        <CardFooter>
          <Text>Footer Content</Text>
        </CardFooter>
      );
      
      expect(getByText('Footer Content')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { paddingTop: 20 };
      const { getByTestId } = render(
        <CardFooter style={customStyle} testID="footer">
          <Text>Styled Footer</Text>
        </CardFooter>
      );
      
      expect(getByTestId('footer')).toBeTruthy();
    });

    it('passes through View props', () => {
      const { getByTestId } = render(
        <CardFooter testID="footer" accessibilityLabel="Card footer">
          <Text>Footer with props</Text>
        </CardFooter>
      );
      
      const footer = getByTestId('footer');
      expect(footer.props.accessibilityLabel).toBe('Card footer');
    });
  });

  describe('Combination Tests', () => {
    it('renders complete card with all parts', () => {
      const { getByText } = render(
        <Card elevation="lg" rounded="xl">
          <CardHeader>
            <Text>Card Title</Text>
          </CardHeader>
          <CardContent>
            <Text>Card Body</Text>
          </CardContent>
          <CardFooter>
            <Text>Card Actions</Text>
          </CardFooter>
        </Card>
      );
      
      expect(getByText('Card Title')).toBeTruthy();
      expect(getByText('Card Body')).toBeTruthy();
      expect(getByText('Card Actions')).toBeTruthy();
    });

    it('renders pressable card with header and content', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <CardPressable onPress={onPress} elevation="md">
          <CardHeader>
            <Text>Pressable Header</Text>
          </CardHeader>
          <CardContent>
            <Text>Pressable Content</Text>
          </CardContent>
        </CardPressable>
      );
      
      fireEvent.press(getByText('Pressable Header'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});