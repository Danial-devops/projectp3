const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');

router.post('/create-booking', async (req,res) => {
    const newBooking = new Booking(req.body);
    await newBooking.save();


    res.status(200).send('Booking data received');

})

module.exports = router;