const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  age: String,
  gender: String,
  condition: String,
  department: String,
  doctor: String,
  specialty: String,
  appointmentTime: String
}, { timestamps: true });

module.exports = (connection) => connection.model('Appointment', appointmentSchema);
