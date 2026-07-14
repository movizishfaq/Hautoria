import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const transporter =
  env.smtp.host && env.smtp.user
    ? nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465,
        auth: { user: env.smtp.user, pass: env.smtp.pass },
      })
    : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!transporter) {
    logger.info(`[EMAIL DEV] To: ${to} | ${subject}`);
    return { queued: true, dev: true };
  }
  await transporter.sendMail({ from: env.smtp.from, to, subject, html });
  return { sent: true };
}

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: `Welcome to ${env.storeName}`,
    html: `<p>Hi ${name},</p><p>Welcome to ${env.storeName} — ${env.storeTagline}</p>`,
  }),
  orderConfirmation: (name: string, orderNumber: string, total: number) => ({
    subject: `Order ${orderNumber} confirmed`,
    html: `<p>Hi ${name},</p><p>Your order <strong>${orderNumber}</strong> is confirmed. Total: Rs. ${total.toLocaleString()}</p>`,
  }),
  shipping: (name: string, orderNumber: string, tracking: string) => ({
    subject: `Order ${orderNumber} shipped`,
    html: `<p>Hi ${name},</p><p>Your order has shipped. Tracking: <strong>${tracking}</strong></p>`,
  }),
  resetPassword: (code: string) => ({
    subject: 'Reset your password',
    html: `<p>Your Hautoria password reset code is: <strong>${code}</strong></p><p>Expires in 15 minutes.</p>`,
  }),
};
