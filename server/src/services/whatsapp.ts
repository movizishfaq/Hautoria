import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import type { IOrder } from '../models/Order.js';

type WhatsAppProvider = 'meta' | 'callmebot' | 'webhook' | 'none';

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function resolveProvider(): WhatsAppProvider {
  const explicit = env.whatsapp.provider;

  if (explicit === 'meta' || (!explicit && env.whatsapp.phoneNumberId && env.whatsapp.token)) {
    if (env.whatsapp.phoneNumberId && env.whatsapp.token) return 'meta';
  }
  if (explicit === 'callmebot' || (!explicit && env.whatsapp.callmebotApiKey)) {
    if (env.whatsapp.callmebotApiKey) return 'callmebot';
  }
  if (explicit === 'webhook' || (!explicit && env.whatsapp.apiUrl && env.whatsapp.token)) {
    if (env.whatsapp.apiUrl && env.whatsapp.token) return 'webhook';
  }
  return 'none';
}

async function sendViaMeta(to: string, message: string) {
  const phoneId = env.whatsapp.phoneNumberId;
  const token = env.whatsapp.token;
  if (!phoneId || !token) throw new Error('Meta WhatsApp not configured');

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhone(to),
        type: 'text',
        text: { body: message },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta WhatsApp failed: ${err}`);
  }
  return { sent: true, provider: 'meta' };
}

async function sendViaCallMeBot(to: string, message: string) {
  const apiKey = env.whatsapp.callmebotApiKey;
  if (!apiKey) throw new Error('CallMeBot API key not configured');

  const url = new URL('https://api.callmebot.com/whatsapp.php');
  url.searchParams.set('phone', normalizePhone(to));
  url.searchParams.set('text', message);
  url.searchParams.set('apikey', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`CallMeBot failed: ${err}`);
  }
  return { sent: true, provider: 'callmebot' };
}

async function sendViaWebhook(to: string, message: string) {
  const apiUrl = env.whatsapp.apiUrl;
  const token = env.whatsapp.token;
  if (!apiUrl || !token) throw new Error('WhatsApp webhook not configured');

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to: normalizePhone(to), message }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp webhook failed: ${err}`);
  }
  return { sent: true, provider: 'webhook' };
}

export async function sendWhatsApp(phone: string, message: string) {
  const to = normalizePhone(phone);
  if (!to) return { sent: false, reason: 'invalid_phone' };

  const provider = resolveProvider();

  if (provider === 'none') {
    logger.info(`[WHATSAPP DEV] → ${to}\n${message}`);
    return { queued: true, dev: true };
  }

  try {
    if (provider === 'meta') return await sendViaMeta(to, message);
    if (provider === 'callmebot') return await sendViaCallMeBot(to, message);
    return await sendViaWebhook(to, message);
  } catch (error) {
    logger.error(`WhatsApp send failed (${provider}): ${error}`);
    return { sent: false, error: String(error) };
  }
}

export function orderWhatsAppMessage(input: {
  customerName: string;
  orderNumber: string;
  status: string;
  total: number;
  trackingNumber?: string;
}) {
  const trackUrl = input.trackingNumber
    ? `${env.clientUrl}/orders/${input.orderNumber}`
    : '';
  return `*${env.storeName}*\nHi ${input.customerName},\n\nOrder *${input.orderNumber}* — ${input.status}\nTotal: Rs. ${input.total.toLocaleString()}${
    input.trackingNumber ? `\nTrack: ${input.trackingNumber}` : ''
  }${trackUrl ? `\n${trackUrl}` : ''}\n\nSupport: ${env.whatsapp.support}`;
}

export function storeNewOrderMessage(order: IOrder, input: {
  customerName: string;
  email: string;
  phone?: string;
}) {
  const lines = order.items
    .map(
      (item) =>
        `• ${item.productName} (${item.variantName}) ×${item.quantity} — Rs. ${(item.unitPrice * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const address = order.shippingAddress;
  const addressLine = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postalCode,
  ]
    .filter(Boolean)
    .join(', ');

  const trackUrl = `${env.clientUrl}/orders/${order._id}`;

  return `🛍️ *NEW ORDER — ${env.storeName}*

*Order:* ${order.number}
*Status:* ${order.status}
*Payment:* ${order.paymentProvider}

*Customer:* ${input.customerName}
*Email:* ${input.email}
*Phone:* ${input.phone ?? '—'}

*Products:*
${lines}

*Subtotal:* Rs. ${order.subtotal.toLocaleString()}
*Shipping:* Rs. ${order.shipping.toLocaleString()}
*Tax:* Rs. ${order.tax.toLocaleString()}
*Discount:* Rs. ${order.discount.toLocaleString()}
*TOTAL:* Rs. ${order.total.toLocaleString()}

*Delivery:*
${addressLine || '—'}

*Tracking:* ${order.trackingNumber}
*Admin:* ${trackUrl}`;
}

export function storeOrderUpdateMessage(order: IOrder, status: string, note?: string) {
  return `📦 *ORDER UPDATE — ${env.storeName}*

*Order:* ${order.number}
*Status:* ${status}
${note ? `*Note:* ${note}\n` : ''}*Customer:* ${(order.shippingAddress?.firstName as string) ?? 'Customer'}
*Total:* Rs. ${order.total.toLocaleString()}
*Tracking:* ${order.trackingNumber}`;
}

export async function notifyStoreNewOrder(
  order: IOrder,
  input: { customerName: string; email: string; phone?: string }
) {
  const storeNumber = env.whatsapp.storeNumber;
  if (!storeNumber) {
    logger.warn('WHATSAPP_STORE_NUMBER not set — store order alert skipped');
    return { sent: false, reason: 'no_store_number' };
  }

  const message = storeNewOrderMessage(order, input);
  const result = await sendWhatsApp(storeNumber, message);
  logger.info(`Store WhatsApp alert for ${order.number}: ${JSON.stringify(result)}`);
  return result;
}

export async function notifyStoreOrderUpdate(
  order: IOrder,
  status: string,
  note?: string
) {
  const storeNumber = env.whatsapp.storeNumber;
  if (!storeNumber) return { sent: false, reason: 'no_store_number' };

  const message = storeOrderUpdateMessage(order, status, note);
  return sendWhatsApp(storeNumber, message);
}
