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

    var newDish = Dishes({
        name: "uttapiza",
        description:"This is god dish"
    });

    newDish.save()
        .then((dish) => {
            console.log(dish);
            return Dishes.find({}).exec();
        })
        .then((dishes) => {
            console.log(dishes);
            return Dishes.deleteOne({});
        })
        .then(() => {
            mongoose.connection.close();
        })
        .catch((e) => {
            console.log(e.message);
        })
})