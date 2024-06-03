const express = require('express');
const {
  changeUsername,
  changePassword,
} = require('../controllers/player.controller');
const router = express.Router();

router.post('/change-username', changeUsername);
router.post('/change-password', changePassword);

module.exports = router;
