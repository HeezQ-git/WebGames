const MAX_TRACKED_CLIENTS = 10000;
const DEFAULT_MAX = Number(process.env.AUTH_RATE_LIMIT_MAX) || 100;

const rateLimit = ({ windowMs, max = DEFAULT_MAX }) => {
  const buckets = new Map();

  const sweep = (now) => {
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }

    if (buckets.size > MAX_TRACKED_CLIENTS) buckets.clear();
  };

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const bucket = buckets.get(key);

    if (buckets.size >= MAX_TRACKED_CLIENTS) sweep(now);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      res.set('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
      return res.status(429).json({ message: 'Too many requests, slow down' });
    }

    bucket.count++;
    return next();
  };
};

module.exports = rateLimit;
