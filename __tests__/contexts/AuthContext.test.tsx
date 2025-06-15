import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Mock Supabase auth
const mockAuth = {
  signInWithIdToken: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  onAuthStateChange: jest.fn(() => ({
    data: { subscription: { unsubscribe: jest.fn() } }
  })),
};

const mockSupabase = {
  auth: mockAuth,
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, signInWithGoogle, signInWithKakao, signOut, loading } = useAuth();
  
  return (
    <>
      <Text testID="user-status">{user ? 'authenticated' : 'not-authenticated'}</Text>
      <Text testID="loading-status">{loading ? 'loading' : 'not-loading'}</Text>
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default values when not authenticated', () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('user-status')).toHaveTextContent('not-authenticated');
  });

  it('should handle authentication state changes', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' },
    };

    mockAuth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    let authStateCallback: ((event: string, session: any) => void) | null = null;
    mockAuth.onAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate auth state change
    await act(async () => {
      if (authStateCallback) {
        authStateCallback('SIGNED_IN', { user: mockUser });
      }
    });

    await waitFor(() => {
      expect(getByTestId('user-status')).toHaveTextContent('authenticated');
    });
  });

  it('should handle sign out', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    };

    // Mock initial authenticated state
    mockAuth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    let authStateCallback: ((event: string, session: any) => void) | null = null;
    mockAuth.onAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    mockAuth.signOut.mockResolvedValue({ error: null });

    const TestComponentWithSignOut = () => {
      const { user, signOut } = useAuth();
      
      React.useEffect(() => {
        if (user) {
          signOut();
        }
      }, [user, signOut]);
      
      return <Text testID="user-status">{user ? 'authenticated' : 'not-authenticated'}</Text>;
    };

    render(
      <AuthProvider>
        <TestComponentWithSignOut />
      </AuthProvider>
    );

    // Simulate initial sign in
    await act(async () => {
      if (authStateCallback) {
        authStateCallback('SIGNED_IN', { user: mockUser });
      }
    });

    // Simulate sign out
    await act(async () => {
      if (authStateCallback) {
        authStateCallback('SIGNED_OUT', null);
      }
    });

    expect(mockAuth.signOut).toHaveBeenCalled();
  });

  it('should handle Google Sign-In', async () => {
    const mockGoogleSignIn = jest.fn().mockResolvedValue({
      idToken: 'mock-google-token',
    });

    jest.doMock('@react-native-google-signin/google-signin', () => ({
      GoogleSignin: {
        signIn: mockGoogleSignIn,
      },
    }));

    mockAuth.signInWithIdToken.mockResolvedValue({
      data: { user: { id: 'google-user' } },
      error: null,
    });

    const TestComponentWithGoogleSignIn = () => {
      const { signInWithGoogle } = useAuth();
      
      React.useEffect(() => {
        signInWithGoogle();
      }, [signInWithGoogle]);
      
      return <Text testID="test">test</Text>;
    };

    render(
      <AuthProvider>
        <TestComponentWithGoogleSignIn />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockAuth.signInWithIdToken).toHaveBeenCalledWith({
        provider: 'google',
        token: 'mock-google-token',
      });
    });
  });

  it('should handle Kakao Sign-In', async () => {
    const mockKakaoLogin = jest.fn().mockResolvedValue({
      accessToken: 'mock-kakao-token',
    });

    jest.doMock('@react-native-kakao/user', () => ({
      login: mockKakaoLogin,
    }));

    mockAuth.signInWithIdToken.mockResolvedValue({
      data: { user: { id: 'kakao-user' } },
      error: null,
    });

    const TestComponentWithKakaoSignIn = () => {
      const { signInWithKakao } = useAuth();
      
      React.useEffect(() => {
        signInWithKakao();
      }, [signInWithKakao]);
      
      return <Text testID="test">test</Text>;
    };

    render(
      <AuthProvider>
        <TestComponentWithKakaoSignIn />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockAuth.signInWithIdToken).toHaveBeenCalledWith({
        provider: 'kakao',
        token: 'mock-kakao-token',
      });
    });
  });

  it('should handle loading state', async () => {
    mockAuth.getSession.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: { session: null }, error: null }), 100))
    );

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially should be loading
    expect(getByTestId('loading-status')).toHaveTextContent('loading');

    // After session check completes
    await waitFor(() => {
      expect(getByTestId('loading-status')).toHaveTextContent('not-loading');
    });
  });

  it('should handle session errors', async () => {
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Session error'),
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('user-status')).toHaveTextContent('not-authenticated');
      expect(getByTestId('loading-status')).toHaveTextContent('not-loading');
    });
  });

  it('should handle sign in errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockAuth.signInWithIdToken.mockResolvedValue({
      data: { user: null },
      error: new Error('Sign in failed'),
    });

    const TestComponentWithError = () => {
      const { signInWithGoogle } = useAuth();
      
      React.useEffect(() => {
        signInWithGoogle();
      }, [signInWithGoogle]);
      
      return <Text testID="test">test</Text>;
    };

    render(
      <AuthProvider>
        <TestComponentWithError />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Google sign in error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should handle sign out errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockAuth.signOut.mockResolvedValue({
      error: new Error('Sign out failed'),
    });

    const TestComponentWithSignOutError = () => {
      const { signOut } = useAuth();
      
      React.useEffect(() => {
        signOut();
      }, [signOut]);
      
      return <Text testID="test">test</Text>;
    };

    render(
      <AuthProvider>
        <TestComponentWithSignOutError />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign out error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should clean up subscription on unmount', () => {
    const mockUnsubscribe = jest.fn();
    mockAuth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } }
    });

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});