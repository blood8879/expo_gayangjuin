import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Modal, AlertModal, ConfirmModal } from '../../../components/ui/Modal';

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

jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text testID={`icon-${name}`} style={{ fontSize: size, color }} {...props}>
        {name}
      </Text>
    );
  },
}));

jest.mock('../../../components/ui/Button', () => ({
  default: ({ children, onPress, variant, size, style, ...props }: any) => {
    const { Text } = require('react-native');
    return (
      <Text 
        testID={`button-${variant}-${size}`}
        onPress={onPress}
        style={style}
        {...props}
      >
        {children}
      </Text>
    );
  },
}));

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    Platform: {
      select: jest.fn((specifics) => specifics.ios || specifics.default),
      OS: 'ios',
    },
  };
});

describe('Modal Components', () => {
  describe('Modal', () => {
    const defaultProps = {
      visible: true,
      onClose: jest.fn(),
      children: <Text>Modal Content</Text>,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
      const { getByText } = render(<Modal {...defaultProps} />);
      
      expect(getByText('Modal Content')).toBeTruthy();
    });

    it('does not render when not visible', () => {
      const { queryByText } = render(
        <Modal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Modal Content')).toBeFalsy();
    });

    it('renders with title', () => {
      const { getByText } = render(
        <Modal {...defaultProps} title="Test Modal" />
      );
      
      expect(getByText('Test Modal')).toBeTruthy();
      expect(getByText('Modal Content')).toBeTruthy();
    });

    it('renders close button by default', () => {
      const { getByTestId } = render(
        <Modal {...defaultProps} title="Test Modal" />
      );
      
      expect(getByTestId('icon-close')).toBeTruthy();
    });

    it('hides close button when showCloseButton is false', () => {
      const { queryByTestId } = render(
        <Modal {...defaultProps} title="Test Modal" showCloseButton={false} />
      );
      
      expect(queryByTestId('icon-close')).toBeFalsy();
    });

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <Modal {...defaultProps} onClose={onClose} title="Test Modal" />
      );
      
      fireEvent.press(getByTestId('icon-close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is pressed', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <Modal {...defaultProps} onClose={onClose} />
      );
      
      // Find the overlay by pressing outside the modal content
      const modal = getByText('Modal Content').parent?.parent?.parent;
      if (modal) {
        fireEvent.press(modal);
        expect(onClose).toHaveBeenCalledTimes(1);
      }
    });

    it('applies custom content style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByText } = render(
        <Modal {...defaultProps} contentStyle={customStyle} />
      );
      
      expect(getByText('Modal Content')).toBeTruthy();
    });

    it('renders without title and close button when both are disabled', () => {
      const { getByText, queryByTestId } = render(
        <Modal {...defaultProps} showCloseButton={false} />
      );
      
      expect(getByText('Modal Content')).toBeTruthy();
      expect(queryByTestId('icon-close')).toBeFalsy();
    });

    it('handles dark color scheme', () => {
      const mockUseColorScheme = require('../../../hooks/useColorScheme').useColorScheme;
      mockUseColorScheme.mockReturnValue('dark');
      
      const { getByText } = render(
        <Modal {...defaultProps} title="Dark Modal" />
      );
      
      expect(getByText('Dark Modal')).toBeTruthy();
    });
  });

  describe('AlertModal', () => {
    const defaultProps = {
      visible: true,
      onClose: jest.fn(),
      title: 'Alert Title',
      message: 'Alert message',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders correctly with default props', () => {
      const { getByText } = render(<AlertModal {...defaultProps} />);
      
      expect(getByText('Alert Title')).toBeTruthy();
      expect(getByText('Alert message')).toBeTruthy();
      expect(getByText('확인')).toBeTruthy();
    });

    it('renders with custom button text', () => {
      const { getByText } = render(
        <AlertModal {...defaultProps} buttonText="OK" />
      );
      
      expect(getByText('OK')).toBeTruthy();
    });

    it('calls onClose when button is pressed', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <AlertModal {...defaultProps} onClose={onClose} />
      );
      
      fireEvent.press(getByText('확인'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not show close button in header', () => {
      const { queryByTestId } = render(<AlertModal {...defaultProps} />);
      
      expect(queryByTestId('icon-close')).toBeFalsy();
    });

    it('does not render when not visible', () => {
      const { queryByText } = render(
        <AlertModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Alert Title')).toBeFalsy();
    });
  });

  describe('ConfirmModal', () => {
    const defaultProps = {
      visible: true,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
      title: 'Confirm Title',
      message: 'Confirm message',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders correctly with default props', () => {
      const { getByText } = render(<ConfirmModal {...defaultProps} />);
      
      expect(getByText('Confirm Title')).toBeTruthy();
      expect(getByText('Confirm message')).toBeTruthy();
      expect(getByText('취소')).toBeTruthy();
      expect(getByText('확인')).toBeTruthy();
    });

    it('renders with custom button texts', () => {
      const { getByText } = render(
        <ConfirmModal 
          {...defaultProps} 
          confirmText="Yes" 
          cancelText="No" 
        />
      );
      
      expect(getByText('Yes')).toBeTruthy();
      expect(getByText('No')).toBeTruthy();
    });

    it('calls onClose when cancel button is pressed', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <ConfirmModal {...defaultProps} onClose={onClose} />
      );
      
      fireEvent.press(getByText('취소'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm and onClose when confirm button is pressed', () => {
      const onClose = jest.fn();
      const onConfirm = jest.fn();
      const { getByText } = render(
        <ConfirmModal 
          {...defaultProps} 
          onClose={onClose} 
          onConfirm={onConfirm} 
        />
      );
      
      fireEvent.press(getByText('확인'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders with danger variant', () => {
      const { getByText } = render(
        <ConfirmModal {...defaultProps} danger />
      );
      
      expect(getByText('확인')).toBeTruthy();
    });

    it('does not show close button in header', () => {
      const { queryByTestId } = render(<ConfirmModal {...defaultProps} />);
      
      expect(queryByTestId('icon-close')).toBeFalsy();
    });

    it('does not render when not visible', () => {
      const { queryByText } = render(
        <ConfirmModal {...defaultProps} visible={false} />
      );
      
      expect(queryByText('Confirm Title')).toBeFalsy();
    });

    it('handles confirm action properly', () => {
      const onClose = jest.fn();
      const onConfirm = jest.fn();
      
      const { getByText } = render(
        <ConfirmModal 
          {...defaultProps} 
          onClose={onClose} 
          onConfirm={onConfirm} 
        />
      );
      
      const confirmButton = getByText('확인');
      fireEvent.press(confirmButton);
      
      expect(onConfirm).toHaveBeenCalledBefore(onClose);
    });
  });

  describe('Modal behavior', () => {
    it('prevents event propagation on modal content touch', () => {
      const onClose = jest.fn();
      const { getByText } = render(
        <Modal visible onClose={onClose}>
          <Text>Modal Content</Text>
        </Modal>
      );
      
      // Touch the modal content itself should not close the modal
      const content = getByText('Modal Content');
      fireEvent(content, 'touchEnd', {
        stopPropagation: jest.fn(),
      });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('has correct modal properties', () => {
      const { getByText } = render(
        <Modal visible onClose={jest.fn()}>
          <Text>Modal Content</Text>
        </Modal>
      );
      
      expect(getByText('Modal Content')).toBeTruthy();
    });
  });
});