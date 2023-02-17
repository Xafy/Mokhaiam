const express = require ('express')
const router = express.Router({mergeParams: true})
const reviewController = require('../controllers/reviews')
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateReview, isReviewer} = require('../utils/middlewares')



router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(reviewController.deleteReview))

module.exports = router;