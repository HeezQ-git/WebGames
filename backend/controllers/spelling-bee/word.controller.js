const prisma = require('../../lib/prisma');
const { isObjectId } = require('../../lib/validate');

const submitWord = async (req, res) => {
  const { gameId, word } = req.body;
  const playerId = req.playerId;

  if (typeof word !== 'string' || !word) {
    return res.status(400).json({ message: 'Word is required' });
  }

  if (!isObjectId(gameId)) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const game = await prisma.sbGame.findFirst({
      where: { id: gameId, players: { some: { playerId } } },
      select: { correctWords: true, enteredWords: true },
    });

    if (!game) {
      return res
        .status(403)
        .json({ message: 'Player is not part of this game' });
    }

    const lowerCaseWord = word.toLowerCase();
    const correctWord = game.correctWords.find(
      (entry) => entry.word === lowerCaseWord
    );

    if (!correctWord) {
      return res.status(200).json({ error: 'Word is incorrect' });
    }

    if (game.enteredWords.includes(lowerCaseWord)) {
      return res.status(200).json({ error: 'Word was already found' });
    }

    if (correctWord.isProfane) {
      const settings = await prisma.playerSettings.findUnique({
        where: { playerId },
        select: { profanesAllowed: true },
      });

      if (!settings?.profanesAllowed) {
        return res.status(200).json({ error: 'Word is incorrect' });
      }
    }

    const updatedGame = await prisma.sbGame.update({
      where: { id: gameId },
      data: {
        enteredWords: { push: lowerCaseWord },
        score: { increment: correctWord.points },
      },
      select: { score: true, enteredWords: true },
    });

    return res.status(200).json({
      newScore: updatedGame.score,
      wordList: updatedGame.enteredWords,
    });
  } catch (error) {
    console.error(`Error in word.controller submitWord:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  submitWord,
};
