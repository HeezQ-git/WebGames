require('dotenv').config();

const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const sbWordRoutes = require('./routes/spelling-bee/word.routes');
const sbGameRoutes = require('./routes/spelling-bee/game.routes');

const wdWordRoutes = require('./routes/wordle/word.routes');
const wdGameRoutes = require('./routes/wordle/game.routes');

const PORT = process.env.PORT || 8000;
const PUBLIC_PATHS = ['/api/auth/signin'];

const app = express();

const allowedOrigins = [
  ...(process.env.CORS_ORIGINS?.split(',') ?? []),
  'http://localhost:3000',
]
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createPlayer = (playerCookie) =>
  prisma.player.create({
    data: {
      name: `Player-${playerCookie.substring(0, 8)}`,
      cookie: playerCookie,
      PlayerSettings: {
        create: { profanesAllowed: false, wordListSortBy: 'ALPHABETICAL' },
      },
      WdPlayerStats: { create: {} },
    },
  });

app.use(async (req, res, next) => {
  if (PUBLIC_PATHS.includes(req.path)) return next();

  const playerCookie = req.headers?.authorization;

  if (!playerCookie) {
    return res
      .status(403)
      .json({ message: 'Player ID not found. Please sign in to continue' });
  }

  try {
    let player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
    });

    if (!player) {
      try {
        player = await createPlayer(playerCookie);
      } catch (error) {
        if (error.code !== 'P2002') throw error;
        player = await prisma.player.findUnique({
          where: { cookie: playerCookie },
        });
      }
    }

    if (!player) {
      return res.status(403).json({ message: 'Player could not be resolved' });
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
