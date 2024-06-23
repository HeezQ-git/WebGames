const express = require('express');
const {
  submitWord,
  getWords,
  getProfaneWords,
} = require('../../controllers/wordle/word.controller');
const router = express.Router();

router.post('/submit', submitWord);
router.get('/list', getWords);
router.get('/list/profane', getProfaneWords);

module.exports = router;
