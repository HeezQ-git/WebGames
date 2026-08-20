const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const {
  validateUsername,
  validatePassword,
  SORT_OPTIONS,
} = require('../lib/validate');

const findPlayerByCookie = (cookie) => {
  if (!cookie) return null;
  return prisma.player.findUnique({ where: { cookie } });
};

const clearPlayerProgress = async (playerId) => {
  const games = await prisma.sbGame.findMany({
    where: { players: { some: { playerId } } },
    select: { id: true },
  });

  await prisma.sbPlayerGame.deleteMany({ where: { playerId } });

  for (const game of games) {
    const remainingPlayers = await prisma.sbPlayerGame.count({
      where: { gameId: game.id },
    });

    if (!remainingPlayers) {
      await prisma.sbGame.delete({ where: { id: game.id } });
    }
  }

  await prisma.wdPlayerStats.deleteMany({ where: { playerId } });
  await prisma.wdGame.deleteMany({ where: { playerId } });
};

const deletePlayerByCookie = async (cookie) => {
  const player = await findPlayerByCookie(cookie);

  if (!player) return false;

  await clearPlayerProgress(player.id);
  await prisma.player.delete({ where: { id: player.id } });

  return true;
};

const changeUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const invalidUsername = validateUsername(username);
    if (invalidUsername) {
      return res.status(400).json({ message: invalidUsername });
    }

    const player = await findPlayerByCookie(req.playerCookie);

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    await prisma.player.update({
      where: { id: player.id },
      data: { name: username },
    });

    return res.status(200).json({ message: 'Username changed successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    console.error(`Error in player.controller changeUsername`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const invalidPassword = validatePassword(newPassword);
    if (invalidPassword) {
      return res.status(400).json({ message: invalidPassword });
    }

    const player = await findPlayerByCookie(req.playerCookie);

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    if (!player.password) {
      return res
        .status(400)
        .json({ message: 'This account has no password set' });
    }

    const isPasswordValid = await bcrypt.compare(
      typeof oldPassword === 'string' ? oldPassword : '',
      player.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    await prisma.player.update({
      where: { id: player.id },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(`Error in player.controller changePassword`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { profanesAllowed, wordListSortBy } = req.body;

    const player = await findPlayerByCookie(req.playerCookie);

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const changes = {};
    if (typeof profanesAllowed === 'boolean') {
      changes.profanesAllowed = profanesAllowed;
    }
    if (SORT_OPTIONS.includes(wordListSortBy)) {
      changes.wordListSortBy = wordListSortBy;
    }

    const settings = await prisma.playerSettings.upsert({
      where: { playerId: player.id },
      update: changes,
      create: {
        playerId: player.id,
        profanesAllowed: changes.profanesAllowed ?? false,
        wordListSortBy: changes.wordListSortBy ?? 'ALPHABETICAL',
      },
    });

    return res
      .status(200)
      .json({ message: 'Player updated successfully', settings });
  } catch (error) {
    console.error(`Error in player.controller updatePlayer`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePlayerProgress = async (req, res) => {
  try {
    const player = await findPlayerByCookie(req.playerCookie);

    if (!player) {
      return res.status(400).json({ message: 'Player not found' });
    }

    await clearPlayerProgress(player.id);

    return res.status(200).json({ message: 'Progress reset successfully' });
  } catch (error) {
    console.error(
      `Error in player.controller deletePlayerProgress`,
      error.message
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePlayerAccount = async (req, res) => {
  try {
    const deleted = await deletePlayerByCookie(req.playerCookie);

    if (!deleted) {
      return res.status(400).json({ message: 'Player not found' });
    }

    return res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error(
      `Error in player.controller deletePlayerAccount`,
      error.message
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  changeUsername,
  changePassword,
  updatePlayer,
  deletePlayerAccount,
  deletePlayerProgress,
  deletePlayerByCookie,
};
