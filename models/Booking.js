const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    specialRequests: {
        type: String,
        default: ''
    }
});


const Booking = mongoose.model('Booking', bookingSchema, 'Restaurant Bookings');
module.exports = Booking;