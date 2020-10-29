const express = require("express");
const viewsController = require("../controllers/viewsController");
const router = express.Router();
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')


router.get("/", bookingController.createBookingCheckout, authController.isLoggedIn,  viewsController.getOverView);
router.get("/tour/:slug", authController.isLoggedIn,  viewsController.getTour);
router.get('/login' , authController.isLoggedIn, viewsController.getLoginForm)
router.get("/me", authController.protect ,  viewsController.getAccount);
router.get("/my-bookings", authController.protect ,  viewsController.getBookedTours);
module.exports = router;
