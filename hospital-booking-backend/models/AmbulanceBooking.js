module.exports = (conn) => {
  const mongoose = require('mongoose');
  const schema = new mongoose.Schema({
    name: String,
    phone: String,
    patientName: String,
    condition: String,
    ambulanceType: String,
    pickup: String,
    dateTime: String,
    payment: String
  });
  return conn.model('AmbulanceBooking', schema);
};
