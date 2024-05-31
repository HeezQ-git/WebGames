const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const prisma = require('./lib/prisma');

const wordRoutes = require('./routes/word.routes');
const gameRoutes = require('./routes/game.routes');

const PORT = process.env.PORT || 8000;
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://web-games-one.vercel.app/',
    'https://web-games-one.vercel.app',
  ],
  credentials: true,
  exposedHeaders: ['Set-Cookie', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  let playerId = req.cookies.playerId;

  if (!playerId) {
    playerId = uuidv4();

    res.cookie('playerId', playerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(202).json({
      action: 'SET_COOKIE',
      message: 'Cookie set, please reload.',
      playerId,
    });
    return;
  } else {
    let player = await prisma.player.findUnique({
      where: { cookie: playerId },
      select: {
        id: true,
      },
    });

    if (!player) {
      player = await prisma.player.create({
        data: {
          name: `Player-${playerId.substring(0, 8)}`,
          cookie: playerId,
        },
      });
    }

    req.playerId = player.id;
  }

  next();
});

dotenv.config();

app.use('/api/word', wordRoutes);
app.use('/api/game', gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
