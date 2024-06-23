const {
  getWordsFromJSON,
  getProfaneWordsFromJSON,
} = require('../../lib/getWords');
const prisma = require('../../lib/prisma');

const createGameAndReturn = async (playerCookie) => {
  const player = await prisma.player.findUnique({
    where: { cookie: playerCookie },
    select: {
      id: true,
    },
  });

  const settings = await prisma.playerSettings.findFirst({
    where: {
      playerId: player.id,
    },
    select: {
      profanesAllowed: true,
    },
  });

  const wordList = getWordsFromJSON();
  if (settings.profanesAllowed) wordList.concat(getProfaneWordsFromJSON());

  const wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];

  const newGame = await prisma.wdGame.create({
    data: {
      wordToGuess: wordToGuess,
      player: {
        connect: {
          id: player.id,
        },
      },
    },
  });

  return newGame;
};

const createNewGame = async (req, res) => {
  const playerCookie = req.playerCookie;

  try {
    const player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
      select: {
        id: true,
      },
    });

    const game = await prisma.wdGame.findFirst({
      where: {
        playerId: player.id,
      },
    });

    if (game)
      await prisma.wdGame.delete({
        where: {
          id: game.id,
        },
      });

    const newGame = await createGameAndReturn(playerCookie);

    return res
      .status(200)
      .json({ gameId: newGame.id, wordToGuess: newGame.wordToGuess });
  } catch (error) {
    console.error(`Error in game.controller createGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getOrCreateGame = async (req, res) => {
  const playerCookie = req.playerCookie;

  try {
    const player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
      select: {
        id: true,
      },
    });

    const game = await prisma.wdGame.findFirst({
      where: {
        playerId: player.id,
      },
    });

    if (!game) {
      const newGame = await createGameAndReturn(playerCookie);

      return res.status(200).json({
        gameId: newGame.id,
        wordToGuess: newGame.wordToGuess,
        hasWon: newGame.hasWon,
        hasEnded: newGame.hasEnded,
      });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error(`Error in game.controller getGame:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateStats = async (req, res) => {
  const { guesses, hasLost } = req.body;
  const playerCookie = req.playerCookie;

  try {
    const player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
      select: {
        id: true,
      },
    });

    let playerStats = await prisma.wdPlayerStats.findFirst({
      where: {
        playerId: player.id,
      },
    });

    if (hasLost) {
      const updatedStats = await prisma.wdPlayerStats.update({
        where: { id: playerStats.id, playerId: player.id },
        data: {
          totalGuesses: { increment: guesses },
          gamesPlayed: { increment: 1 },
          streak: 0,
        },
      });

      await prisma.wdGame.updateMany({
        where: {
          playerId: player.id,
        },
        data: {
          hasWon: false,
          hasEnded: true,
        },
      });

      return res.status(200).json(updatedStats);
    }

    let winStats = {
      oneGuess: 0,
      twoGuess: 0,
      threeGuess: 0,
      fourGuess: 0,
      fiveGuess: 0,
      sixGuess: 0,
    };

    if (!playerStats) {
      playerStats = await prisma.wdPlayerStats.create({
        data: {
          playerId: player.id,
        },
      });

      if (playerStats.winStats) winStats = foundStats.winStats;
    } else if (playerStats.winStats) {
      winStats = playerStats.winStats;
    }

    switch (guesses) {
      case 1:
        winStats.oneGuess += 1;
        break;
      case 2:
        winStats.twoGuess += 1;
        break;
      case 3:
        winStats.threeGuess += 1;
        break;
      case 4:
        winStats.fourGuess += 1;
        break;
      case 5:
        winStats.fiveGuess += 1;
        break;
      case 6:
        winStats.sixGuess += 1;
        break;
      default:
        break;
    }

    const updatedStats = await prisma.wdPlayerStats.update({
      where: { id: playerStats.id, playerId: player.id },
      data: {
        winStats: winStats,
        totalGuesses: { increment: guesses },
        gamesPlayed: { increment: 1 },
        streak: (playerStats.streak || 0) + 1,
      },
    });

    await prisma.wdGame.updateMany({
      where: {
        playerId: player.id,
      },
      data: {
        hasWon: true,
        hasEnded: true,
      },
    });

    return res.status(200).json(updatedStats);
  } catch (error) {
    console.error(`Error in game.controller updateStats:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getStats = async (req, res) => {
  const playerCookie = req.playerCookie;

  try {
    const player = await prisma.player.findUnique({
      where: { cookie: playerCookie },
      select: {
        id: true,
      },
    });

    const playerStats = await prisma.wdPlayerStats.findFirst({
      where: {
        playerId: player.id,
      },
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
