require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const routes = require('./utils/BookingRoute');
const createBookingRoute = require('./utils/createBookingRoute.js');
const EditRoutes = require('./utils/editBookingRoute');
const TimeslotRoute = require('./utils/TimeslotRoute');
const app = express();

const PORT = process.env.PORT || 5050;
const DB_Connect = process.env.DB_CONNECT; 
const startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

mongoose.connect(DB_Connect, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/', routes);

app.use('/', EditRoutes);

app.use('/', createBookingRoute);

app.use('/api/timeslots', TimeslotRoute);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

const server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}/main1.html`);
});

module.exports = { app, server };