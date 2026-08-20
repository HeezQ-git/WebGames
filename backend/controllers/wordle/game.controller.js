const {
  getWordsFromJSON,
  getProfaneWordsFromJSON,
} = require('../../lib/getWords');
const prisma = require('../../lib/prisma');

const MAX_GUESSES = 6;

const findPlayerId = async (playerCookie) => {
  const player = await prisma.player.findUnique({
    where: { cookie: playerCookie },
    select: { id: true },
  });

  return player?.id || null;
};

const findCurrentGame = (playerId) =>
  prisma.wdGame.findFirst({
    where: { playerId },
    orderBy: { createdAt: 'desc' },
  });

const createGameAndReturn = async (playerId) => {
  const settings = await prisma.playerSettings.findUnique({
    where: { playerId },
    select: { profanesAllowed: true },
  });

  const wordList = settings?.profanesAllowed
    ? [...getWordsFromJSON(), ...getProfaneWordsFromJSON()]
    : getWordsFromJSON();

  const wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];

  return prisma.wdGame.create({
    data: { wordToGuess, player: { connect: { id: playerId } } },
  });
};

const createNewGame = async (req, res) => {
  try {
    const playerId = await findPlayerId(req.playerCookie);

    if (!playerId) {
      return res.status(400).json({ message: 'Player not found' });
    }

    await prisma.wdGame.deleteMany({ where: { playerId } });

    const newGame = await createGameAndReturn(playerId);

    return res
      .status(200)
      .json({ gameId: newGame.id, wordToGuess: newGame.wordToGuess });
  } catch (error) {
    console.error(`Error in game.controller createNewGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getOrCreateGame = async (req, res) => {
  try {
    const playerId = await findPlayerId(req.playerCookie);

    if (!playerId) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const game = (await findCurrentGame(playerId)) ||
      (await createGameAndReturn(playerId));

    return res.status(200).json({
      gameId: game.id,
      wordToGuess: game.wordToGuess,
      enteredWords: game.enteredWords,
      hasWon: game.hasWon,
      hasEnded: game.hasEnded,
    });
  } catch (error) {
    console.error(`Error in game.controller getOrCreateGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateStats = async (req, res) => {
  const { guesses, hasLost } = req.body;

  if (!Number.isInteger(guesses) || guesses < 1 || guesses > MAX_GUESSES) {
    return res.status(400).json({ message: 'Invalid number of guesses' });
  }

  try {
    const playerId = await findPlayerId(req.playerCookie);

    if (!playerId) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const playerStats = await prisma.wdPlayerStats.upsert({
      where: { playerId },
      update: {},
      create: { playerId },
    });

    const game = await findCurrentGame(playerId);

    const data = hasLost
      ? {
          totalGuesses: { increment: guesses },
          gamesPlayed: { increment: 1 },
          streak: 0,
        }
      : {
          winStats: bumpWinStats(playerStats.winStats, guesses),
          totalGuesses: { increment: guesses },
          gamesPlayed: { increment: 1 },
          streak: (playerStats.streak || 0) + 1,
        };

    const updatedStats = await prisma.wdPlayerStats.update({
      where: { id: playerStats.id },
      data,
    });

    if (game) {
      await prisma.wdGame.update({
        where: { id: game.id },
        data: { hasWon: !hasLost, hasEnded: true },
      });
    }

    return res.status(200).json(updatedStats);
  } catch (error) {
    console.error(`Error in game.controller updateStats:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const GUESS_KEYS = [
  'oneGuess',
  'twoGuess',
  'threeGuess',
  'fourGuess',
  'fiveGuess',
  'sixGuess',
];

function bumpWinStats(current, guesses) {
  const winStats = GUESS_KEYS.reduce(
    (stats, key) => ({ ...stats, [key]: current?.[key] || 0 }),
    {}
  );

  winStats[GUESS_KEYS[guesses - 1]] += 1;

  return winStats;
}

const getStats = async (req, res) => {
  try {
    const playerId = await findPlayerId(req.playerCookie);

    if (!playerId) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const playerStats = await prisma.wdPlayerStats.upsert({
      where: { playerId },
      update: {},
      create: { playerId },
    });

    return res.status(200).json(playerStats);
  } catch (error) {
    console.error(`Error in game.controller getStats:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createNewGame,
  getOrCreateGame,
  updateStats,
  getStats,
};
