const getWordScore = require('../../lib/getWordScore');
const prisma = require('../../lib/prisma');
const generateLettersRegexPattern = require('../../lib/regexpPatterns');
const { isObjectId } = require('../../lib/validate');

// prettier-ignore
const mostCommonLetters = ['E', 'A', 'I', 'O', 'N', 'R', 'T', 'L', 'S', 'U'];
// prettier-ignore
const otherLetters = ['D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z'];

const LETTERS_COUNT = 7;
const COMMON_LETTERS_COUNT = 5;
const MIN_GENERATED_WORDS = 10;
const MAX_GENERATION_ATTEMPTS = 20;

const generateLetters = () => {
  const letters = [];

  const pick = (pool) => {
    let letter;
    do {
      letter = pool[Math.floor(Math.random() * pool.length)];
    } while (letters.includes(letter));
    letters.push(letter);
  };

  while (letters.length < COMMON_LETTERS_COUNT) pick(mostCommonLetters);
  while (letters.length < LETTERS_COUNT) pick(otherLetters);

  return letters;
};

const parseLetters = (letters) => {
  let parsed = letters;

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed.replace(/'/g, '"'));
    } catch {
      return null;
    }
  }

  if (!Array.isArray(parsed) || parsed.length !== LETTERS_COUNT) return null;

  const normalized = parsed.map((letter) =>
    typeof letter === 'string' ? letter.toUpperCase() : ''
  );

  if (normalized.some((letter) => !/^[A-Z]$/.test(letter))) return null;
  if (new Set(normalized).size !== LETTERS_COUNT) return null;

  return normalized;
};

const buildCorrectWords = async (letters, centerLetter, profanesAllowed) => {
  const pattern = generateLettersRegexPattern(letters, centerLetter);

  const allWords = await prisma.word.findMany({
    where: { word: { contains: centerLetter, mode: 'insensitive' } },
    select: { word: true, isProfane: true },
  });

  return allWords
    .filter(
      (word) => (profanesAllowed || !word.isProfane) && pattern.test(word.word)
    )
    .map((word) => {
      const { wordScore, isPangram } = getWordScore(word.word, letters);
      return {
        word: word.word,
        points: wordScore,
        isPangram,
        isProfane: word.isProfane || false,
      };
    });
};

const generatePlayablePuzzle = async (profanesAllowed) => {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const letters = generateLetters();
    const centerLetter = letters[Math.floor(Math.random() * letters.length)];
    const words = await buildCorrectWords(letters, centerLetter, profanesAllowed);

    if (words.length >= MIN_GENERATED_WORDS) {
      return { letters, centerLetter, words };
    }
  }

  return null;
};

const createGame = async (req, res) => {
  try {
    const { letters: rawLetters, centerLetter: rawCenterLetter } = req.body;
    const playerId = req.playerId;

    const profanesAllowed =
      typeof req.body.profanesAllowed === 'string'
        ? req.body.profanesAllowed === 'true'
        : Boolean(req.body.profanesAllowed);

    let puzzle;

    if (rawLetters) {
      const letters = parseLetters(rawLetters);

      if (!letters) {
        return res.status(400).json({ message: 'Invalid letters' });
      }

      const centerLetter = rawCenterLetter
        ? String(rawCenterLetter).toUpperCase()
        : letters[Math.floor(Math.random() * letters.length)];

      if (!letters.includes(centerLetter)) {
        return res
          .status(400)
          .json({ message: 'Center letter must be one of the letters' });
      }

      const words = await buildCorrectWords(
        letters,
        centerLetter,
        profanesAllowed
      );

      if (!words.length) {
        return res
          .status(400)
          .json({ message: 'No words can be built from these letters' });
      }

      puzzle = { letters, centerLetter, words };
    } else {
      puzzle = await generatePlayablePuzzle(profanesAllowed);

      if (!puzzle) {
        return res
          .status(503)
          .json({ message: 'Could not generate a playable game, try again' });
      }
    }

    const maximumScore = puzzle.words.reduce(
      (score, word) => score + word.points,
      0
    );

    const game = await prisma.sbGame.create({
      data: {
        letters: puzzle.letters,
        centerLetter: puzzle.centerLetter,
        enteredWords: [],
        correctWords: puzzle.words,
        maximumScore,
        players: { create: { playerId } },
      },
    });

    return res.status(200).json(game);
  } catch (error) {
    console.error(`Error in game.controller createGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllGames = async (req, res) => {
  const playerId = req.playerId;

  try {
    const games = await prisma.sbGame.findMany({
      where: { players: { some: { playerId } } },
      select: {
        id: true,
        letters: true,
        centerLetter: true,
        enteredWords: true,
        maximumScore: true,
        correctWords: true,
        score: true,
      },
    });

    return res.status(200).json(games);
  } catch (error) {
    console.error(`Error in game.controller getAllGames:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteGame = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!isObjectId(gameId)) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.sbGame.findFirst({
      where: { id: gameId, players: { some: { playerId } } },
      select: { id: true },
    });

    if (!game) {
      return res
        .status(403)
        .json({ message: 'Player is not part of this game' });
    }

    await prisma.sbPlayerGame.deleteMany({ where: { gameId, playerId } });

    const remainingPlayers = await prisma.sbPlayerGame.count({
      where: { gameId },
    });

    if (!remainingPlayers) {
      await prisma.sbGame.delete({ where: { id: gameId } });
    }

    return res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error(`Error in game.controller deleteGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllGameWords = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!isObjectId(gameId)) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.sbGame.findFirst({
      where: { id: gameId, players: { some: { playerId } } },
      select: { centerLetter: true, letters: true },
    });

    if (!game) {
      return res.status(400).json({ message: 'Game not found' });
    }

    const pattern = generateLettersRegexPattern(
      game.letters,
      game.centerLetter
    );

    const allWords = await prisma.word.findMany({
      where: { word: { contains: game.centerLetter, mode: 'insensitive' } },
      select: { word: true },
    });

    return res
      .status(200)
      .json(allWords.filter((word) => pattern.test(word.word)));
  } catch (error) {
    console.error(`Error in game.controller getAllGameWords:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addPlayerToGame = async (req, res) => {
  const { gameId } = req.body;
  const playerId = req.playerId;

  if (!isObjectId(gameId)) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const gameExists = await prisma.sbGame.findUnique({
      where: { id: gameId },
      select: { id: true },
    });

    if (!gameExists) {
      return res.status(400).json({ message: 'Game not found' });
    }

    await prisma.sbPlayerGame.create({ data: { playerId, gameId } });

    return res
      .status(200)
      .json({ message: 'Player added to game successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'Player is already part of this game' });
    }

    console.error(`Error in game.controller addPlayerToGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getGame = async (req, res) => {
  const { gameId } = req.params;

  if (!isObjectId(gameId)) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.sbGame.findUnique({ where: { id: gameId } });

    if (!game) {
      return res.status(400).json({ message: 'Game not found' });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error(`Error in game.controller getGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createGame,
  getGame,
  getAllGames,
  deleteGame,
  getAllGameWords,
  addPlayerToGame,
};
