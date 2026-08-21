const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET;

if (!SECRET || SECRET.length < 16) {
  throw new Error(
    'AUTH_SECRET is missing or too short. Set it to a random value of at least 16 characters, e.g. `openssl rand -base64 32`.'
  );
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const signature = (cookie) =>
  crypto.createHmac('sha256', SECRET).update(cookie).digest('base64url');

const signToken = (cookie) => `${cookie}.${signature(cookie)}`;

const verifyToken = (token) => {
  if (typeof token !== 'string') return null;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;

  const cookie = token.slice(0, separator);
  const provided = token.slice(separator + 1);

  if (!UUID_PATTERN.test(cookie)) return null;

  const expected = signature(cookie);
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  return cookie;
};

const isLegacyToken = (token) =>
  typeof token === 'string' && UUID_PATTERN.test(token);

module.exports = { signToken, verifyToken, isLegacyToken };
