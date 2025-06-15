import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '../../../components/ui/Input';

// Mock Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Medium: 'medium',
  },
}));

describe('Input Component', () => {
  it('should render basic input correctly', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input).toBeTruthy();
  });

  it('should handle text input changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        onChangeText={onChangeText}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    fireEvent.changeText(input, 'Hello World');
    
    expect(onChangeText).toHaveBeenCalledWith('Hello World');
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        style={customStyle}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.style).toEqual(expect.arrayContaining([
      expect.objectContaining(customStyle)
    ]));
  });

  it('should handle secure text entry', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        secureTextEntry={true}
        placeholder="Enter password"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should be editable by default', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.editable).toBe(true);
  });

  it('should handle disabled state', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        editable={false}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.editable).toBe(false);
  });

  it('should handle multiline input', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        multiline={true}
        numberOfLines={4}
        placeholder="Enter multiple lines"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(4);
  });

  it('should handle keyboard type', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        keyboardType="email-address"
        placeholder="Enter email"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should handle return key type', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        returnKeyType="done"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.returnKeyType).toBe('done');
  });

  it('should handle onSubmitEditing callback', () => {
    const onSubmitEditing = jest.fn();
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        onSubmitEditing={onSubmitEditing}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    fireEvent(input, 'submitEditing');
    
    expect(onSubmitEditing).toHaveBeenCalled();
  });

  it('should handle onFocus callback', () => {
    const onFocus = jest.fn();
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        onFocus={onFocus}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    fireEvent(input, 'focus');
    
    expect(onFocus).toHaveBeenCalled();
  });

  it('should handle onBlur callback', () => {
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        onBlur={onBlur}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    fireEvent(input, 'blur');
    
    expect(onBlur).toHaveBeenCalled();
  });

  it('should handle maxLength', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        maxLength={10}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.maxLength).toBe(10);
  });

  it('should handle value prop', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        value="Initial value"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.value).toBe('Initial value');
  });

  it('should handle autoCapitalize', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        autoCapitalize="words"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.autoCapitalize).toBe('words');
  });

  it('should handle autoCorrect', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        autoCorrect={false}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.autoCorrect).toBe(false);
  });

  it('should handle autoComplete', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        autoComplete="email"
        placeholder="Enter email"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.autoComplete).toBe('email');
  });

  it('should handle placeholder text color', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        placeholderTextColor="#999999"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.placeholderTextColor).toBe('#999999');
  });

  it('should handle selection color', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        selectionColor="#007AFF"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.selectionColor).toBe('#007AFF');
  });

  it('should handle default value', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        defaultValue="Default text"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.defaultValue).toBe('Default text');
  });

  it('should handle clear button mode on iOS', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        clearButtonMode="while-editing"
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.clearButtonMode).toBe('while-editing');
  });

  it('should handle text content type', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        textContentType="emailAddress"
        placeholder="Enter email"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.textContentType).toBe('emailAddress');
  });

  it('should handle onEndEditing callback', () => {
    const onEndEditing = jest.fn();
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        onEndEditing={onEndEditing}
        placeholder="Enter text"
      />
    );

    const input = getByTestId('test-input');
    fireEvent(input, 'endEditing', { nativeEvent: { text: 'Hello' } });
    
    expect(onEndEditing).toHaveBeenCalled();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<any>();
    
    render(
      <Input 
        ref={ref}
        testID="test-input"
        placeholder="Enter text"
      />
    );

    expect(ref.current).toBeTruthy();
  });

  it('should handle controlled component pattern', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      
      return (
        <Input 
          testID="controlled-input"
          value={value}
          onChangeText={setValue}
          placeholder="Controlled input"
        />
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const input = getByTestId('controlled-input');
    
    fireEvent.changeText(input, 'New value');
    expect(input.props.value).toBe('New value');
  });

  it('should handle uncontrolled component pattern', () => {
    const onChangeText = jest.fn();
    
    const { getByTestId } = render(
      <Input 
        testID="uncontrolled-input"
        defaultValue="Initial"
        onChangeText={onChangeText}
        placeholder="Uncontrolled input"
      />
    );

    const input = getByTestId('uncontrolled-input');
    fireEvent.changeText(input, 'Changed');
    
    expect(onChangeText).toHaveBeenCalledWith('Changed');
  });

  it('should handle empty placeholder', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        placeholder=""
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.placeholder).toBe('');
  });

  it('should handle numeric keyboard type', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        keyboardType="numeric"
        placeholder="Enter number"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('should handle phone-pad keyboard type', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        keyboardType="phone-pad"
        placeholder="Enter phone"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  it('should handle url keyboard type', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        keyboardType="url"
        placeholder="Enter URL"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.keyboardType).toBe('url');
  });

  it('should handle various return key types', () => {
    const returnKeyTypes = ['done', 'go', 'next', 'search', 'send'] as const;
    
    returnKeyTypes.forEach((returnKeyType) => {
      const { getByTestId } = render(
        <Input 
          testID={`test-input-${returnKeyType}`}
          returnKeyType={returnKeyType}
          placeholder="Enter text"
        />
      );

      const input = getByTestId(`test-input-${returnKeyType}`);
      expect(input.props.returnKeyType).toBe(returnKeyType);
    });
  });

  it('should handle text alignment', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        textAlign="center"
        placeholder="Centered text"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.textAlign).toBe('center');
  });

  it('should handle spellCheck prop', () => {
    const { getByTestId } = render(
      <Input 
        testID="test-input"
        spellCheck={false}
        placeholder="No spell check"
      />
    );

    const input = getByTestId('test-input');
    expect(input.props.spellCheck).toBe(false);
  });
});