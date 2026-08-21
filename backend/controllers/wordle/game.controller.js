const { getWordsFromJSON, getProfaneWordsFromJSON } = require('../../lib/getWords');
const { getSpotValues } = require('../../lib/spotValues');
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

const presentGame = (game) => ({
  gameId: game.id,
  enteredWords: game.enteredWords,
  results: game.enteredWords.map((word) =>
    getSpotValues(word, game.wordToGuess)
  ),
  hasWon: game.hasWon,
  hasEnded: game.hasEnded,
  wordToGuess: game.hasEnded ? game.wordToGuess : undefined,
});

const createGameForPlayer = async (playerId) => {
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

    return res.status(200).json(presentGame(await createGameForPlayer(playerId)));
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

    const game =
      (await findCurrentGame(playerId)) || (await createGameForPlayer(playerId));

    return res.status(200).json(presentGame(game));
  } catch (error) {
    console.error(`Error in game.controller getOrCreateGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getStats = async (req, res) => {
  try {
    const playerId = await findPlayerId(req.playerCookie);

    if (!playerId) {
      return res.status(400).json({ message: 'Player not found' });
    }

    const stats = await prisma.wdPlayerStats.upsert({
      where: { playerId },
      update: {},
      create: { playerId },
    });

    return res.status(200).json(stats);
  } catch (error) {
    console.error(`Error in game.controller getStats:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createNewGame,
  getOrCreateGame,
  getStats,
  findPlayerId,
  findCurrentGame,
  presentGame,
  MAX_GUESSES,
};
