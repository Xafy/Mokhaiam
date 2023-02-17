const express = require ('express')
const router = express.Router()
const campgroundController = require('../controllers/campgrounds')
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require('../utils/middlewares')


router.get('/', catchAsync(campgroundController.index))

router.get('/new', isLoggedIn, campgroundController.addCampgroundForm )

router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundController.addCampground))

router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampgroundForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.updateCampground))

router.get('/:id', catchAsync(campgroundController.showCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

module.exports = router;