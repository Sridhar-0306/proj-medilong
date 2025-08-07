const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');

// Generate appointment PDF
async function generateAppointmentPDF(data, filePath) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text('Appointment Confirmation', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${data.name}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Phone: ${data.phone}`);
    doc.text(`Address: ${data.address}`);
    doc.text(`Age: ${data.age}`);
    doc.text(`Gender: ${data.gender}`);
    doc.text(`Condition: ${data.condition}`);
    doc.text(`Department: ${data.department}`);
    doc.text(`Doctor: ${data.doctor}`);
    doc.text(`Specialty: ${data.specialty}`);
    doc.text(`Time: ${data.appointmentTime}`);

    doc.end();
    stream.on('finish', resolve);
  });
}

// Generate donor PDF
async function generateDonorPDF(data, filePath) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    console.log("📤 Generating PDF for:", data.email);  // ✅ Fixed line

    doc.fontSize(18).text('Blood Donor Registration Confirmation', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${data.name}`);
    doc.text(`Age: ${data.age}`);
    doc.text(`Gender: ${data.gender}`);
    doc.text(`Profession: ${data.professional}`);
    doc.text(`Blood Group: ${data.blood_group}`);
    doc.text(`Contact: ${data.contact}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Location: ${data.location}`);

    doc.end();
    stream.on('finish', resolve);
  });
}


// Send email with attached PDF
async function sendEmailWithPDF(toEmail, pdfPath)
 {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Your Confirmation PDF',
    text: 'Please find your confirmation attached.',
    attachments: [
      {
        filename: 'confirmation.pdf',
        path: pdfPath
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}

// ✅ Export everything you need
module.exports = {
  generateAppointmentPDF,
  sendEmailWithPDF,
  generateDonorPDF  // ✅ Add this line to export donor PDF generator
};
