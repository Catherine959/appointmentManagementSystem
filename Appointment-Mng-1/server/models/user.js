// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
     
//     },
//     role: {
//         type: String,
//         default: 'basic',
//         enum: ["basic", "admin"]
//     },  
//     password: {
//         type: String,
//         required: true
//     },
//     accessToken: String
// })


// module.exports = mongoose.model('User', UserSchema);



const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required:true
    },
    phoneNumber:{
        type:String, 
        required: true
    },
    role: {
        type: String,
        default: 'basic',
        enum: ["basic", "admin"]
    },  
    password: {
        type: String,
        required: true
    },
    biller: {
        type: mongoose.Schema.ObjectId,
        ref: 'Biller'
    },
    bookingRequest: [{
        type:mongoose.Schema.ObjectId,
        ref:"BookingRequest"
    }],
    accessToken: String
})


module.exports = mongoose.model('User', UserSchema);