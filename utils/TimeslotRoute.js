const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.js');
const { populateTimeslotsForMonths } = require('../models/poptimeslot.js');
const { getAllAvailableTimeslots } = require('../models/timeslot.js');

router.get('/populate-timeslots', async (req, res) => {
    try {
        await populateTimeslotsForMonths(2024, 11, 2024, 12);
        res.status(200).json({ message: 'Timeslots populated for specified months!' });
    } catch (error) {
        res.status(500).json({ message: 'Error populating timeslots', error: error.message });
    }
});

router.get('/available', async (req, res) => {
    try {
        // Get the available timeslots by calling the function
        const availableTimeslots = await getAllAvailableTimeslots();

        // Return the available timeslots in the response
        res.status(200).json({
            success: true,
            availableTimeslots
        });
    } catch (error) {
        // Handle errors and return a failure response
        console.error('Error fetching available timeslots:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available timeslots'
        });
    }
});

module.exports = router;