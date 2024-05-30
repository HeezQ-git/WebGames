function generateLettersRegexPattern(letters, centerLetter) {
  const lettersSet = new Set(letters);
  const lettersPattern = Array.from(lettersSet).join('');

  const pattern = new RegExp(
    `^[${lettersPattern}]*${centerLetter}[${lettersPattern}]*$`,
    'i'
  );
  return pattern;
}

module.exports = generateLettersRegexPattern;
