const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');

router.post('/create-booking', async (req,res) => {

    const { customerName, date, time, numberOfGuests, specialRequests } = req.body;
    const newBooking = new Booking(req.body);
    savedBooking = await newBooking.save();

    res.status(200).json({
        message: 'Booking created successfully',
        bookingId: savedBooking._id, // Include the generated booking ID
      });

})

module.exports = router;