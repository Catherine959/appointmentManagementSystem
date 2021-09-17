const mongoose = require('mongoose');
const User = require('../models/user');
const BookingRequest = require('../models/bookingRequest');
const Service = require('../models/service');
let moment = require ('moment');
const { getMaxListeners } = require('../models/user');
module.exports = {

    //Customer can view their own voucher request list
    userGetBookingList: function(req,res){
        User.findOne({_id:req.params.id})
        .populate('bookingRequest')
        .exec(function(err,user){
            if(err) return res.status(400).json({ok:false,err:err});
            if(!user) return res.status(404).json({ok:false,err:"user not found"});
            res.json({ok:true,data:{bookingRequest:user.bookingRequest}});
        });
    },

    //Customer can add booking request 
    addBookingRequest: function(req,res){
        User.findOne({_id:req.params.id}).exec (function(err,user){
            newDate = new Date(req.body.date)
            var newbooking = new BookingRequest({
                user: user._id,
                date: newDate,
                serviceType: req.body.serviceType,
                optionalMessage:req.body.optionalMessage,
                deliveryOption: req.body.deliveryOption
            })
            user.bookingRequest.push(newbooking);
            newbooking.save(function(err){
                if(err) return res.status(400).json({ok:false, err: err});
                else{

                user.save(function(err){
                    if(err) return res.status(400).json(err);
                    else{

                        Service.findOne({_id:newbooking.serviceType}).exec(function(err,serviceinfo){
                            console.log(serviceinfo);
                            return res.json({ok: true,
                            data: newbooking,serviceinfo:serviceinfo})
                        })
                        
      
                    }
                })
              
            }
            })
        })
    },

        //Customer remove booking request 
    removeBookingRequest: async function(req,res){


        
        User.findOneAndUpdate({_id: req.params.id}, {$pull: {bookingRequest: req.params.bookingid}},  {
            new: true
            }).populate({path: 'bookingRequest', model: 'BookingRequest'}).exec(async (err, usr)=>{
                if(err) return res.status(400).json(err);
                else{
                    BookingRequest.findOne({_id:req.params.bookingid}).exec(function(err,bookinginfo){
                        console.log(bookinginfo)
                        Service.findOne({_id:bookinginfo.serviceType}).exec(function(err,serviceinfo){
                        console.log()
                    })
                    })
                    


                    await BookingRequest.findOneAndRemove({ _id: req.params.bookingid }, (err, booking)=>{
                             if(err) return res.status(400).json(err);
                    })
                    return res.json({ok: true,
                        data: usr})

                    }
        
                })

            
               
    },
    

    //admin view booking request 
    adminViewBookingRequest: function (req,res){
        BookingRequest.find({'confirmation':false}).populate('user').exec (function(err,bookingRequest){
            if(err) return res.status(400).json({ok:false,err:err});
            res.json({ok:true,data:{bookingRequest}});
        })
    },

    //adminAcceptBookingRequest and update the confirmation to be true

    adminAcceptBookingRequest: async function (req,res){
      await BookingRequest.findOneAndUpdate({_id: req.params.id,confirmation:false},{$set:{confirmation:true}},{new:true}).
      populate('user').
      exec(function(err,bookingRequest){
            if(bookingRequest==null) return res.status(500).json({ok:false,err:"bad request"})
            if(err) return res.status(400).json({ok:false,err:err});
            else{

                Service.findOne({_id:bookingRequest.serviceType}).exec(function(err,serviceinfo){
                            console.log(serviceinfo);
                            return res.json({ok: true,
                            data: bookingRequest,serviceinfo:serviceinfo})
                        })
        }
        })
    }
}

