const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new schema({
    name:{
        type:String,
        require:true
    },
    image:{
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
    description:{
        type:String,
        require:true
    },
    featured: {
        type: Boolean,
        default: false

    } 
},{
    timestamps:true
})



const Promos = mongoose.model('Promos',promoSchema);
module.exports = Promos;