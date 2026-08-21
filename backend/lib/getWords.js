const fs = require('fs');
const path = require('path');

const cache = new Map();

const readList = (file) => {
  if (!cache.has(file)) {
    const contents = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    cache.set(file, Object.freeze(JSON.parse(contents)));
  }

  return cache.get(file);
};

const getWordsFromJSON = () => readList('no_profane.json');
const getProfaneWordsFromJSON = () => readList('profane.json');

let allowedWords = null;

const isAllowedWord = (word) => {
  if (!allowedWords) {
    allowedWords = new Set([
      ...getWordsFromJSON(),
      ...getProfaneWordsFromJSON(),
    ]);
  }

  return allowedWords.has(word);
};

module.exports = { getWordsFromJSON, getProfaneWordsFromJSON, isAllowedWord };
