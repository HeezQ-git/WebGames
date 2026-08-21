const prisma = require('../../lib/prisma');
const { getWordsFromJSON, getProfaneWordsFromJSON, isAllowedWord } = require('../../lib/getWords');
const { getSpotValues, CORRECT } = require('../../lib/spotValues');
const {
  findPlayerId,
  findCurrentGame,
  presentGame,
  MAX_GUESSES,
} = require('./game.controller');

const GUESS_KEYS = [
  'oneGuess',
  'twoGuess',
  'threeGuess',
  'fourGuess',
  'fiveGuess',
  'sixGuess',
];

const bumpWinStats = (current, guesses) => {
  const winStats = GUESS_KEYS.reduce(
    (stats, key) => ({ ...stats, [key]: current?.[key] || 0 }),
    {}
  );

  winStats[GUESS_KEYS[guesses - 1]] += 1;

  return winStats;
};

const recordResult = async (playerId, guesses, hasWon) => {
  const stats = await prisma.wdPlayerStats.upsert({
    where: { playerId },
    update: {},
    create: { playerId },
  });

  return prisma.wdPlayerStats.update({
    where: { id: stats.id },
    data: hasWon
      ? {
          winStats: bumpWinStats(stats.winStats, guesses),
          totalGuesses: { increment: guesses },
          gamesPlayed: { increment: 1 },
          streak: (stats.streak || 0) + 1,
        }
      : {
          totalGuesses: { increment: guesses },
          gamesPlayed: { increment: 1 },
          streak: 0,
        },
  });
};

const submitWord = async (req, res) => {
  const { word } = req.body;

  if (typeof word !== 'string' || !/^[a-zA-Z]{5}$/.test(word)) {
    return res.status(400).json({ message: 'Word must be 5 letters long' });
  }

  const lowerCaseWord = word.toLowerCase();

  if (!isAllowedWord(lowerCaseWord)) {
    return res.status(400).json({ message: 'Not in word list' });
  }

  try {
    const playerId = await findPlayerId(req.playerCookie);

    if (!playerId) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const game = await findCurrentGame(playerId);

    if (!game) {
      return res.status(400).json({ message: 'Game not found' });
    }

    if (game.hasEnded || game.enteredWords.length >= MAX_GUESSES) {
      return res.status(400).json({ message: 'Game has already ended' });
    }

    const enteredWords = [...game.enteredWords, lowerCaseWord];
    const spots = getSpotValues(lowerCaseWord, game.wordToGuess);
    const hasWon = spots.every((spot) => spot === CORRECT);
    const hasEnded = hasWon || enteredWords.length >= MAX_GUESSES;

    const updatedGame = await prisma.wdGame.update({
      where: { id: game.id },
      data: { enteredWords: { push: lowerCaseWord }, hasWon, hasEnded },
    });

    const stats = hasEnded
      ? await recordResult(playerId, enteredWords.length, hasWon)
      : undefined;

    return res.status(200).json({ ...presentGame(updatedGame), stats });
  } catch (error) {
    console.error(`Error in word.controller submitWord:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getWords = async (_, res) => {
  try {
    return res.status(200).json(getWordsFromJSON());
  } catch (error) {
    console.error(`Error in word.controller getWords:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getProfaneWords = async (_, res) => {
  try {
    return res.status(200).json(getProfaneWordsFromJSON());
  } catch (error) {
    console.error(`Error in word.controller getProfaneWords:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { submitWord, getWords, getProfaneWords };
