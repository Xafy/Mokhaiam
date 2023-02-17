const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const usersController = require('../controllers/users')
const passport = require('passport');


router.route('/register')
    .get(usersController.getRegisterForm)
    .post(catchAsync(usersController.Register))

router.get('/login', usersController.getLoginForm )

router.post('/login'
, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true})
, usersController.Login)

router.get('/logout', usersController.Logout);

module.exports = router