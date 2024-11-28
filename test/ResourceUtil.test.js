const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const Booking = require('../models/Booking.js'); // Ensure correct path
const { app, server } = require('../index');

chai.use(chaiHttp);

let baseUrl;
let createdBookingId;

describe('Booking API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    
        // Create a sample booking for testing
        const booking = new Booking({
            customerName: 'John Doe', // Required field
            date: new Date('2024-12-01'), // Required field
            time: '19:00', // Required field
            numberOfGuests: 4, // Required field
            specialRequests: 'Window seat, if possible', // Optional field
        });
        const savedBooking = await booking.save();
        createdBookingId = savedBooking._id.toString();
    });
    

    after(async () => {
        // Delete only the test-created booking
        await Booking.findByIdAndDelete(createdBookingId);
    
        // Close the server after tests
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });
    
    describe('PUT /edit-booking/:id', () => {
        it('should update an existing booking', (done) => {
            chai.request(baseUrl)
                .put(`/edit-booking/${createdBookingId}`)
                .send({
                    customerName: 'Jane Doe', // Updated customer name
                    date: new Date('2024-12-02'), // Updated date
                    time: '20:00', // Updated time
                    numberOfGuests: 2, // Updated number of guests
                    specialRequests: 'Near the entrance', // Updated special request
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal('Booking updated successfully');
                    expect(res.body.updatedBooking).to.have.property('customerName', 'Jane Doe');
                    expect(res.body.updatedBooking).to.have.property('date');
                    expect(new Date(res.body.updatedBooking.date).toISOString()).to.equal(new Date('2024-12-02').toISOString());
                    expect(res.body.updatedBooking).to.have.property('time', '20:00');
                    expect(res.body.updatedBooking).to.have.property('numberOfGuests', 2);
                    expect(res.body.updatedBooking).to.have.property('specialRequests', 'Near the entrance');
                    done();
                });
        });
        

        it('should return 404 if booking does not exist', (done) => {
            chai.request(baseUrl)
                .put('/edit-booking/000000000000000000000000') // Invalid ID
                .send({
                    name: 'Non-existent Booking',
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal('Booking not found');
                    done();
                });
        });

        it('should return 500 for invalid ID format', (done) => {
            chai.request(baseUrl)
                .put('/edit-booking/invalid-id') // Malformed ID
                .send({
                    name: 'Invalid ID Booking',
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.equal('Error updating booking');
                    done();
                });
        });
    });
});
