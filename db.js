const mongoose = require('mongoose');
require('dotenv').config();

// define the mongodb connection URL
// create a local database link
// const mongoURL = 'mongodb://localhost:27017/hotels' // replace "mydb" with your db name
const mongoURL = process.env.MONGODB_URL_LOCAL
// const mongoURL = process.env.MONGODB_URL;

// set up Mongodb connection
mongoose.connect(mongoURL, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
})

// get the default connection
// Mongoose maintain a default connection object representing the mongodb connection
const db = mongoose.connection;

// Define event listeners for db connection

db.on('connected', () => {
    console.log('Connected to Mongodb server');
})

db.on('error', () => {
    console.log('Mongodb connection error:', err);
})

db.on('disconnected', () => {
    console.log('Mongodb disconnected');
});

// export the db connection
module.exports = db;
