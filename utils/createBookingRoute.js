const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');

router.post('/create-booking', async (req,res) => {

    const { customerName, date, time, numberOfGuests, specialRequests } = req.body;
    const existingBooking = await Booking.findOne({ customerName: customerName });

    if (existingBooking) { // server side validation, checks if existing booking is true
        return res.status(400).send("Each user may only create 1 booking at a time!");
    }

    const newBooking = new Booking(req.body);
    await newBooking.save();

    res.status(200).send('Booking data received');

})

module.exports = router;