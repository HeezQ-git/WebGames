export const getSpotValues =
  (guess: string, wordToGuess: string) => {
    const result = new Array(guess.length).fill('NOT_IN_WORD');
    const letterCount: { [key: string]: number } = {};

    for (const letter of wordToGuess) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === wordToGuess[i]) {
        result[i] = 'CORRECT';
        letterCount[guess[i]]--;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (result[i] !== 'CORRECT' && letterCount[guess[i]]) {
        result[i] = 'PRESENT';
        letterCount[guess[i]]--;
      }
    }

    return result;
  };