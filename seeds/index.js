const mongoose = require('mongoose');

const Campground = require('../models/campground')
const cities = require('./egypt_cities');
const {places, descriptors} = require('./seedHelpers')

mongoose.set('strictQuery',false);
mongoose.connect('mongodb+srv://MokhaiamAdmin:IlSEVHknbKWnsxLk@almokhaiamdb.u9hml5d.mongodb.net/almokhaiam?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=>{
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++){
        // const random1000 = Math.floor(Math.random() * 1000);
        const random70 = Math.floor(Math.random() * 70);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63f2f35ef41017b09fd4cd86',
            location: `${cities[random70].city}, ${cities[random70].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/ddtxmco2i/image/upload/v1676833008/Almokhaiam/kxmnltum9snb7g49glpb.jpg',
                    filename: 'Almokhaiam/kxmnltum9snb7g49glpb',
                },
                {
                    url: 'https://res.cloudinary.com/ddtxmco2i/image/upload/v1676833008/Almokhaiam/njmx7aycovxxuelmlw8u.jpg',
                    filename: 'Almokhaiam/njmx7aycovxxuelmlw8u',
                },
                {
                    url: 'https://res.cloudinary.com/ddtxmco2i/image/upload/v1676833008/Almokhaiam/nvtcmsjcxqdvuv7jai67.jpg',
                    filename: 'Almokhaiam/nvtcmsjcxqdvuv7jai67',
                }
                ],
            geometry: { type: 'Point', coordinates: [
                        cities[random70].longitude,
                        cities[random70].latitude
                    ] },
            description: 'This is a random description for the camp created by random seeds to the database',
            price
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
});