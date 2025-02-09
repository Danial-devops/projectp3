require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const logger = require('./logger');
const promClient = require('prom-client'); 

const EditRoutes = require('./utils/editBookingRoute');
const CreateRoutes = require('./utils/createBookingRoute');
const BookingRoutes = require('./utils/BookingRoute');
const app = express();

const PORT = process.env.PORT || 3000;
const DB_Connect = process.env.DB_CONNECT;
const startPage = "index.html";

const register = new promClient.Registry();

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status'],
});

register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, res.statusCode).inc();
  });
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./instrumented"));

mongoose.connect(DB_Connect)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    logger.info('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    logger.error(`MongoDB connection error: ${err.message}`);
  });

app.use('/', CreateRoutes);
app.use('/', BookingRoutes);
app.use('/', EditRoutes);

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/instrumented/" + startPage);
})

const server = app.listen(PORT, function () {
  const address = server.address();
  const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
  console.log(`Demo project at: ${baseUrl}`);
  logger.info(`Demo project at: ${baseUrl}!`);
});

module.exports = { app, server };
