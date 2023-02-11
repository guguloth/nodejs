const mongoose = require('mongoose');
const schema = mongoose.Schema;

const dishesSchema = new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    
},{
    timestamps:true
})

const Dishes = mongoose.model('Dishes',dishesSchema);
module.exports = Dishes;