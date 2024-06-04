const express = require('express');
const {
  signIn,
  signUp,
  checkUsername,
} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/check-username', checkUsername);

module.exports = router;
