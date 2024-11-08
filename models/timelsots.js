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
module.exports = Timeslot;