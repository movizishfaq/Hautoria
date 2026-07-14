import { appConfig } from '../lib/config';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const TOKEN_KEY = 'hautoria_access_token';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const apiConfig = { baseUrl: appConfig.apiBaseUrl };

export function isApiEnabled() {
  return Boolean(apiConfig.baseUrl?.trim());
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = apiConfig.baseUrl.replace(/\/$/, '');
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? 'Request failed', data.details);
  }
  return data as T;
}

export async function mockRequest<T>(payload: T, delay = 380): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return payload;
}
