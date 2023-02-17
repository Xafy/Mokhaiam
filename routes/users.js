const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');


router.get('/register', (req, res, next)=>{
    res.render('users/register')
})

router.post('/register',catchAsync(async (req, res, next)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to AlMokhaiam');
            res.redirect('/campgrounds');
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/users/register');
    }
}))

router.get('/login', (req, res, next)=>{
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
    req.flash('success', 'welcome back!');
    console.log(req.session.returnTo)
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout((err)=>{
        if (err) {
        return next(err);
        }
    req.flash('success', 'Logged out');
    res.redirect('/campgrounds');
    });
});

module.exports = router