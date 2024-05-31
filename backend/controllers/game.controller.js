const getWordScore = require('../lib/getWordScore');
const prisma = require('../lib/prisma');
const generateLettersRegexPattern = require('../lib/regexpPatterns');

// prettier-ignore
const mostCommonLetters = ['E', 'A', 'I', 'O', 'N', 'R', 'T', 'L', 'S', 'U'];
// prettier-ignore
const otherLetters = ['D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z'];

const createGame = async (req, res) => {
  let { letters, centerLetter, profanesAllowed } = req.body;
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  }

  // Ensure player exists
  const playerExists = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!playerExists) {
    return res.status(400).json({ error: 'Player not found' });
  }

  // Generate letters if not provided
  if (!letters) {
    letters = [];
    while (letters.length < 5) {
      const letter =
        mostCommonLetters[Math.floor(Math.random() * mostCommonLetters.length)];
      if (!letters.includes(letter)) {
        letters.push(letter);
      }
    }
    while (letters.length < 7) {
      const letter =
        otherLetters[Math.floor(Math.random() * otherLetters.length)];
      if (!letters.includes(letter)) {
        letters.push(letter);
      }
    }
  } else if (typeof letters === 'string') {
    letters = JSON.parse(letters.replace(/'/g, '"'));
  }

  if (!centerLetter) {
    centerLetter = letters[Math.floor(Math.random() * letters.length)];
  }

  try {
    const pattern = generateLettersRegexPattern(letters, centerLetter);

    let words = await prisma.word.findMany({
      where: {
        word: {
          contains: centerLetter,
          mode: 'insensitive',
        },
        isProfane: profanesAllowed === 'true' || !!profanesAllowed,
      },
      select: { word: true },
    });

    words = words.filter((word) => word.word.match(pattern));

    const maximumScore = words.reduce(
      (score, word) => score + getWordScore(word.word, letters).wordScore,
      0
    );

    const game = await prisma.game.create({
      data: {
        letters,
        centerLetter,
        enteredWords: [],
        maximumScore,
      },
    });

    // Create the PlayerGame relationship
    await prisma.playerGame.create({
      data: {
        playerId,
        gameId: game.id,
      },
    });

    res.status(200).json(game);
  } catch (error) {
    console.error(`Error in game.controller createGame:`, error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getAllGames = async (req, res) => {
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  }

  try {
    const games = await prisma.game.findMany({
      where: {
        players: {
          some: { playerId },
        },
      },
      select: {
        id: true,
        letters: true,
        centerLetter: true,
        enteredWords: true,
        maximumScore: true,
        score: true,
      },
    });

    res.status(200).json(games);
  } catch (error) {
    console.error(`Error in game.controller getAllGames:`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const deleteGame = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  }

  if (!gameId) {
    return res.status(400).send({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        players: {
          some: { playerId },
        },
      },
    });

    if (!game) {
      return res
        .status(403)
        .send({ message: 'Player is not part of this game' });
    }

    // Delete PlayerGame relationships first
    await prisma.playerGame.deleteMany({
      where: {
        gameId: gameId,
      },
    });

    // Delete the game
    await prisma.game.delete({
      where: { id: gameId },
    });

    res.status(200).json('Game deleted successfully');
  } catch (error) {
    console.error(`Error in game.controller deleteGame:`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getAllGameWords = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  }

  if (!gameId) {
    return res.status(400).send({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        players: {
          some: { playerId },
        },
      },
      select: {
        centerLetter: true,
        letters: true,
      },
    });

    if (!game) {
      return res.status(400).send({ message: 'Game not found' });
    }

    const pattern = generateLettersRegexPattern(
      game.letters,
      game.centerLetter
    );

    const words = await prisma.word
      .findMany({
        where: {
          word: {
            contains: game.centerLetter,
            mode: 'insensitive',
          },
        },
        select: { word: true },
      })
      .then((allWords) => allWords.filter((word) => word.word.match(pattern)));

    res.status(200).json(words);
  } catch (error) {
    console.error(`Error in game.controller getAllGameWords:`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createGame,
  getAllGames,
  deleteGame,
  getAllGameWords,
};
