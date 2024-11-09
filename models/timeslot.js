const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true 
    }
});

const Timeslot = mongoose.model('Timeslot', timeslotSchema, 'Restaurant Timeslots');

// Function to get all available timeslots
const getAllAvailableTimeslots = async () => {
    try {
        const timeslots = await Timeslot.find({ available: true });
        return timeslots;
    } catch (error) {
        throw new Error('Error fetching available timeslots: ' + error.message);
    }
};

module.exports = { Timeslot, getAllAvailableTimeslots };