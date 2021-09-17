let express = require('express');
const bookingController = require('./controllers/bookingController');
const serviceController = require('./controllers/serviceController');
let router = express.Router();

const userController = require('./controllers/userController');
const bookingRequest = require('./models/bookingRequest');



router.get('/api/test',(req,res) =>{
    res.send('ok')
})

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'booking'), userController.getUsers);

//booking request routers 
router.post('/user/:id/booking',userController.allowIfLoggedin,bookingController.addBookingRequest)

//user can see their own booking request 
router.get('/user/:id/allBooking',userController.allowIfLoggedin, bookingController.userGetBookingList)

//view detail information(personal & biller )
router.get('/user/:id/detailInfo',userController.allowIfLoggedin, userController.viewDetailInfo)

router.post('/user/:id/updatePersonalInfo',userController.allowIfLoggedin, userController.updatePersonalInfo)

router.post('/user/:id/updateBillerInfo',userController.allowIfLoggedin, userController.updateBillerInfo)




//admin add services 
router.post('/admin/addservice', userController.allowIfLoggedin, userController.grantAccess('createAny', 'service'), serviceController.addService)

//admin view booking request 
router.get('/admin/viewBookingRequest',userController.allowIfLoggedin, userController.grantAccess('readAny', 'booking'), bookingController.adminViewBookingRequest)

//admin accept booking request 
router.post('/admin/acceptBooking/:id',userController.allowIfLoggedin,userController.grantAccess('updateAny', 'booking'), bookingController.adminAcceptBookingRequest)

//get all services 
router.get('/allServices',userController.allowIfLoggedin,serviceController.getServices)

//get one service 
router.get('/oneService/:id',userController.allowIfLoggedin,serviceController.getOneService);
//get service delivery options (return an array of delivery options (delivery/pickup))
router.get('/getServiceDeliveryOptions/:id',userController.allowIfLoggedin,serviceController.getServicesDeliveryOptions)

//customer cancel booking request 
router.post('/removeRequest/:id/:bookingid',userController.allowIfLoggedin,bookingController.removeBookingRequest)
module.exports = router;