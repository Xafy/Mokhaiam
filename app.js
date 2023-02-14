const express = require('express');
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');

const Campground = require('./models/campground');
const { findByIdAndUpdate } = require('./models/campground');

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/mokhaiam');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=>{
    console.log("Database connected")
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded( {extended: true}))
app.use(methodOverride('_method'))

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/campgrounds', async (req,res)=>{
    const camps = await Campground.find({})
    res.render('campgrounds/index', {camps})
})

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res)=>{
    const {title, location} = req.body.campground
    const newCamp = new Campground({title, location})
    newCamp.save();
    res.redirect('/campgrounds')
})

app.get('/campgrounds/edit/:id', async (req, res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', {camp})
})

app.put('/campgrounds/:id', async (req, res) =>{
    const {id} = req.params
    const {title, location} = req.body.campground
    const camp = await Campground.findByIdAndUpdate(id, {title, location}, {new: true})
    console.log(camp)
    res.redirect(`/campgrounds/${id}`)
})

app.get('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/detail', {camp})
})

app.delete('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})


app.listen(3000, ()=>{
    console.log(`server is running on http://localhost:3000/ `)
})