const mongoose = require('mongoose');
let mongoDbUrl = 'mongodb://127.0.0.1:27017/mng';
const Service = require('./models/service');
function connect(callback){
    mongoose.connect(mongoDbUrl,  {useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex: true},(err) => {
        if (err) throw err
    console.log("...connect to mongodb successfully...")
    callback();
});
}

module.exports = {
    connect
};