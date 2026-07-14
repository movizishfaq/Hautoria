import { appConfig } from '../lib/config';

export async function mockRequest<T>(payload: T, delay = 380): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return payload;
}

export const apiConfig = { baseUrl: appConfig.apiBaseUrl };
// TODO: Replace mockRequest in service adapters with authenticated fetch calls to VITE_API_BASE_URL.