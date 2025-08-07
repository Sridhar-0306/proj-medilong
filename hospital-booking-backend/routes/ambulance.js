// routes/ambulance.js
const express = require('express');
const router = express.Router();
const AmbulanceBooking = require('../models/AmbulanceBooking');

router.post('/book', async (req, res) => {
  try {
    const booking = new AmbulanceBooking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Ambulance booking successful' });
  } catch (error) {
    console.error('Ambulance booking error:', error);
    res.status(500).json({ error: 'Failed to book ambulance' });
  }
});

module.exports = (AmbulanceBooking) => {
  const router = require('express').Router();

  router.post('/book', async (req, res) => {
    try {
      const newBooking = new AmbulanceBooking(req.body);
      await newBooking.save();
      res.status(201).json({ message: 'Ambulance booked successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Ambulance booking failed' });
    }
  });

  return router;
};

