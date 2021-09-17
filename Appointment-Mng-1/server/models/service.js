//user's biller information schema 
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
   name: {
       type:String, 
       required:true
   },
   deliveryOptions:[{
    type: String,
    default: 'pickup',
    enum: ["pickup", "delivery"]
}]
})


module.exports = mongoose.model('Service', ServiceSchema);