const express = require('express');
const {
  submitWord,
} = require('../../controllers/spelling-bee/word.controller');
const router = express.Router();

router.post('/submit', submitWord);

module.exports = router;
