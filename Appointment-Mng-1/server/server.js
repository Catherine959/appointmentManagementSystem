const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('./models/user')
let router = require('./router.js');
let bodyParser = require('body-parser')
let db = require('./db'); // databse
require('dotenv').config() // add env variables 
db.connect(() => app.listen(9000)); // connect to database 
// app.use(express.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());


app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
     const accessToken = req.headers["x-access-token"];
     const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
     // Check if token has expired
     if (exp < Date.now().valueOf() / 1000) { 
      return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
     } 
     res.locals.loggedInUser = await User.findById(userId); next(); 
    } else { 
     next(); 
    } 
   });

app.use('/', router);

//connect to frontend 
app.use("/", express.static(path.join(__dirname, "../dist/mngApp")));



