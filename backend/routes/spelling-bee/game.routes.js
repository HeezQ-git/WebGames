const express = require('express');
const {
  createGame,
  deleteGame,
  getGame,
  getAllGames,
  getAllGameWords,
  addPlayerToGame,
} = require('../../controllers/spelling-bee/game.controller');
const router = express.Router();

router.post('/create', createGame);
router.post('/add-player', addPlayerToGame);
router.delete('/:gameId', deleteGame);
router.get('/all', getAllGames);
router.get('/byId/:gameId', getGame);
router.get('/possible-words/:gameId', getAllGameWords);

module.exports = router;
