const mongoose = require('mongoose');

const Campground = require('../models/campground')
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://127.0.0.1:27017/mokhaiam');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=>{
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63eeec4f7005fa11d2c048e9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [  
                        {
                        url: 'https://res.cloudinary.com/ddtxmco2i/image/upload/v1676754785/Almokhaiam/tswg9bamfbzxpcnbzhlq.jpg',
                        filename: 'Almokhaiam/tswg9bamfbzxpcnbzhlq'
                        },
                        {
                        url: 'https://res.cloudinary.com/ddtxmco2i/image/upload/v1676754785/Almokhaiam/xvxc2dcqwmncmcjcnudw.jpg',
                        filename: 'Almokhaiam/xvxc2dcqwmncmcjcnudw'
                        }
                    ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
});