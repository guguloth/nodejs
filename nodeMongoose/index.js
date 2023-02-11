const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
    
}
mongoose.set('strictQuery', false);
const url = "mongodb://localhost:27017/confusion";

const connect = mongoose.connect(url,options);

connect.then(() => {
    console.log(`connected to server`);

    Dishes.create({
        name: "uttapizza",
        description:"This is god dish"
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.findByIdAndUpdate(
            dish._id,
            {$set:{description:" udpated one is here"}},
            {new:true}
        ).exec();
    })
    .then((dish) => {
        console.log(dish);
        dish.comments.push({
            rating:5,
            comment:"I\'m getting a sinking feeling",
            author:'gopal'
        });
        return dish.save();
    })
    .then((dish) => {
        console.log(dish);
        return Dishes.deleteOne();
    })
    .then(() => {
        mongoose.connection.close();
    })
    .catch((e) => {
        console.log(e.message);
    })
})