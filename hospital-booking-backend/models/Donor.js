const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  professional: String,
  blood_group: String,
  contact: String,
  email: String,
  location: String
});

module.exports = (connection) => connection.model('Donor', donorSchema);
