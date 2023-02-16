const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./utils/joiSchemas')
// const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const mongoose = require('mongoose');

const campgroundRoutes = require('./routes/campgrounds')

const Campground = require('./models/campground');
const Review = require('./models/review');
const { findByIdAndUpdate, findByIdAndDelete } = require('./models/campground');

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

app.use(express.urlencoded( {extended: true}))
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req,res)=>{
    res.render('home')
})

app.use('/campgrounds', campgroundRoutes )
// app.get('/campgrounds', catchAsync(async(req,res)=>{
//     const camps = await Campground.find({})
//     res.render('campgrounds/index', {camps})
// }))

// app.get('/campgrounds/new', (req, res)=>{
//     res.render('campgrounds/new')
// })

// app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next)=>{
//     const newCamp = new Campground(req.body.campground)
//     await newCamp.save();
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// app.get('/campgrounds/edit/:id', catchAsync(async (req, res)=>{
//     const {id} = req.params
//     const camp = await Campground.findById(id)
//     res.render('campgrounds/edit', {camp})
// }))

// app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) =>{
//     const {id} = req.params
//     const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true})
//     console.log(camp)
//     res.redirect(`/campgrounds/${id}`)
// }))

// app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
//     const {id} = req.params
//     const camp = await Campground.findById(id).populate('reviews')
//     res.render('campgrounds/detail', {camp})
// }))

// app.delete('/campgrounds/:id', catchAsync(async(req, res)=>{
//     const {id} = req.params;
//     await Campground.findByIdAndDelete(id)
//     res.redirect('/campgrounds')
// }))

// app.post('/campgrounds/:id/reviews/', validateReview, catchAsync(async(req, res, next)=>{
//     const {id} = req.params;
//     const camp = await Campground.findById(id);
//     const review = new Review(req.body.review)
//     camp.reviews.push(review)
//     review.save();
//     camp.save();
//     res.redirect(`/campgrounds/${camp._id}`)
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res, next)=>{
//     const {id, reviewId} = req.params
//     const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${camp._id}`)
// }))

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