const express = require('express');
const {
  getOrCreateGame,
  createNewGame,
  getStats,
} = require('../../controllers/wordle/game.controller');
const router = express.Router();

router.get('/', getOrCreateGame);
router.post('/', createNewGame);
router.get('/stats', getStats);

module.exports = router;
