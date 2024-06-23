const express = require('express');
const {
  getOrCreateGame,
  createNewGame,
  updateStats,
  getStats,
} = require('../../controllers/wordle/game.controller');
const router = express.Router();

router.get('/', getOrCreateGame);
router.post('/', createNewGame);
router.patch('/stats', updateStats);
router.get('/stats', getStats);

module.exports = router;
