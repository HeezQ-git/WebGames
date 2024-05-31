const getWordScore = require('../lib/getWordScore');
const prisma = require('../lib/prisma');

const checkWord = async (req, res) => {
  try {
    const { gameId, word, profanesAllowed } = req.body;
    const playerId = req.playerId;

    if (!playerId) {
      return res.status(400).json({ error: 'Player ID not found' });
    }

    if (!word) {
      return res.status(400).json({ message: 'Word is required' });
    }

    const lowerCaseWord = word.toLowerCase();

    const [foundWord, game, playerGame] = await Promise.all([
      prisma.word.findFirst({
        where: { word: lowerCaseWord },
        select: { isProfane: true },
      }),
      prisma.game.findFirst({
        where: { id: gameId },
        select: { enteredWords: true, letters: true },
      }),
      prisma.playerGame.findFirst({
        where: { playerId, gameId },
      }),
    ]);

    if (
      !foundWord ||
      (foundWord.isProfane && (profanesAllowed === 'false' || !profanesAllowed))
    ) {
      return res.status(200).json({ error: 'Word is incorrect' });
    }

    if (!game) {
      return res.status(400).json({ message: 'Game not found' });
    }

    if (game.enteredWords.includes(lowerCaseWord)) {
      return res.status(200).json({ error: 'Word already entered' });
    }

    if (!playerGame) {
      return res
        .status(403)
        .json({ message: 'Player is not part of this game' });
    }

    const { wordScore, isPangram } = getWordScore(word, game.letters);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        enteredWords: { push: lowerCaseWord },
        score: { increment: wordScore },
      },
      select: {
        score: true,
        enteredWords: true,
      },
    });

    let message = '';
    if (isPangram) message = 'Pangram!';
    else if (wordScore === 1) message = 'Good!';
    else if (wordScore === 5 || wordScore === 6) message = 'Great!';
    else if (wordScore >= 7) message = 'Awesome!';

    return res.status(200).json({
      message,
      isPangram,
      isProfane: foundWord.isProfane,
      newScore: updatedGame.score,
      wordScore,
      wordList: updatedGame.enteredWords,
    });
  } catch (error) {
    console.error(`Error in word.controller checkWord:`, error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  checkWord,
};
