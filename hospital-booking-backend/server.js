const express = require('express');
require('dotenv').config();
const cors = require('cors');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Route handlers
const appointmentRoutes = require('./routes/appointments');
const ambulanceRoutes = require('./routes/ambulance');
const donorRoutes = require('./routes/donors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// === Database Connections ===
const appointmentConnection = mongoose.createConnection(process.env.APPOINTMENT_DB_URI);
const ambulanceConnection = mongoose.createConnection(process.env.AMBULANCE_DB_URI);
const donorConnection = mongoose.createConnection(process.env.DONOR_DB_URI);

// === Models ===
const Appointment = require('./models/Appointment')(appointmentConnection);
const AmbulanceBooking = require('./models/AmbulanceBooking')(ambulanceConnection);
const Donor = require('./models/Donor')(donorConnection);

// === Routes ===
app.use('/api/appointments', appointmentRoutes(Appointment));
app.use('/api/ambulance', ambulanceRoutes(AmbulanceBooking));
app.use('/api/donors', donorRoutes(Donor));

// === DB Logs ===
appointmentConnection.once('open', () => {
  console.log('✅ Connected to Appointment DB');
});
appointmentConnection.on('error', (err) => {
  console.error('❌ Appointment DB error:', err);
});

ambulanceConnection.once('open', () => {
  console.log('✅ Connected to Ambulance DB');
});
ambulanceConnection.on('error', (err) => {
  console.error('❌ Ambulance DB error:', err);
});

// === Export Appointments to Excel ===
app.get('/api/export', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Appointments');

    worksheet.columns = [
      { header: 'Patient Name', key: 'patientName' },
      { header: 'Patient Email', key: 'patientEmail' },
      { header: 'Patient Phone', key: 'patientPhone' },
      { header: 'Patient Address', key: 'patientAddress' },
      { header: 'Patient Age', key: 'patientAge' },
      { header: 'Patient Gender', key: 'patientGender' },
      { header: 'Appointment Time', key: 'appointmentTime' },
      { header: 'Medical Condition', key: 'medicalCondition' },
      { header: 'Department', key: 'department' },
      { header: 'Doctor Name', key: 'doctorName' },
      { header: 'Doctor Specialty', key: 'doctorSpecialty' }
    ];

    appointments.forEach((app) => {
      worksheet.addRow(app.toObject());
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=appointments.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Export failed:', err);
    res.status(500).send('Failed to export appointments');
  }
});

// === Keep ambulance export as-is ===
app.get('/api/export-ambulance', async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ambulance Bookings');

    worksheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'Phone', key: 'phone' },
      { header: 'Patient Name', key: 'patientName' },
      { header: 'Condition', key: 'condition' },
      { header: 'Ambulance Type', key: 'ambulanceType' },
      { header: 'Pickup Location', key: 'pickupLocation' },
      { header: 'DateTime', key: 'dateTime' },
      { header: 'Payment Method', key: 'paymentMethod' },
    ];

    bookings.forEach((b) => {
      worksheet.addRow(b.toObject());
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=ambulance_bookings.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Export failed:', err);
    res.status(500).send('Failed to export ambulance bookings');
  }
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
