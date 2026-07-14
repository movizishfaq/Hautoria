import type { User } from '../types/domain';
import { mockRequest } from './api';

export const authService = {
  signIn: async (email: string, _password: string): Promise<User> =>
  mockRequest({
    id: 'usr_demo',
    name: email.split('@')[0].replace(/(^|\.)\w/g, (v) => v.toUpperCase()),
    email,
    loyaltyPoints: 1240,
    tier: 'Gold',
    addresses: []
  }),
  signUp: async (
  name: string,
  email: string,
  _password: string)
  : Promise<User> =>
  mockRequest({
    id: 'usr_demo',
    name,
    email,
    loyaltyPoints: 250,
    tier: 'Rose',
    addresses: []
  }),
  requestPasswordReset: async (_email: string) =>
  mockRequest({ accepted: true }),
  verifyOtp: async (_email: string, code: string) =>
  mockRequest({ verified: code.length === 6 }),
  signInWithGoogle: async () => mockRequest({ provider: 'google', demo: true })
};
// TODO: Connect email/password, OTP, reset and OAuth endpoints. Google is intentionally visual mock-only.