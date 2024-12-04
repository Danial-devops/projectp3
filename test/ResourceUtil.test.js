const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const Booking = require('../models/Booking.js');
const { app, server } = require('../index');

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let baseUrl;
let createdBookingId;

describe('Booking API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;

        // Create a sample booking for testing
        const booking = new Booking({
            customerName: 'John Doe',
            date: new Date('2024-12-01'),
            time: '19:00',
            numberOfGuests: 4,
            specialRequests: 'Window seat, if possible',
        });
        const savedBooking = await booking.save();
        createdBookingId = savedBooking._id.toString();
    });

    after(async () => {
        // Delete test-created bookings
        await Booking.findByIdAndDelete(createdBookingId);
    
        // Close Mongoose connection
        await mongoose.connection.close();
    
        // Close the HTTP server
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
                    customerName: 'Jane Doe',
                    date: new Date('2024-12-02'),
                    time: '20:00',
                    numberOfGuests: 2,
                    specialRequests: 'Near the entrance',
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

    describe('Booking Model Validation', () => {
        it('should require all required fields', async () => {
            const booking = new Booking({});
            await expect(booking.save()).to.be.rejectedWith(/customerName.*required/i);
            await expect(booking.save()).to.be.rejectedWith(/date.*required/i);
            await expect(booking.save()).to.be.rejectedWith(/time.*required/i);
            await expect(booking.save()).to.be.rejectedWith(/numberOfGuests.*required/i);
        });

        it('should require `date` to be a valid date', async () => {
            const booking = new Booking({
                customerName: 'John Doe',
                date: 'invalid-date', 
                time: '19:00',
                numberOfGuests: 2
            });
            await expect(booking.validate()).to.be.rejectedWith(/Cast to date failed/);
        });

        it('should require `numberOfGuests` to be a number', async () => {
            const booking = new Booking({
                customerName: 'John Doe',
                date: new Date(),
                time: '19:00',
                numberOfGuests: 'invalid-number' 
            });
            await expect(booking.validate()).to.be.rejectedWith(/Cast to Number failed/);
        });
    });

});
