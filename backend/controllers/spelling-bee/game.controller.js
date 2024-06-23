const getWordScore = require('../../lib/getWordScore');
const prisma = require('../../lib/prisma');
const generateLettersRegexPattern = require('../../lib/regexpPatterns');

// prettier-ignore
const mostCommonLetters = ['E', 'A', 'I', 'O', 'N', 'R', 'T', 'L', 'S', 'U'];
// prettier-ignore
const otherLetters = ['D', 'G', 'B', 'C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y', 'K', 'J', 'X', 'Q', 'Z'];

const createGame = async (req, res) => {
  let { letters, centerLetter, profanesAllowed } = req.body;
  const playerCookie = req.playerCookie;

  const player = await prisma.player.findUnique({
    where: { cookie: playerCookie },
  });

  if (!player) {
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

    profanesAllowed =
      typeof profanesAllowed === 'string'
        ? profanesAllowed === 'true'
        : profanesAllowed;

    let words = await prisma.word.findMany({
      where: {
        word: {
          contains: centerLetter,
          mode: 'insensitive',
        },
      },
      select: { word: true, isProfane: true },
    });

    words = words
      .filter((word) => {
        if (!profanesAllowed)
          return !word.isProfane && word.word.match(pattern);
        else return word.word.match(pattern);
      })
      .map((word) => {
        const { word: wordText, isProfane } = word;
        const { wordScore, isPangram } = getWordScore(wordText, letters);
        return {
          word: wordText,
          points: wordScore,
          isPangram,
          isProfane: isProfane || false,
        };
      });

    const maximumScore = words.reduce((score, word) => score + word.points, 0);

    const game = await prisma.game.create({
      data: {
        letters,
        centerLetter,
        enteredWords: [],
        correctWords: words,
        maximumScore,
      },
    });

    // Create the PlayerGame relationship
    await prisma.playerGame.create({
      data: {
        playerId: player.id,
        gameId: game.id,
      },
    });

    res.status(200).json(game);
  } catch (error) {
    console.error(`Error in game.controller createGame:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllGames = async (req, res) => {
  const playerId = req.playerId;

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
        correctWords: true,
        score: true,
      },
    });

    res.status(200).json(games);
  } catch (error) {
    console.error(`Error in game.controller getAllGames:`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteGame = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
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
        .json({ message: 'Player is not part of this game' });
    }

    await prisma.playerGame.deleteMany({
      where: {
        gameId,
        playerId,
      },
    });

    // check if there are any other players in the game
    const otherPlayers = await prisma.playerGame.findMany({
      where: {
        gameId,
        NOT: { playerId },
      },
    });

    if (!otherPlayers?.length) {
      await prisma.game.delete({
        where: { id: gameId },
      });
    }

    res.status(200).json('Game deleted successfully');
  } catch (error) {
    console.error(`Error in game.controller deleteGame:`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllGameWords = async (req, res) => {
  const { gameId } = req.params;
  const playerId = req.playerId;

  if (!playerId) {
    return res.status(400).json({ error: 'Player ID not found' });
  }

  if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
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
      return res.status(400).json({ message: 'Game not found' });
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addPlayerToGame = async (req, res) => {
  let { playerId, gameId } = req.body;

  if (!playerId) playerId = req.playerId;

  if (!gameId) {
    return res.status(400).json({ error: 'Game ID is required' });
  }

  try {
    const playerExists = await prisma.player.findFirst({
      where: { OR: [{ id: playerId }, { cookie: playerId }] },
    });

    if (!playerExists) {
      return res.status(400).json({ error: 'Player not found' });
    }

    const gameExists = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!gameExists) {
      return res.status(400).json({ error: 'Game not found' });
    }

    const playerGameExists = await prisma.playerGame.findFirst({
      where: {
        playerId: playerExists.id,
        gameId,
      },
    });

    if (playerGameExists) {
      return res
        .status(400)
        .json({ error: 'Player is already part of this game' });
    }

    await prisma.playerGame.create({
      data: {
        playerId: playerExists.id,
        gameId,
      },
    });

    res.status(200).json({ message: 'Player added to game successfully' });
  } catch (error) {
    console.error(`Error in game.controller addPlayerToGame:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getGame = async (req, res) => {
  const { gameId } = req.params;

  if (!gameId || gameId === 'undefined' || gameId === 'null') {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.game.findFirst({
      where: { id: gameId },
    });

    if (!game) {
      return res.status(400).json({ message: 'Game not found' });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error(`Error in game.controller getGame:`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
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
