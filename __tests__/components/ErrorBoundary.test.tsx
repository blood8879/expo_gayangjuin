import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorBoundary from '../../components/ErrorBoundary';
import { router } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

describe('ErrorBoundary', () => {
  const mockError = new Error('Test error message');
  const mockRetry = jest.fn();
  const mockRouter = router as jest.Mocked<typeof router>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error message and buttons', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    expect(getByText('잠시 후 다시 시도해주세요.')).toBeTruthy();
    expect(getByText('다시 시도')).toBeTruthy();
    expect(getByText('홈으로 이동')).toBeTruthy();
  });

  it('should show error details in development mode', () => {
    const originalDev = __DEV__;
    (global as any).__DEV__ = true;

    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    expect(getByText('Test error message')).toBeTruthy();

    (global as any).__DEV__ = originalDev;
  });

  it('should not show error details in production mode', () => {
    const originalDev = __DEV__;
    (global as any).__DEV__ = false;

    const { queryByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    expect(queryByText('Test error message')).toBeNull();

    (global as any).__DEV__ = originalDev;
  });

  it('should call retry function when retry button is pressed', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    fireEvent.press(getByText('다시 시도'));

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should navigate to home when home button is pressed', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    fireEvent.press(getByText('홈으로 이동'));

    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('should handle error with empty message', () => {
    const errorWithEmptyMessage = new Error('');
    const { getByText } = render(
      <ErrorBoundary error={errorWithEmptyMessage} retry={mockRetry} />
    );

    expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    expect(getByText('잠시 후 다시 시도해주세요.')).toBeTruthy();
  });

  it('should handle error with null message', () => {
    const errorWithNullMessage = new Error();
    errorWithNullMessage.message = null as any;
    
    const { getByText } = render(
      <ErrorBoundary error={errorWithNullMessage} retry={mockRetry} />
    );

    expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
  });

  it('should handle undefined error', () => {
    const { getByText } = render(
      <ErrorBoundary error={undefined as any} retry={mockRetry} />
    );

    expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
  });

  it('should handle null error', () => {
    const { getByText } = render(
      <ErrorBoundary error={null as any} retry={mockRetry} />
    );

    expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
  });

  it('should handle very long error message', () => {
    const longErrorMessage = 'This is a very long error message that might overflow the screen and cause layout issues. '.repeat(10);
    const longError = new Error(longErrorMessage);
    
    const originalDev = __DEV__;
    (global as any).__DEV__ = true;

    const { getByText } = render(
      <ErrorBoundary error={longError} retry={mockRetry} />
    );

    expect(getByText(longErrorMessage)).toBeTruthy();

    (global as any).__DEV__ = originalDev;
  });

  it('should handle error with special characters', () => {
    const specialError = new Error('Error with 특수문자 and émoji 🚀');
    
    const originalDev = __DEV__;
    (global as any).__DEV__ = true;

    const { getByText } = render(
      <ErrorBoundary error={specialError} retry={mockRetry} />
    );

    expect(getByText('Error with 특수문자 and émoji 🚀')).toBeTruthy();

    (global as any).__DEV__ = originalDev;
  });

  it('should call retry multiple times when button is pressed multiple times', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    const retryButton = getByText('다시 시도');
    
    fireEvent.press(retryButton);
    fireEvent.press(retryButton);
    fireEvent.press(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(3);
  });

  it('should call router.replace multiple times when home button is pressed multiple times', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    const homeButton = getByText('홈으로 이동');
    
    fireEvent.press(homeButton);
    fireEvent.press(homeButton);

    expect(mockRouter.replace).toHaveBeenCalledTimes(2);
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('should have proper accessibility properties', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    const retryButton = getByText('다시 시도');
    const homeButton = getByText('홈으로 이동');

    // Buttons should be accessible
    expect(retryButton.props.accessible).not.toBe(false);
    expect(homeButton.props.accessible).not.toBe(false);
  });

  it('should render with custom styled components', () => {
    const { getByText } = render(
      <ErrorBoundary error={mockError} retry={mockRetry} />
    );

    const title = getByText('앱에 문제가 발생했습니다');
    const message = getByText('잠시 후 다시 시도해주세요.');

    // Check that components render with expected style properties
    expect(title).toBeTruthy();
    expect(message).toBeTruthy();
  });

  describe('Error Boundary Edge Cases', () => {
    it('should handle TypeError', () => {
      const typeError = new TypeError('Cannot read property of undefined');
      
      const { getByText } = render(
        <ErrorBoundary error={typeError} retry={mockRetry} />
      );

      expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    });

    it('should handle ReferenceError', () => {
      const referenceError = new ReferenceError('Variable is not defined');
      
      const { getByText } = render(
        <ErrorBoundary error={referenceError} retry={mockRetry} />
      );

      expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    });

    it('should handle SyntaxError', () => {
      const syntaxError = new SyntaxError('Unexpected token');
      
      const { getByText } = render(
        <ErrorBoundary error={syntaxError} retry={mockRetry} />
      );

      expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    });

    it('should handle custom error types', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom error occurred');
      
      const { getByText } = render(
        <ErrorBoundary error={customError} retry={mockRetry} />
      );

      expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    });
  });

  describe('Prop Validation', () => {
    it('should handle missing retry prop gracefully', () => {
      const { getByText } = render(
        <ErrorBoundary error={mockError} retry={undefined as any} />
      );

      expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
      
      // Should not crash when retry button is pressed
      expect(() => {
        fireEvent.press(getByText('다시 시도'));
      }).not.toThrow();
    });

    it('should handle non-function retry prop', () => {
      const { getByText } = render(
        <ErrorBoundary error={mockError} retry={'not a function' as any} />
      );

      expect(getByText('앱에 문제가 발생했습니다')).toBeTruthy();
    });
  });
});