const express = require ('express')
const router = express.Router()

const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../utils/middlewares')


router.get('/', catchAsync( async(req, res, next)=>{
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
}))

router.get('/new', isLoggedIn, (req, res)=>{
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next)=>{
    const newCamp = new Campground(req.body.campground)
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Camp succesfully created')
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

router.get('/edit/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp})
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) =>{
    const {id} = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true})
    req.flash('success', 'Camp succesfully updated')
    res.redirect(`/campgrounds/${id}`)
}))

router.get('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    .populate({ path: 'reviews',
                populate:{path: 'reviewer'}})
    .populate('author')
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/detail', {camp})
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted camp')
    res.redirect('/campgrounds')
}))

module.exports = router;