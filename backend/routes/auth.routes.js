const express = require('express');
const { signUp, signOut, signIn } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

module.exports = router;
