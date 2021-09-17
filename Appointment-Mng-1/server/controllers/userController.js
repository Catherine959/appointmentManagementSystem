const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles')
const Biller = require('../models/biller');
const mongoose = require('mongoose');


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
   }
   
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


exports.signup = async (req, res, next) => {
    try {
     const { email, password, role, name, phoneNumber} = req.body
     const hashedPassword = await hashPassword(password);
     const newUser = new User({ email: email, password: hashedPassword, name:name,phoneNumber:phoneNumber,role: role || "basic" });
     const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
     });
     newUser.accessToken = accessToken;
     await newUser.save();
     res.json({
        ok: true,
      data: newUser,
      accessToken
     })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: "fail to create",
          })
    }
}

exports.getUsers = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
     data: users
    });
}

exports.getUser = async (req, res, next) => {
    try {
     const userId = req.params.userId;
     const user = await User.findById(userId);
     if (!user) return next(new Error('User does not exist'));
      res.status(200).json({
      data: user
     });
    } catch (error) {
     next(error)
    }
}
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
        ok: true,
        data: { email: user.email, role: user.role , name: user.name, id: user._id},
        accessToken
        })
    } catch (error) {
     next(error);
    }
}

exports.grantAccess = function(action, resource) {
    return async (req, res, next) => {
     try {
         console.log(req.user)
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: "You don't have enough permission to perform this action"
       });
      }
      next()
     } catch (error) {
      next(error)
     }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
     const user = res.locals.loggedInUser;
     if (!user)
      return res.status(401).json({
       error: "You need to be logged in to access this route"
      });
      req.user = user;
      next();
     } catch (error) {
      next(error);
     }
}


exports.viewDetailInfo = (req,res)=>{
    User.findOne({_id:req.params.id}).populate('biller').exec((err,user)=>{
        if(err) return res.status(400).json({
            ok:false,
            error: err
        });
        if(!user) return res.status(404).json({
            ok:false,
            error: "no user find"
        });
        res.json({
            ok: true,
            data: { email: user.email,
                    role: user.role , 
                    name: user.name, 
                    id: user._id,
                    phoneNumber:user.phoneNumber,
                    biller: {
                        name: user.biller.name, 
                        email:user.biller.email }

                }
        })
    })
}


exports.updatePersonalInfo = (req,res)=>{

    User.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, user) {
        if (err) return res.status(400).json({
            ok:false,
            error: err
        });
        if (!user) return res.status(404).json({
            ok:false,
            error: "no user find"
        });
        res.json({
            ok: true,
            data: { email: req.body.email || user.email,
                role: user.role , 
                name: req.body.name ||user.name, 
                id: user._id,
                phoneNumber:req.body.phoneNumber ||user.phoneNumber
            }
        });
    
    })
}

exports.updateBillerInfo = async (req,res)=>{

    

    const userID = mongoose.Types.ObjectId(req.params.id)
    
    Biller.findOneAndUpdate({ belongsTo:userID }, req.body , function (err, biller) {
        if (err) return res.status(400).json({
            ok:false,
            error: err
        });

        if(!biller){
            req.body.belongsTo = userID; 
            Biller.create(req.body, function (err, biller) {
                if (err) return res.status(400).json({
                    ok:false,
                    error: err
                });

                User.findOneAndUpdate({ _id: req.params.id }, {biller: biller._id}, function (err, user) {
                    if (err) return res.status(400).json({
                        ok:false,
                        error: err
                    });
                    if (!user) return res.status(404).json({
                        ok:false,
                        error: "no user find"
                    });
        
                    res.status(200).json({
                        ok: true,
                        data: {
                            name: req.body.name,
                            email: req.body.email    
        
                        }
                    });
                
                });
                
            });
        
        }

        else{
            res.status(200).json({
                ok: true,
                data: {
                    name: req.body.name || biller.name,
                    email: req.body.email || biller.email    
    
                }
            });


        };

      

})

    
}


