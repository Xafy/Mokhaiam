const express = require ('express')
const router = express.Router()

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Campground = require('../models/campground');
const {campgroundSchema} = require('../utils/joiSchemas')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req,res)=>{
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
}))

router.get('/new', (req, res)=>{
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async(req, res, next)=>{
    const newCamp = new Campground(req.body.campground)
    await newCamp.save();
    req.flash('success', 'Camp succesfully created')
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

router.get('/edit/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp})
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) =>{
    const {id} = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true})
    req.flash('success', 'Camp succesfully updated')
    res.redirect(`/campgrounds/${id}`)
}))

router.get('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id).populate('reviews')
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/detail', {camp})
}))

router.delete('/:id', catchAsync(async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted camp')
    res.redirect('/campgrounds')
}))

module.exports = router;