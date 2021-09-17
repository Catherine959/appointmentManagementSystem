const Service = require('../models/service');

module.exports={

    //fetch all the available services 
    getServices: function (req,res){
        Service.find({},function(err,results){
            if(err) return res.status(400).json({ok:false,err:err});
            res.json({ok:true,data:results});
        })
    },

    //add services: 
    addService: function (req,res){
        let newServiceDetails = req.body
        Service.create(newServiceDetails, function (err, service) {
            if (err) return res.status(400).json({ok:false,err:err});

            res.json({ok:true,data:service});
        });
    },

    //get service delivery options 
    getServicesDeliveryOptions: function (req,res){
        Service.find({_id:req.params.id},function (err,service){
            if (err) return res.status(400).json({ok:false,err:err});
           result=service[0]["deliveryOptions"]
           res.send({ok:true,data:result})
        })
    },

    //get one Service 
    getOneService: function (req,res){
        Service.find({_id:req.params.id},function(err,service){
            if(err) return res.status(400).json({ok:false,err:err});
            res.json({ok:true,data:service});
        })
    },
}