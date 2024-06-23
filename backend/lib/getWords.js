const fs = require('fs');
const path = require('path');

const getWordsFromJSON = () => {
  try {
    const words = fs.readFileSync(
      path.join(__dirname, 'no_profane.json'),
      'utf-8'
    );

    return JSON.parse(words);
  } catch (error) {
    console.error(`Error in word.controller getWords:`, error.message);
    return { message: 'Internal Server Error' };
  }
};

const getProfaneWordsFromJSON = () => {
  try {
    const words = fs.readFileSync(
      path.join(__dirname, 'profane.json'),
      'utf-8'
    );

    return JSON.parse(words);
  } catch (error) {
    console.error(`Error in word.controller getProfaneWords:`, error.message);
    return { message: 'Internal Server Error' };
  }
};

module.exports = {
  getWordsFromJSON,
  getProfaneWordsFromJSON,
};
