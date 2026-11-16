const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    brandName: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    emailVerified:{
        type: Boolean,
        default: false
    },
    address:{
        type: String,
    },
    otpCode:{
        type: String,
        select : false
    },
    otpCodeExpiration:{
        type: Date,
        select : false
    },
    otpAttempts:{
        type: Number,
        default: 0,
        select : false
    },
    freeUsage:{
        type:Number,
        default:15,
        min:0
    }  
})
module.exports = mongoose.model('User', userSchema);
