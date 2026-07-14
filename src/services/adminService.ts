import { mockRequest } from './api';
import { adminAnalytics } from '../lib/mockData';

export const adminService = {
  analytics: async () => mockRequest(adminAnalytics),
  exportCsv: async (scope: string) =>
  mockRequest(`report,${scope}\nstatus,generated locally\n`)
};
// TODO: Connect admin RBAC, analytics, inventory, content, review moderation and export endpoints.