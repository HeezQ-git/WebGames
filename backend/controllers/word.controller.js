const getWordScore = require('../lib/getWordScore');
const prisma = require('../lib/prisma');

const checkWord = async (req, res) => {
  try {
    const { gameId, word, profanesAllowed } = req.body;
    const playerId = req.playerId;

    if (!playerId)
      return res.status(400).json({ error: 'Player ID not found' });
    else if (!word)
      return res.status(400).send({ message: 'Word is required' });

    // Check if the word exists
    const foundWord = await prisma.word.findFirst({
      where: {
        word: word.toLowerCase(),
      },
      select: {
        isProfane: true,
      },
    });

    // Are profanes allowed?
    if (
      !foundWord ||
      (foundWord.isProfane && (profanesAllowed === 'false' || !profanesAllowed))
    )
      return res.status(200).send({ error: 'Word is incorrect' });

    // Get the game and add the word to the word list
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
      },
      select: {
        enteredWords: true,
        letters: true,
      },
    });

    if (!game) return res.status(400).send({ message: 'Game not found' });
    if (game.enteredWords.includes(word.toLowerCase()))
      return res.status(200).send({ error: 'Word already entered' });

    const { wordScore, isPangram } = getWordScore(word, game.letters);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        enteredWords: {
          push: word.toLowerCase(),
        },
        score: {
          increment: wordScore,
        },
      },
    });

    let message = '';

    if (isPangram) message = 'Pangram!';
    else if (wordScore === 1) message = 'Good!';
    else if (wordScore === 5 || wordScore === 6) message = 'Great!';
    else if (wordScore >= 7) message = 'Awesome!';

    return res.status(200).send({
      message,
      isPangram,
      isProfane: foundWord.isProfane,
      newScore: updatedGame.score,
      wordScore,
      wordList: updatedGame.enteredWords,
    });
  } catch (error) {
    console.log(`Error in word.controller checkWord`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  checkWord,
};
