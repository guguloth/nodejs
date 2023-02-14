const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leadersSchema = new schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    designation:{
        type:String,
        require:true
    },
    abbr:{
        type:String,
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



const Leaders = mongoose.model('Leaders',leadersSchema);
module.exports = Leaders;