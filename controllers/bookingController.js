const Tour = require("../models/tourModels");
const Booking = require('../models/bookingModel')
const catchAsync = require("./../utils/catchAsync");
const factoryHandler = require('../controllers/factoryHandler')
const Stripe = require('stripe')
 


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const stripe = Stripe(process.env.STRIPE_KEY)
    const tour = await Tour.findById(req.params.tourId)

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    })

    res.status(200).json({
        status: 'success',
        session
    })
})

exports.createBookingCheckout = catchAsync(async(req, res, next) => {
    const { tour, price, user } = req.query
    if(!tour && !price && !user) return next()

    await Booking.create({ tour, price, user })
    
    res.redirect(req.originalUrl.split('?')[0])
})

exports.getAllBookings = factoryHandler.getAll(Booking)
exports.getBooking = factoryHandler.getOne(Booking)
exports.updateBooking = factoryHandler.updateOne(Booking)
exports.deleteBooking = factoryHandler.deleteOne(Booking)