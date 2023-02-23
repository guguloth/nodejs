const mongoose =require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

const Userschema = new schema({
    firstname: {
        type: String,
        default:''
    },
    lastname: {
        type: String,
        default:''
    },
    admin: {
        type: Boolean,
        default:false
    }
},{
    timestamps:true
})
Userschema.plugin(passportLocalMongoose);
const User= mongoose.model('User',Userschema);
module.exports = User;