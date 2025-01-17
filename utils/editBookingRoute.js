const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');

// Update an existing booking by ID
router.put('/edit-booking/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error });
    }
});

module.exports = router;
