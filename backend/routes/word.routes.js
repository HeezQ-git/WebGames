const express = require('express');
const { checkWord } = require('../controllers/word.controller');
const router = express.Router();

router.post('/check', checkWord);

module.exports = router;
