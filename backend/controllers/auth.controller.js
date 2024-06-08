const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const { deletePlayerAccount } = require('./player.controller');
const uuidv4 = require('uuid').v4;

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    let playerCookie = req.playerCookie;

    if (!playerCookie) playerCookie = uuidv4();

    const foundPlayer = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (foundPlayer) {
      await prisma.player.update({
        where: {
          id: foundPlayer.id,
        },
        data: {
          name: username,
          password: hashedPassword,
        },
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

    return res
      .status(201)
      .json({ message: 'Player signed up successfully', playerCookie });
  } catch (error) {
    console.log(`Error in auth.controller signUp`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { asGuest, username, password, oldPid: oldCookie } = req.body;

    if (asGuest) {
      const playerId = uuidv4();

      const player = await prisma.player.create({
        data: {
          name: `Player-${playerId.substring(0, 8)}`,
          cookie: playerId,
        },
      });

      const settings = await prisma.playerSettings.create({
        data: {
          playerId: player.id,
          profanesAllowed: false,
          wordListSortBy: 'ALPHABETICAL',
        },
      });

      return res.status(200).json({
        message: 'Player signed in as guest',
        playerCookie: playerId,
        settings,
      });
    }

    const player = await prisma.player.findUnique({
      where: {
        name: username,
      },
    });

    const settings = await prisma.playerSettings.findUnique({
      where: {
        playerId: player?.id,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      player?.password || ''
    );

    if (!isPasswordValid || !player) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // avoid unnecessary guest accounts
    if (oldCookie) {
      const foundPlayer = await prisma.player.findUnique({
        where: {
          cookie: oldCookie,
        },
      });

      if (foundPlayer) {
        req.oldCookie = oldCookie;
        await deletePlayerAccount(req, res);
      }
    }

    return res.status(200).json({
      message: 'Player signed in successfully',
      playerCookie: player.cookie,
      settings,
    });
  } catch (error) {
    console.log(`Error in auth.controller signIn`, error.message);
    res.status(500);
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const player = await prisma.player.findUnique({
      where: {
        name: username,
      },
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
    console.log(`Error in auth.controller checkUsername`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
  signIn,
  checkUsername,
};
