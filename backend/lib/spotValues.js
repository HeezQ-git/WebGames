const CORRECT = 'CORRECT';
const PRESENT = 'PRESENT';
const NOT_IN_WORD = 'NOT_IN_WORD';

const getSpotValues = (guess, wordToGuess) => {
  const result = new Array(guess.length).fill(NOT_IN_WORD);
  const remaining = {};

  for (const letter of wordToGuess) {
    remaining[letter] = (remaining[letter] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === wordToGuess[i]) {
      result[i] = CORRECT;
      remaining[guess[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] !== CORRECT && remaining[guess[i]] > 0) {
      result[i] = PRESENT;
      remaining[guess[i]]--;
    }
  }

  return result;
};

module.exports = { getSpotValues, CORRECT, PRESENT, NOT_IN_WORD };
