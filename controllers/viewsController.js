const Tour = require("../models/tourModels");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/AppError')
exports.getOverView = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(202).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user ",
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name' , 404))
  }
  res.status(202).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getBookedTours = catchAsync(async (req, res, next) => {
  //1) find all bookings realted to a specific user
  const bookings  = await Booking.find({user:req.user.id})
  //2) get all booked tours ids 
  const tourIds = bookings.map(el => el.tour)
  const tours = await Tour.find({_id:{$in: tourIds}})

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours
  })
})

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log In'
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Account Settings'
  })
}