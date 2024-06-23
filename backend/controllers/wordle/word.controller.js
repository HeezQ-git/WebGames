const prisma = require('../../lib/prisma');

const {
  getWordsFromJSON,
  getProfaneWordsFromJSON,
} = require('../../lib/getWords');

const submitWord = async (req, res) => {
  const { word } = req.body;
  const playerCookie = req.playerCookie;

  try {
    if (!word) {
      return res.status(400).json({ message: 'Word is required' });
    }

    const lowerCaseWord = word.toLowerCase();

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
      return res.status(400).json({ message: 'Game not found' });
    }

    await prisma.wdGame.update({
      where: { id: game.id },
      data: {
        enteredWords: { push: lowerCaseWord },
      },
    });

    return res.status(200).json({ message: 'Word submitted' });
  } catch (error) {
    console.error(`Error in word.controller submitWord:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getWords = async (_, res) => {
  try {
    const words = getWordsFromJSON();
    return res.status(200).json(words);
  } catch (error) {
    console.error(`Error in word.controller getWords:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getProfaneWords = async (_, res) => {
  try {
    const words = getProfaneWordsFromJSON();
    return res.status(200).json(words);
  } catch (error) {
    console.error(`Error in word.controller getProfaneWords:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  submitWord,
  getWords,
  getProfaneWords,
};
