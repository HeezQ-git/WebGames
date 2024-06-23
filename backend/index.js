const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const prisma = require('./lib/prisma');

const authRoutes = require('./routes/auth.routes');
const playerRoutes = require('./routes/player.routes');
const sbWordRoutes = require('./routes/spelling-bee/word.routes');
const sbGameRoutes = require('./routes/spelling-bee/game.routes');

const PORT = process.env.PORT || 8000;
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://web-games-one.vercel.app/',
    'https://web-games-one.vercel.app',
    'https://web-games-frontend-git-dev-heezqgits-projects.vercel.app/',
    'https://web-games-frontend-git-dev-heezqgits-projects.vercel.app',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (req.path === '/api/auth/signin') return next();

  let playerCookie = req.headers?.authorization;

  if (!playerCookie || !playerCookie.length) {
    return res
      .status(403)
      .json({ message: 'Player ID not found. Please sign in to continue' });
  } else {
    let player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
    });

    if (!player) {
      try {
        player = await prisma.player.create({
          data: {
            name: `Player-${playerCookie.substring(0, 8)}`,
            cookie: playerCookie,
          },
        });
      } catch (error) {
        if (error.code === 'P2002') {
          player = await prisma.player.findUnique({
            where: { cookie: playerCookie },
          });
        } else {
          console.error('Error creating player:', error);
          res
            .status(500)
            .send({ message: 'Internal Server Error' })
            .redirect('/signout');
          return;
        }
      }
    }

    req.playerId = player.id;
    req.playerCookie = playerCookie;
  }

  next();
});

dotenv.config();

app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/spelling-bee/word', sbWordRoutes);
app.use('/api/spelling-bee/game', sbGameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
