const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { generateDonorPDF, sendEmailWithPDF } = require('../utils/emailUtils');

module.exports = (Donor) => {
  router.post('/', async (req, res) => {
    const donorData = req.body;
    console.log("📥 Donor form data received:", donorData);

    try {
      // 1️⃣ Save to MongoDB
      const newDonor = new Donor(donorData);
      await newDonor.save();
      console.log("✅ Donor saved to DB");

      // 2️⃣ Generate PDF
      const pdfDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

      const pdfPath = path.join(pdfDir, `donor-${Date.now()}.pdf`);
      await generateDonorPDF(donorData, pdfPath);

      // 3️⃣ Send Email
      await sendEmailWithPDF(donorData.email, pdfPath);

      // 4️⃣ Delete temp PDF
      fs.unlink(pdfPath, (err) => {
        if (err) console.warn("⚠️ Could not delete PDF:", err.message);
      });

      res.status(200).json({ message: 'Donor saved and email sent successfully' });

    } catch (err) {
      console.error("❌ Error in donor registration route:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};
