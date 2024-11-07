const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');

router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error });
    }
});

router.post('/create-booking', async (req,res) => {
    const newBooking = new Booking(req.body);
    await newBooking.save();


    res.status(200).send('Booking data received');

})

module.exports = router;