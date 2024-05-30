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

  if (!letters) {
    letters = [];
    // !!!! add hard mode?
    for (let i = 0; i < 5; i++) {
      const letter = mostCommonLetters[Math.floor(Math.random() * 10)];
      if (!letters.includes(letter)) letters.push(letter);
      else i--;
    }

    for (let i = 0; i < 2; i++) {
      const letter = otherLetters[Math.floor(Math.random() * 16)];
      if (!letters.includes(letter)) letters.push(letter);
      else i--;
    }
  } else if (typeof letters === 'string')
    letters = JSON.parse(letters.replace(/'/g, '"'));

  if (!centerLetter)
    centerLetter = letters[Math.floor(Math.random() * letters.length)];

  try {
    const pattern = generateLettersRegexPattern(letters, centerLetter);

    const allWords = await prisma.word.findMany({
      where: {
        word: {
          contains: centerLetter,
          mode: 'insensitive',
        },
        isProfane: profanesAllowed === 'true' || profanesAllowed ? true : false,
      },
      select: {
        word: true,
      },
    });

    const words = allWords
      .map((word) => word.word)
      .filter((word) => word.match(pattern));

    let maximumScore = 0;
    for (let word of words)
      maximumScore += getWordScore(word, letters).wordScore;

    const game = await prisma.game.create({
      data: {
        playerId,
        letters,
        centerLetter,
        enteredWords: [],
        maximumScore,
      },
    });

    res.status(200).json(game);
  } catch (error) {
    console.log(`Error in game.controller createGame`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getAllGames = async (req, res) => {
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  }

  try {
    const game = await prisma.game.findMany({
      where: {
        playerId,
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

    res.status(200).json(game);
  } catch (error) {
    console.log(`Error in game.controller getGame`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const deleteGame = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  } else if (!gameId) {
    return res.status(400).send({ message: 'Game ID is required' });
  }

  try {
    await prisma.game.delete({
      where: {
        id: gameId,
        playerId,
      },
    });

    res.status(200).json('Game deleted successfully');
  } catch (error) {
    console.log(`Error in game.controller deleteGame`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const getAllGameWords = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  } else if (!gameId) {
    return res.status(400).send({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        playerId,
      },
      select: {
        centerLetter: true,
        letters: true,
      },
    });

    if (!game) return res.status(400).send({ message: 'Game not found' });

    const pattern = generateLettersRegexPattern(
      game.letters,
      game.centerLetter
    );

    const allWords = await prisma.word.findMany({
      where: {
        word: {
          contains: game.centerLetter,
          mode: 'insensitive',
        },
      },
      select: {
        word: true,
      },
    });

    const words = allWords
      .map((word) => word.word)
      .filter((word) => word.match(pattern));

    res.status(200).json(words);
  } catch (error) {
    console.log(
      `Error in game.controller getAllCorrectGameWords`,
      error.message
    );
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createGame,
  getAllGames,
  deleteGame,
  getAllGameWords,
};
