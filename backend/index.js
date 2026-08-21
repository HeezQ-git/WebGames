require('dotenv').config();

const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');
const { verifyToken, isLegacyToken } = require('./lib/token');

const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const sbWordRoutes = require('./routes/spelling-bee/word.routes');
const sbGameRoutes = require('./routes/spelling-bee/game.routes');

const wdWordRoutes = require('./routes/wordle/word.routes');
const wdGameRoutes = require('./routes/wordle/game.routes');

const PORT = process.env.PORT || 8000;
const PUBLIC_PATHS = ['/api/auth/signin'];

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  ...(process.env.CORS_ORIGINS?.split(',') ?? []),
  'http://localhost:3000',
]
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const invalidSession = (res, message) =>
  res.status(403).json({ code: 'INVALID_SESSION', message });

app.use(async (req, res, next) => {
  if (PUBLIC_PATHS.includes(req.path)) return next();

  const token = req.headers?.authorization;
  const playerCookie = verifyToken(token) || (isLegacyToken(token) ? token : null);

  if (!playerCookie) {
    return invalidSession(res, 'Please sign in to continue');
  }

  try {
    const player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
      select: { id: true },
    });

    if (!player) {
      return invalidSession(res, 'Your session is no longer valid');
    }

    req.playerId = player.id;
    req.playerCookie = playerCookie;

    return next();
  } catch (error) {
    console.error('Error resolving player:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/spelling-bee/word', sbWordRoutes);
app.use('/api/spelling-bee/game', sbGameRoutes);
app.use('/api/wordle/word', wdWordRoutes);
app.use('/api/wordle/game', wdGameRoutes);

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error.message);
  if (res.headersSent) return next(error);
  return res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
