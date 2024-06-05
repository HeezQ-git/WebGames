const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

const changeUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const playerCookie = req.playerCookie;

    const player = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        name: username,
      },
    });

    return res.status(200).json({ message: 'Username changed successfully' });
  } catch (error) {
    console.log(`Error in player.controller changeUsername`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const playerCookie = req.playerCookie;

    const player = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, player.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.player.update({
      where: {
        cookie: playerCookie,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(`Error in player.controller changePassword`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePlayer = async (req, res) => {
  const { profanesAllowed } = req.body;
  const playerCookie = req.playerCookie;

  try {
    const player = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    await prisma.player.update({
      where: {
        cookie: playerCookie,
      },
      data: {
        profanesAllowed,
      },
    });

    return res.status(200).json({ message: 'Player updated successfully' });
  } catch (error) {
    console.log(`Error in player.controller updatePlayer`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePlayerProgress = async (req, res) => {
  const playerCookie = req.playerCookie;

  try {
    const player = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const foundGames = await prisma.game.findMany({
      where: {
        players: {
          some: {
            playerId: player.id,
          },
        },
      },
    });

    for (const game of foundGames) {
      await prisma.playerGame.deleteMany({
        where: {
          playerId: player.id,
          gameId: game.id,
        },
      });

      const otherPlayers = await prisma.playerGame.findMany({
        where: {
          gameId: game.id,
          NOT: { playerId: player.id },
        },
      });

      if (!otherPlayers?.length) {
        await prisma.game.delete({
          where: { id: game.id },
        });
      }
    }

    return res.status(200);
  } catch (error) {
    console.log(
      `Error in player.controller deletePlayerProgress`,
      error.message
    );
    res.status(500);
  }
};

const deletePlayerAccount = async (req, res) => {
  let playerCookie = req.playerCookie;
  if (req.oldCookie) playerCookie = req.oldCookie;

  try {
    const player = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    await deletePlayerProgress(req, res);

    await prisma.player.delete({
      where: {
        id: player.id,
      },
    });

    return res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.log(
      `Error in player.controller deletePlayerAccount`,
      error.message
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  changeUsername,
  changePassword,
  updatePlayer,
  deletePlayerAccount,
  deletePlayerProgress,
};
