const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;



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
    image:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    lable:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        require:true
    },
    featured:{
        type:Boolean,
        require:false
    },
    
},{
    timestamps:true
})

const Dishes = mongoose.model('Dishes',dishesSchema);
module.exports = Dishes;