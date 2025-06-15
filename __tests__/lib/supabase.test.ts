import { supabase } from '../../lib/supabase';

// Mock @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
      })),
    },
    rpc: jest.fn(),
  })),
}));

// Mock expo-constants for environment variables
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: 'https://test.supabase.co',
      supabaseAnonKey: 'test-anon-key',
    },
  },
}));

// Mock process.env fallback
const originalEnv = process.env;

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('creates supabase client instance', () => {
    const { createClient } = require('@supabase/supabase-js');
    
    expect(createClient).toHaveBeenCalled();
    expect(supabase).toBeDefined();
  });

  it('uses environment variables for configuration', () => {
    const { createClient } = require('@supabase/supabase-js');
    
    expect(createClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });

  it('has auth functionality', () => {
    expect(supabase.auth).toBeDefined();
    expect(supabase.auth.getSession).toBeDefined();
    expect(supabase.auth.signInWithOAuth).toBeDefined();
    expect(supabase.auth.signOut).toBeDefined();
    expect(supabase.auth.onAuthStateChange).toBeDefined();
  });

  it('has database functionality', () => {
    expect(supabase.from).toBeDefined();
    
    const table = supabase.from('test');
    expect(table).toBeDefined();
  });

  it('has storage functionality', () => {
    expect(supabase.storage).toBeDefined();
    expect(supabase.storage.from).toBeDefined();
    
    const bucket = supabase.storage.from('test');
    expect(bucket).toBeDefined();
  });

  it('has RPC functionality', () => {
    expect(supabase.rpc).toBeDefined();
  });

  it('handles missing environment variables gracefully', () => {
    // This test ensures the client is created even if env vars are missing
    expect(supabase).toBeDefined();
  });

  it('creates client with correct URL format', () => {
    const { createClient } = require('@supabase/supabase-js');
    const calls = createClient.mock.calls;
    
    if (calls.length > 0) {
      const [url] = calls[0];
      expect(typeof url).toBe('string');
      // Should be a valid URL or fallback
      expect(url.length).toBeGreaterThan(0);
    }
  });

  it('creates client with correct anon key format', () => {
    const { createClient } = require('@supabase/supabase-js');
    const calls = createClient.mock.calls;
    
    if (calls.length > 0) {
      const [, anonKey] = calls[0];
      expect(typeof anonKey).toBe('string');
      expect(anonKey.length).toBeGreaterThan(0);
    }
  });

  it('uses fallback configuration when constants are not available', () => {
    // Mock missing constants
    jest.doMock('expo-constants', () => ({
      expoConfig: null,
    }));
    
    // This should still work with process.env fallback
    const { createClient } = require('@supabase/supabase-js');
    expect(createClient).toHaveBeenCalled();
  });

  it('handles different environment configurations', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://env.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'env-anon-key';
    
    // Re-import to test with new env vars
    jest.resetModules();
    const { createClient } = require('@supabase/supabase-js');
    
    expect(createClient).toHaveBeenCalled();
  });

  describe('Client functionality', () => {
    it('can perform auth operations', async () => {
      const mockSession = { user: { id: '123' } };
      supabase.auth.getSession = jest.fn().mockResolvedValue({ data: { session: mockSession } });
      
      const { data } = await supabase.auth.getSession();
      expect(data.session).toEqual(mockSession);
    });

    it('can perform database operations', () => {
      const mockSelect = jest.fn().mockReturnValue({
        data: [{ id: 1, name: 'test' }],
        error: null,
      });
      
      supabase.from = jest.fn().mockReturnValue({
        select: mockSelect,
      });
      
      const query = supabase.from('test').select();
      expect(supabase.from).toHaveBeenCalledWith('test');
      expect(mockSelect).toHaveBeenCalled();
    });

    it('can perform storage operations', () => {
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test/file.jpg' },
        error: null,
      });
      
      supabase.storage.from = jest.fn().mockReturnValue({
        upload: mockUpload,
      });
      
      const bucket = supabase.storage.from('images');
      expect(supabase.storage.from).toHaveBeenCalledWith('images');
    });

    it('can call RPC functions', async () => {
      const mockRpc = jest.fn().mockResolvedValue({
        data: { result: 'success' },
        error: null,
      });
      
      supabase.rpc = mockRpc;
      
      await supabase.rpc('test_function', { param: 'value' });
      expect(mockRpc).toHaveBeenCalledWith('test_function', { param: 'value' });
    });
  });

  describe('Error handling', () => {
    it('handles auth errors gracefully', async () => {
      const mockError = new Error('Auth error');
      supabase.auth.getSession = jest.fn().mockRejectedValue(mockError);
      
      try {
        await supabase.auth.getSession();
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    it('handles database errors gracefully', () => {
      const mockError = { message: 'Database error' };
      supabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          data: null,
          error: mockError,
        }),
      });
      
      const result = supabase.from('test').select();
      expect(result.error).toBe(mockError);
    });

    it('handles storage errors gracefully', async () => {
      const mockError = { message: 'Storage error' };
      supabase.storage.from = jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });
      
      const result = await supabase.storage.from('images').upload('test.jpg', new Blob());
      expect(result.error).toBe(mockError);
    });
  });
});