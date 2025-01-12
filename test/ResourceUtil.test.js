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

describe('Edit Booking Backend Tests', () => {
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
        // Delete booking made for test
        await Booking.findByIdAndDelete(createdBookingId);

        await mongoose.connection.close();
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    describe('Edit Booking Validation', () => {
        it('should update an existing booking', (done) => {
            chai.request(baseUrl)
                .put(`/edit-booking/${createdBookingId}`)
                .send({
                    customerName: 'Downey Lowney',
                    date: new Date('2025-12-02'),
                    time: '20:00',
                    numberOfGuests: 2,
                    specialRequests: 'Near the entrance',
                })
                .end((err, res) => {
                    // Additional chai assertions
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys('message', 'updatedBooking');
                    expect(res.body.message).to.equal('Booking updated successfully');

                    const updatedBooking = res.body.updatedBooking;

                    expect(updatedBooking).to.be.an('object').that.includes.all.keys(
                        'customerName', 'date', 'time', 'numberOfGuests', 'specialRequests'
                    );
                    expect(updatedBooking.customerName).to.be.a('string').that.equals('Downey Lowney');
                    expect(new Date(updatedBooking.date).toISOString()).to.equal(new Date('2025-12-02').toISOString());
                    expect(updatedBooking.time).to.equal('20:00');
                    expect(updatedBooking.numberOfGuests).to.be.a('number').that.equals(2);
                    expect(updatedBooking.specialRequests).to.include('Near the entrance');

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
                    expect(res.body).to.include.keys('message');
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
                    expect(res.body).to.have.property('message').that.includes('Error updating booking');
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
                numberOfGuests: 2,
            });
            await expect(booking.validate()).to.be.rejectedWith(/Cast to date failed/);
        });

        it('should require `numberOfGuests` to be a number', async () => {
            const booking = new Booking({
                customerName: 'John Doe',
                date: new Date(),
                time: '19:00',
                numberOfGuests: 'invalid-number',
            });
            await expect(booking.validate()).to.be.rejectedWith(/Cast to Number failed/);
        });
    });
});
