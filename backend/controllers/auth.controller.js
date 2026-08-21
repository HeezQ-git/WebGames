const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const { deletePlayerByCookie } = require('./player.controller');
const { validateUsername, validatePassword } = require('../lib/validate');
const { signToken, verifyToken } = require('../lib/token');
const uuidv4 = require('uuid').v4;

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;

    const invalidUsername = validateUsername(username);
    if (invalidUsername) {
      return res.status(400).json({ message: invalidUsername });
    }

    const invalidPassword = validatePassword(password);
    if (invalidPassword) {
      return res.status(400).json({ message: invalidPassword });
    }

    const playerCookie = req.playerCookie || uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const foundPlayer = await prisma.player.findUnique({
      where: { cookie: playerCookie },
    });

    if (foundPlayer?.password) {
      return res
        .status(409)
        .json({ message: 'This account is already registered' });
    }

    if (foundPlayer) {
      await prisma.player.update({
        where: { id: foundPlayer.id },
        data: { name: username, password: hashedPassword },
      });
    } else {
      await prisma.player.create({
        data: {
          name: username,
          password: hashedPassword,
          cookie: playerCookie,
        },
      });
    }

    return res.status(201).json({
      message: 'Player signed up successfully',
      playerCookie: signToken(playerCookie),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    console.error(`Error in auth.controller signUp`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const signInAsGuest = async (res) => {
  const playerCookie = uuidv4();

  const player = await prisma.player.create({
    data: {
      name: `Player-${playerCookie.substring(0, 8)}`,
      cookie: playerCookie,
      PlayerSettings: {
        create: { profanesAllowed: false, wordListSortBy: 'ALPHABETICAL' },
      },
      WdPlayerStats: { create: {} },
    },
    include: { PlayerSettings: true },
  });

  return res.status(200).json({
    message: 'Player signed in as guest',
    playerCookie: signToken(playerCookie),
    settings: player.PlayerSettings,
  });
};

const signIn = async (req, res) => {
  try {
    const { asGuest, username, password, oldPid } = req.body;

    if (asGuest) return await signInAsGuest(res);

    const player = await prisma.player.findUnique({
      where: { name: typeof username === 'string' ? username : '' },
    });

    const isPasswordValid = await bcrypt.compare(
      typeof password === 'string' ? password : '',
      player?.password || ''
    );

    if (!player || !isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const settings = await prisma.playerSettings.findUnique({
      where: { playerId: player.id },
    });

    const oldCookie = verifyToken(oldPid);

    if (oldCookie && oldCookie !== player.cookie) {
      await deletePlayerByCookie(oldCookie);
    }

    return res.status(200).json({
      message: 'Player signed in successfully',
      playerCookie: signToken(player.cookie),
      settings,
    });
  } catch (error) {
    console.error(`Error in auth.controller signIn`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (typeof username !== 'string' || !username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const player = await prisma.player.findUnique({
      where: { name: username },
    });

    if (player) {
      return res
        .status(200)
        .json({ exists: true, message: 'Username already exists' });
    }

    return res
      .status(200)
      .json({ exists: false, message: 'Username is available' });
  } catch (error) {
    console.error(`Error in auth.controller checkUsername`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
  signIn,
  checkUsername,
};
