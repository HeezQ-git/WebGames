const express = require('express');
const {
  changeUsername,
  changePassword,
  updatePlayer,
  deletePlayerAccount,
  deletePlayerProgress,
} = require('../controllers/player.controller');
const router = express.Router();

router.patch('/change-username', changeUsername);
router.patch('/change-password', changePassword);
router.patch('/update', updatePlayer);
router.delete('/account', deletePlayerAccount);
router.delete('/progress', deletePlayerProgress);

module.exports = router;
