const MIN_WORD_LENGTH = 4;

function generateLettersRegexPattern(letters, centerLetter) {
  const lettersPattern = Array.from(new Set(letters))
    .join('')
    .replace(/[^a-zA-Z]/g, '');
  const center = String(centerLetter).replace(/[^a-zA-Z]/g, '');

  if (!lettersPattern || !center) {
    throw new Error('Invalid letters for pattern generation');
  }

  return new RegExp(
    `^(?=.{${MIN_WORD_LENGTH},}$)[${lettersPattern}]*${center}[${lettersPattern}]*$`,
    'i'
  );
}

module.exports = generateLettersRegexPattern;
module.exports.MIN_WORD_LENGTH = MIN_WORD_LENGTH;
