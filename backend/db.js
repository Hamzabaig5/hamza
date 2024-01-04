const mongoose = require('mongoose');
var mongoURL = 'mongodb+srv://123:123@cluster0.dorvgvb.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });

var connection = mongoose.connection;

connection.on('error', () => {
  console.log('Mongo DB Connection Failed');
});

connection.on('connected', () => {
  console.log('Mongo DB Connection Successful');
});

module.exports = mongoose;
