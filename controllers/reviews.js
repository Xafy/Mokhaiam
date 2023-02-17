const Campground = require('../models/campground');
const Review = require('../models/review');

const addReview = async(req, res, next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review)
    review.reviewer = req.user._id
    camp.reviews.push(review)
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${camp._id}`)
}

const deleteReview = async(req, res, next)=>{
    const {id, reviewId} = req.params
    const camp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.addReview = addReview
module.exports.deleteReview = deleteReview