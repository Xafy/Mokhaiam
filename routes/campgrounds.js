const express = require ('express')
const router = express.Router()
const campgroundController = require('../controllers/campgrounds')
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require('../utils/middlewares')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(campgroundController.index))

router.get('/new', isLoggedIn, campgroundController.addCampgroundForm )

router.post('/', isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgroundController.addCampground))

router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampgroundForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgroundController.updateCampground))

router.get('/:id', catchAsync(campgroundController.showCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

module.exports = router;