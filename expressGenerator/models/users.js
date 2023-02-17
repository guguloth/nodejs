const mongoose =require('mongoose');
const schema = mongoose.Schema;

const Userschema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    admin: {
        type: Boolean,
        default:false
    }
},{
    timestamps:true
})

const User= mongoose.model('User',Userschema);
module.exports = User;