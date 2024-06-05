const express = require('express');
const { submitWord } = require('../controllers/word.controller');
const router = express.Router();

router.post('/submit', submitWord);

module.exports = router;
