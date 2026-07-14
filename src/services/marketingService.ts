import { mockRequest } from './api';

export const marketingService = {
  subscribe: async (email: string) =>
  mockRequest({ subscribed: Boolean(email.includes('@')) }),
  createContactTicket: async (_input: {
    name: string;
    email: string;
    message: string;
  }) => mockRequest({ ticketId: `HT-${Date.now().toString().slice(-6)}` })
};
// TODO: Connect newsletter, contact center, reviews and marketing automation endpoints.