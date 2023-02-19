const User = require('../models/user');

const getRegisterForm = (req, res, next)=>{
    res.render('users/register')
}

const Register = async (req, res, next)=>{
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
}

const getLoginForm = (req, res, next)=>{
    res.render('users/login')
}

const Login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const Logout = (req, res, next) => {
    req.logout((err)=>{
        if (err) {
        return next(err);
        }
    req.flash('success', 'Logged out');
    res.redirect('/campgrounds');
    });
}

module.exports.getRegisterForm = getRegisterForm;
module.exports.getLoginForm = getLoginForm;
module.exports.Login = Login;
module.exports.Register = Register;
module.exports.Logout = Logout;