const express = require ('express')
const router = express.Router({mergeParams: true})

const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const Review = require('../models/review');
const {isLoggedIn, validateReview, isReviewer} = require('../utils/middlewares')



router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review)
    review.reviewer = req.user._id
    camp.reviews.push(review)
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(async(req, res, next)=>{
    const {id, reviewId} = req.params
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${camp._id}`)
}))

module.exports = router;