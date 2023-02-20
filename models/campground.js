const mongoose = require('mongoose');
const { campgroundSchema } = require('../utils/joiSchemas');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
            url: String,
            filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    } ,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
})

CampgroundSchema.set('toJSON', { virtuals: true })

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 25)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async function(document) {
    if (document) {
        await Review.deleteMany({
            _id : { $in : document.reviews }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
