const express = require ('express')
const router = express.Router({mergeParams: true})

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../utils/joiSchemas')
const {isLoggedIn} = require('../utils/middlewares')

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review)
    camp.reviews.push(review)
    review.save();
    camp.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req, res, next)=>{
    const {id, reviewId} = req.params
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted interview')
    res.redirect(`/campgrounds/${camp._id}`)
}))

module.exports = router;