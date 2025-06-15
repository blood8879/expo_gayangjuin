import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../components/ui/Button';

describe('Button Component', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(
      <Button testID="test-button">Default Button</Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should handle onPress callback', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button testID="test-button" onPress={onPressMock}>
        Press Me
      </Button>
    );

    const button = getByTestId('test-button');
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should render with primary variant', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="primary">
        Primary Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="secondary">
        Secondary Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="outline">
        Outline Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with ghost variant', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="ghost">
        Ghost Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with destructive variant', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="destructive">
        Destructive Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByTestId } = render(
      <Button testID="test-button" size="sm">
        Small Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with default size', () => {
    const { getByTestId } = render(
      <Button testID="test-button" size="default">
        Default Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with large size', () => {
    const { getByTestId } = render(
      <Button testID="test-button" size="lg">
        Large Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should render with icon size', () => {
    const { getByTestId } = render(
      <Button testID="test-button" size="icon">
        Icon
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button testID="test-button" disabled onPress={onPressMock}>
        Disabled Button
      </Button>
    );

    const button = getByTestId('test-button');
    fireEvent.press(button);
    
    // onPress should not be called when disabled
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Button testID="test-button" className="custom-class">
        Custom Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should handle multiple presses', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button testID="test-button" onPress={onPressMock}>
        Multi Press
      </Button>
    );

    const button = getByTestId('test-button');
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledTimes(3);
  });

  it('should render children correctly', () => {
    const { getByText } = render(
      <Button>Test Button Text</Button>
    );

    expect(getByText('Test Button Text')).toBeTruthy();
  });

  it('should combine variant and size props correctly', () => {
    const { getByTestId } = render(
      <Button testID="test-button" variant="primary" size="lg">
        Primary Large
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should handle onPress with parameters', () => {
    const onPressMock = jest.fn();
    const TestComponent = () => {
      const handlePress = () => {
        onPressMock('custom-parameter');
      };
      
      return (
        <Button testID="test-button" onPress={handlePress}>
          Press With Params
        </Button>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const button = getByTestId('test-button');
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledWith('custom-parameter');
  });

  it('should work without onPress callback', () => {
    const { getByTestId } = render(
      <Button testID="test-button">
        No OnPress
      </Button>
    );

    const button = getByTestId('test-button');
    
    // Should not throw error when pressed without onPress
    expect(() => fireEvent.press(button)).not.toThrow();
  });

  it('should handle async onPress callback', async () => {
    const asyncOnPress = jest.fn().mockResolvedValue('success');
    
    const { getByTestId } = render(
      <Button testID="test-button" onPress={asyncOnPress}>
        Async Button
      </Button>
    );

    const button = getByTestId('test-button');
    fireEvent.press(button);
    
    expect(asyncOnPress).toHaveBeenCalled();
  });

  it('should render with complex children', () => {
    const { getByTestId, getByText } = render(
      <Button testID="test-button">
        <span>Complex</span> Button
      </Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
    expect(getByText('Button')).toBeTruthy();
  });

  it('should handle rapid successive presses', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button testID="test-button" onPress={onPressMock}>
        Rapid Press
      </Button>
    );

    const button = getByTestId('test-button');
    
    // Simulate rapid presses
    for (let i = 0; i < 10; i++) {
      fireEvent.press(button);
    }
    
    expect(onPressMock).toHaveBeenCalledTimes(10);
  });

  it('should maintain ref when passed', () => {
    const ref = React.createRef<any>();
    
    render(
      <Button ref={ref} testID="test-button">
        Ref Button
      </Button>
    );

    expect(ref.current).toBeTruthy();
  });

  it('should handle different variant and size combinations', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
    const sizes = ['sm', 'default', 'lg', 'icon'] as const;
    
    variants.forEach(variant => {
      sizes.forEach(size => {
        const { getByTestId } = render(
          <Button testID={`button-${variant}-${size}`} variant={variant} size={size}>
            {`${variant} ${size}`}
          </Button>
        );
        
        expect(getByTestId(`button-${variant}-${size}`)).toBeTruthy();
      });
    });
  });

  it('should handle edge case with empty children', () => {
    const { getByTestId } = render(
      <Button testID="test-button"></Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should handle null children', () => {
    const { getByTestId } = render(
      <Button testID="test-button">{null}</Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('should handle undefined children', () => {
    const { getByTestId } = render(
      <Button testID="test-button">{undefined}</Button>
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });
});