const express = require('express');
const {
  signIn,
  signUp,
  checkUsername,
} = require('../controllers/auth.controller');
const rateLimit = require('../lib/rateLimit');
const router = express.Router();

const authLimiter = rateLimit({ windowMs: 10 * 60 * 1000 });
const lookupLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 1000 });

router.post('/signup', authLimiter, signUp);
router.post('/signin', authLimiter, signIn);
router.post('/check-username', lookupLimiter, checkUsername);

module.exports = router;
