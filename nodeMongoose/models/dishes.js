const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        require:true
    },
    comment:{
        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

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
    comments:[commentSchema]
    
},{
    timestamps:true
})

const Dishes = mongoose.model('Dishes',dishesSchema);
module.exports = Dishes;