type WindowMap = Map<string, { count: number; resetAt: number }>;

const windows = new Map<string, WindowMap>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  strict: { maxRequests: 10, windowMs: 60_000 },
  moderate: { maxRequests: 30, windowMs: 60_000 },
  relaxed: { maxRequests: 100, windowMs: 60_000 },
};

function getIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip.trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function checkRateLimit(
  req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } },
  tier: keyof typeof DEFAULTS = 'moderate'
): { limited: boolean; remaining: number; resetInMs: number } {
  const ip = getIp(req);
  const config = DEFAULTS[tier];

  if (!windows.has(tier)) {
    windows.set(tier, new Map());
  }

  const bucket = windows.get(tier)!;
  const now = Date.now();
  const record = bucket.get(ip);

  if (!record || now >= record.resetAt) {
    bucket.set(ip, { count: 1, resetAt: now + config.windowMs });
    return { limited: false, remaining: config.maxRequests - 1, resetInMs: config.windowMs };
  }

  record.count += 1;

  if (record.count > config.maxRequests) {
    return { limited: true, remaining: 0, resetInMs: record.resetAt - now };
  }

  return { limited: false, remaining: config.maxRequests - record.count, resetInMs: record.resetAt - now };
}

export function rateLimitResponse(res: { status: (code: number) => any; setHeader?: (key: string, value: string) => void }, resetInMs: number) {
  if (res.setHeader) {
    res.setHeader('Retry-After', String(Math.ceil(resetInMs / 1000)));
  }
  return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
}
