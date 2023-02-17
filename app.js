const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

const User = require('./models/user')

const ExpressError = require("./utils/ExpressError")

const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/mokhaiam');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=>{
    console.log("Database connected")
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded( {extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({'secret': 'thisisasecret',
                resave: false,
                saveUninitialized: true,
                cookie: {
                    httpOnly: true,
                    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //that means a week
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }
                }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.get('/', (req,res)=>{res.render('home')})

app.use('/users', userRoutes)
app.use('/campgrounds', campgroundRoutes )
app.use('/campgrounds/:id/reviews/', reviewsRoutes )

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, ()=>{
    console.log(`server is running on http://localhost:3000/ `)
})