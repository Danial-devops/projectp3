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

module.exports = router;