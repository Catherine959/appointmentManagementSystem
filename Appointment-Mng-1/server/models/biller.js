//user's biller information schema 
const mongoose = require('mongoose');

const BillerSchema = new mongoose.Schema({
   belongsTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
   },
   name: {
       type:String, 
       required:true
   },
   email: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Biller', BillerSchema);