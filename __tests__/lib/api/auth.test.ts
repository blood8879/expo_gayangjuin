import {
  signOut,
  getCurrentSession,
  getCurrentUser
} from '../../../lib/api/auth';
import { supabase } from '../../../lib/supabase';

// Mock supabase
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

describe('Auth API Functions', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      await expect(signOut()).resolves.not.toThrow();
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it('should throw error when sign out fails', async () => {
      const mockError = new Error('Sign out failed');
      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError,
      });

      await expect(signOut()).rejects.toThrow(mockError);
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1);
    });

    it('should handle null error gracefully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      await expect(signOut()).resolves.not.toThrow();
    });

    it('should handle undefined error gracefully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: undefined,
      } as any);

      await expect(signOut()).resolves.not.toThrow();
    });
  });

  describe('getCurrentSession', () => {
    it('should get current session successfully', async () => {
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'user123',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          user_metadata: {},
          app_metadata: {},
        },
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await getCurrentSession();
      expect(result).toEqual(mockSession);
      expect(mockSupabase.auth.getSession).toHaveBeenCalledTimes(1);
    });

    it('should return null when no session exists', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await getCurrentSession();
      expect(result).toBeNull();
      expect(mockSupabase.auth.getSession).toHaveBeenCalledTimes(1);
    });

    it('should throw error when get session fails', async () => {
      const mockError = new Error('Session fetch failed');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      await expect(getCurrentSession()).rejects.toThrow(mockError);
      expect(mockSupabase.auth.getSession).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed session data', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: {} as any },
        error: null,
      });

      const result = await getCurrentSession();
      expect(result).toEqual({});
    });

    it('should handle undefined session data', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: undefined as any },
        error: null,
      });

      const result = await getCurrentSession();
      expect(result).toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        aud: 'authenticated',
        role: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'http://example.com/avatar.jpg',
        },
        app_metadata: {
          provider: 'google',
          providers: ['google'],
        },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await getCurrentUser();
      expect(result).toEqual(mockUser);
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
    });

    it('should return null when no user exists', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await getCurrentUser();
      expect(result).toBeNull();
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
    });

    it('should throw error when get user fails', async () => {
      const mockError = new Error('User fetch failed');
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      });

      await expect(getCurrentUser()).rejects.toThrow(mockError);
      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
    });

    it('should handle malformed user data', async () => {
      const partialUser = {
        id: 'user123',
        // Missing required fields
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: partialUser as any },
        error: null,
      });

      const result = await getCurrentUser();
      expect(result).toEqual(partialUser);
    });

    it('should handle undefined user data', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: undefined as any },
        error: null,
      });

      const result = await getCurrentUser();
      expect(result).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network request failed');
      mockSupabase.auth.getUser.mockRejectedValue(networkError);

      await expect(getCurrentUser()).rejects.toThrow(networkError);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockSupabase.auth.getUser.mockRejectedValue(timeoutError);

      await expect(getCurrentUser()).rejects.toThrow(timeoutError);
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle auth service unavailable', async () => {
      const serviceError = new Error('Service temporarily unavailable');
      mockSupabase.auth.getSession.mockRejectedValue(serviceError);

      await expect(getCurrentSession()).rejects.toThrow(serviceError);
    });

    it('should handle invalid credentials', async () => {
      const credentialsError = new Error('Invalid credentials');
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: credentialsError,
      });

      await expect(getCurrentUser()).rejects.toThrow(credentialsError);
    });

    it('should handle expired tokens', async () => {
      const expiredTokenError = new Error('Token expired');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: expiredTokenError,
      });

      await expect(getCurrentSession()).rejects.toThrow(expiredTokenError);
    });

    it('should handle malformed error responses', async () => {
      const malformedError = { message: 'Malformed error', code: 'UNKNOWN' };
      mockSupabase.auth.signOut.mockResolvedValue({
        error: malformedError as any,
      });

      await expect(signOut()).rejects.toEqual(malformedError);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent sign out requests', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      const promises = Array(5).fill(null).map(() => signOut());
      await expect(Promise.all(promises)).resolves.not.toThrow();
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(5);
    });

    it('should handle multiple concurrent session requests', async () => {
      const mockSession = {
        access_token: 'mock-token',
        user: { id: 'user123' },
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const promises = Array(3).fill(null).map(() => getCurrentSession());
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      results.forEach(result => expect(result).toEqual(mockSession));
      expect(mockSupabase.auth.getSession).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success and failure requests', async () => {
      let callCount = 0;
      mockSupabase.auth.getUser.mockImplementation(() => {
        callCount++;
        if (callCount % 2 === 0) {
          return Promise.resolve({
            data: { user: null },
            error: new Error('Even request failed'),
          });
        } else {
          return Promise.resolve({
            data: { user: { id: 'user123' } },
            error: null,
          });
        }
      });

      const promises = Array(4).fill(null).map(() => getCurrentUser().catch(e => e));
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(4);
      expect(results[0]).toEqual({ id: 'user123' }); // Success
      expect(results[1]).toBeInstanceOf(Error); // Failure
      expect(results[2]).toEqual({ id: 'user123' }); // Success
      expect(results[3]).toBeInstanceOf(Error); // Failure
    });
  });
});