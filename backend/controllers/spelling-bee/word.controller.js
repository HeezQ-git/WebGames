const prisma = require('../../lib/prisma');

const submitWord = async (req, res) => {
  const { gameId, word, points } = req.body;

  if (!word) {
    return res.status(400).json({ message: 'Word is required' });
  } else if (!points) {
    return res.status(400).json({ message: 'Points are required' });
  } else if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  try {
    const lowerCaseWord = word.toLowerCase();

    const foundWord = await prisma.word.findFirst({
      where: { word: lowerCaseWord },
      select: { isProfane: true },
    });

    if (!foundWord) {
      return res.status(200).json({ error: 'Word is incorrect' });
    }

    const updatedGame = await prisma.sbGame.update({
      where: { id: gameId },
      data: {
        enteredWords: { push: lowerCaseWord },
        score: { increment: points },
      },
      select: {
        score: true,
        enteredWords: true,
      },
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
