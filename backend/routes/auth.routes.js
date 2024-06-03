const express = require('express');
const {
  signOut,
  signIn,
  signUp,
  checkUsername,
} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/check-username', checkUsername);

module.exports = router;
