import type { User } from '../types/domain';
import { apiRequest, isApiEnabled, mockRequest, setAccessToken } from './api';

type AuthResponse = { user: User; accessToken: string };

function mapUser(u: AuthResponse['user']): User {
  return {
    ...u,
    role: u.role ?? 'customer',
    addresses: u.addresses ?? [],
    loyaltyPoints: u.loyaltyPoints ?? 0,
    tier: u.tier ?? 'Rose',
  };
}

export const authService = {
  signIn: async (email: string, password: string): Promise<User> => {
    if (!isApiEnabled()) {
      return mockRequest({
        id: 'usr_demo',
        name: email.split('@')[0],
        email,
        loyaltyPoints: 1240,
        tier: 'Gold',
        addresses: [],
      });
    }
    const res = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(res.accessToken);
    return mapUser(res.user);
  },

  signUp: async (name: string, email: string, password: string): Promise<User> => {
    if (!isApiEnabled()) {
      return mockRequest({
        id: 'usr_demo',
        name,
        email,
        loyaltyPoints: 250,
        tier: 'Rose',
        addresses: [],
      });
    }
    const res = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setAccessToken(res.accessToken);
    return mapUser(res.user);
  },

  signOut: async () => {
    if (isApiEnabled()) {
      await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    }
    setAccessToken(null);
  },

  getMe: async (): Promise<User | null> => {
    if (!isApiEnabled()) return null;
    try {
      const res = await apiRequest<{ user: User }>('/auth/me');
      return mapUser(res.user);
    } catch {
      setAccessToken(null);
      return null;
    }
  },

  requestPasswordReset: async (email: string) => {
    if (!isApiEnabled()) return mockRequest({ accepted: true });
    return apiRequest<{ accepted: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email: string, code: string, password: string) => {
    if (!isApiEnabled()) return mockRequest({ success: true });
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    });
  },

  verifyOtp: async (email: string, code: string) => {
    if (!isApiEnabled()) return mockRequest({ verified: code.length === 6 });
    return apiRequest<{ verified: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code, purpose: 'verify_email' }),
    });
  },

  signInWithGoogle: async () => mockRequest({ provider: 'google', demo: true }),
};
