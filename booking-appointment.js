const express = require('express');
const path = require('path');
const app = express();

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '.')));

// Routes for your pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/doctor', (req, res) => {
    res.sendFile(path.join(__dirname, 'doctor.html'));
});

app.get('/patient', (req, res) => {
    res.sendFile(path.join(__dirname, 'patient.html'));
});

app.get('/reception', (req, res) => {
    res.sendFile(path.join(__dirname, 'reception.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Catch all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MediLong Server running on port ${PORT}`);
    console.log(`📝 Website: http://localhost:${PORT}`);
    console.log(`🏥 Ready to serve your healthcare portal!`);
});
