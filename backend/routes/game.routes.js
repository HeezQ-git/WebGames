const express = require('express');
const {
  createGame,
  deleteGame,
  getAllGames,
  getAllGameWords,
} = require('../controllers/game.controller');
const router = express.Router();

router.post('/create', createGame);
router.delete('/:gameId', deleteGame);
router.get('/all', getAllGames);
router.get('/possible-words/:gameId', getAllGameWords);

module.exports = router;
