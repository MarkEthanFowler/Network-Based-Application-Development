const express = require('express');
const controller = require('../controllers/userController');
const { isGuest, isLoggedIn } = require('../middleware/authentication');
const { LogInLimiter } = require('../middleware/rateLimiters');
const { validateSignup, validateLogin, validateRequest } = require('../middleware/validator');
const router = express.Router();

router.get('/new', isGuest, controller.new);

router.post('/', isGuest, validateSignup, validateRequest, controller.create);

router.get('/login', isGuest, controller.login);

router.post('/login', LogInLimiter, isGuest, validateLogin, validateRequest, controller.process);

router.get('/profile', isLoggedIn, controller.index);

router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;