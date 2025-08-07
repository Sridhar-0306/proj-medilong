const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const { generateAppointmentPDF, sendEmailWithPDF } = require('../utils/emailUtils');

module.exports = (Appointment) => {
  // Create new appointment
  router.post('/', async (req, res) => {
    console.log("Received data:", req.body);

    try {
      const appointment = new Appointment(req.body);
      await appointment.save();

      // Generate PDF
      const pdfDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir); // Ensure temp dir exists

      const pdfPath = path.join(pdfDir, `appointment-${Date.now()}.pdf`);
      await generateAppointmentPDF(req.body, pdfPath);
      console.log("📤 Sending email to:", req.body.email);


      // Send email with PDF
      await sendEmailWithPDF(req.body.email, pdfPath)
      .then(() => console.log("✅ Email sent successfully"))
  .catch(err => console.error("❌ Failed to send email:", err));

      // Optionally delete PDF after sending
      fs.unlink(pdfPath, (err) => {
        if (err) console.warn('⚠️ Could not delete PDF:', err.message);
      });

      res.status(201).json({ message: 'Appointment saved and email sent successfully' });

    } catch (error) {
      console.error('❌ Error saving appointment or sending email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Get all appointments
  router.get('/', async (req, res) => {
    try {
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      res.json(appointments);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};
