const getWordScore = (word, letters) => {
  // 4-letter word = 1pt
  if (word.length === 4) return { wordScore: 1, isPangram: false };

  // other words = 1pt per letter
  let wordScore = word.length;

  // pangram = length + 7pts
  const wordSet = new Set(word);
  const lettersSet = new Set(letters);

  const isPangram = wordSet.size === lettersSet.size;

  if (isPangram) wordScore += 7;

  return { wordScore, isPangram };
};

module.exports = getWordScore;
