import type { NextApiRequest, NextApiResponse } from 'next';

export function methodNotAllowed(res: NextApiResponse, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '));
  return res.status(405).json({ error: `Method not allowed. Use ${allowed.join(' or ')}.` });
}

export function badRequest(res: NextApiResponse, message: string) {
  return res.status(400).json({ error: message });
}

export function notFound(res: NextApiResponse, message = 'Resource not found') {
  return res.status(404).json({ error: message });
}

export function serverError(res: NextApiResponse, error: unknown, context?: string) {
  const message = error instanceof Error ? error.message : 'Internal server error';
  console.error(`[API Error]${context ? ` ${context}` : ''}:`, message);
  return res.status(500).json({ error: 'Internal server error. Please try again later.' });
}

export function validateHex(value: unknown, length?: number): value is string {
  if (typeof value !== 'string') return false;
  if (length && value.length !== length) return false;
  return /^0x[a-fA-F0-9]+$/.test(value);
}

export function validateId(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.length < 10 || value.length > 100) return false;
  return /^0x[a-fA-F0-9]+$/.test(value) || /^0xSIM_/.test(value) || /^0xDEMO_/.test(value);
}

export function sanitizeString(value: unknown, max = 100): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export function validatePositiveInt(value: unknown): number | null {
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0 && String(n) === value.trim()) return n;
  }
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return value;
  return null;
}
