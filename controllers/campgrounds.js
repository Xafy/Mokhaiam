const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");



const index = async(req, res, next)=>{
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
}

const addCampgroundForm = (req, res)=>{
    res.render('campgrounds/new')
}

const addCampground = async(req, res, next)=>{
    const images = req.files.map(( f => ({url: f.path, filename: f.filename})))
    console.log(images)
    const newCamp = new Campground(req.body.campground)
    newCamp.images = images
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Camp succesfully created')
    res.redirect(`/campgrounds/${newCamp._id}`)
}

const editCampgroundForm = async (req, res, next)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp})
}

const updateCampground = async (req, res) =>{
    const {id} = req.params
    const images = req.files.map( el => ({url: el.path, filename: el.filename}))
    console.log(images)
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true})
    camp.images.push(...images);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: {images : {filename: {$in: req.body.deleteImages}}}})
    }
    await camp.save()
    req.flash('success', 'Camp succesfully updated')
    res.redirect(`/campgrounds/${id}`)
}

const showCampground = async (req,res)=>{
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
}

const deleteCampground = async(req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted camp')
    res.redirect('/campgrounds')
}

module.exports.index = index;
module.exports.addCampgroundForm = addCampgroundForm;
module.exports.addCampground = addCampground;
module.exports.editCampgroundForm = editCampgroundForm;
module.exports.updateCampground = updateCampground;
module.exports.showCampground = showCampground;
module.exports.deleteCampground = deleteCampground;