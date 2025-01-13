require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const EditRoutes = require('./utils/editBookingRoute');
const CreateRoutes = require('./utils/createBookingRoute');
const BookingRoutes = require('./utils/BookingRoute');
const app = express();

const PORT = process.env.PORT || 5050;
const DB_Connect = process.env.DB_CONNECT; 
const startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./instrumented"));

mongoose.connect(DB_Connect)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/', CreateRoutes);
app.use('/', BookingRoutes);
app.use('/', EditRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/instrumented/" + startPage);
})

const server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };