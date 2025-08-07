document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const doctorForm = document.getElementById('doctor-form');
  const serviceSelect = document.getElementById('service');
  const timeSlots = document.querySelectorAll('#time-slots .time-slot');
  const seats = document.querySelectorAll('#seats .seat');
  const patientForm = document.getElementById('patient-form');
  const paymentOptions = document.querySelectorAll('#payment-options input');
  const confirmBookingBtn = document.getElementById('confirm-booking');

  // Variables
  let selectedTimeSlot = null;
  let selectedSeats = [];
  let totalCost = 0;
  let gst = 0;
  let grandTotal = 0;

  // Service Prices
  const servicePrices = {
    consultation: 500,
    checkup: 1000,
    therapy: 1500,
    emergency: 2000,
  };

  // Seat Prices
  const seatPrices = {
    regular: 100,
    emergency: 200,
  };

  // Time Slot Selection
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTimeSlot = slot.textContent;
      updateConfirmation();
    });
  });

  // Seat Selection
  seats.forEach(seat => {
    seat.addEventListener('click', () => {
      seat.classList.toggle('selected');
      selectedSeats = Array.from(document.querySelectorAll('#seats .seat.selected')).map(s => s.textContent);

      const selectedService = serviceSelect.value;
      totalCost = servicePrices[selectedService] || 0;

      selectedSeats.forEach(seat => {
        totalCost += seat.includes('Emergency') ? seatPrices.emergency : seatPrices.regular;
      });

      document.getElementById('selected-seats').textContent = selectedSeats.join(', ');
      document.getElementById('total-cost').textContent = totalCost;
      updateConfirmation();
    });
  });

  // Update Confirmation Details
  function updateConfirmation() {
    const doctorName = document.getElementById('doctor-name').value;
    const doctorSpecialty = document.getElementById('doctor-specialty').value;
    const service = serviceSelect.options[serviceSelect.selectedIndex]?.text || '';
    const patientName = document.getElementById('name').value;
    const patientEmail = document.getElementById('email').value;
    const patientPhone = document.getElementById('phone').value;
    const patientAddress = document.getElementById('address').value;
    const patientAge = document.getElementById('age').value;
    const patientGender = document.getElementById('gender').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'Not selected';

    gst = totalCost * 0.18;
    grandTotal = totalCost + gst;

    document.getElementById('confirm-doctor').textContent = doctorName || 'Not provided';
    document.getElementById('confirm-specialty').textContent = doctorSpecialty || 'Not provided';
    document.getElementById('confirm-service').textContent = service || 'Not selected';
    document.getElementById('confirm-time').textContent = selectedTimeSlot || 'Not selected';
    document.getElementById('confirm-seats').textContent = selectedSeats.join(', ') || 'None';
    document.getElementById('confirm-name').textContent = patientName || 'Not provided';
    document.getElementById('confirm-email').textContent = patientEmail || 'Not provided';
    document.getElementById('confirm-phone').textContent = patientPhone || 'Not provided';
    document.getElementById('confirm-address').textContent = patientAddress || 'Not provided';
    document.getElementById('confirm-age').textContent = patientAge || 'Not provided';
    document.getElementById('confirm-gender').textContent = patientGender || 'Not provided';
    document.getElementById('confirm-payment').textContent = paymentMethod;
    document.getElementById('confirm-cost').textContent = totalCost;
    document.getElementById('confirm-gst').textContent = gst.toFixed(2);
    document.getElementById('confirm-grand-total').textContent = grandTotal.toFixed(2);
  }

  // Confirm Booking and Submit
  confirmBookingBtn?.addEventListener('click', async () => {
    updateConfirmation();

    const appointmentData = {
      doctorName: document.getElementById('confirm-doctor').textContent,
      doctorSpecialty: document.getElementById('confirm-specialty').textContent,
      service: document.getElementById('confirm-service').textContent,
      timeSlot: document.getElementById('confirm-time').textContent,
      seats: selectedSeats,
      patientName: document.getElementById('confirm-name').textContent,
      patientEmail: document.getElementById('confirm-email').textContent,
      patientPhone: document.getElementById('confirm-phone').textContent,
      patientAddress: document.getElementById('confirm-address').textContent,
      patientAge: document.getElementById('confirm-age').textContent,
      patientGender: document.getElementById('confirm-gender').textContent,
      paymentMethod: document.getElementById('confirm-payment').textContent,
      totalCost,
      gst,
      grandTotal,
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert('Booking Confirmed! Appointment has been saved.');
      } else {
        alert('Error booking appointment: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving appointment:', err);
      alert('An error occurred while saving your appointment.');
    }

    // Generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(22);
    doc.setTextColor(33, 150, 243);
    doc.text('Hospital Booking Appointment Bill', 15, 20);
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(0.5);
    doc.line(15, 25, 195, 25);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor Details:', 15, 35);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${appointmentData.doctorName}`, 20, 45);
    doc.text(`Specialty: ${appointmentData.doctorSpecialty}`, 20, 55);

    doc.setFont('helvetica', 'bold');
    doc.text('Service Details:', 15, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Service: ${appointmentData.service}`, 20, 80);
    doc.text(`Time Slot: ${appointmentData.timeSlot}`, 20, 90);

    doc.setFont('helvetica', 'bold');
    doc.text('Seat Details:', 15, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(`Selected Seats: ${appointmentData.seats.join(', ')}`, 20, 115);

    doc.setFont('helvetica', 'bold');
    doc.text('Patient Details:', 15, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${appointmentData.patientName}`, 20, 140);
    doc.text(`Email: ${appointmentData.patientEmail}`, 20, 150);
    doc.text(`Phone: ${appointmentData.patientPhone}`, 20, 160);
    doc.text(`Address: ${appointmentData.patientAddress}`, 20, 170);
    doc.text(`Age: ${appointmentData.patientAge}`, 20, 180);
    doc.text(`Gender: ${appointmentData.patientGender}`, 20, 190);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details:', 15, 205);
    doc.setFont('helvetica', 'normal');
    doc.text(`Method: ${appointmentData.paymentMethod}`, 20, 215);

    doc.setFont('helvetica', 'bold');
    doc.text('Cost Details:', 15, 230);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Cost: ₹${appointmentData.totalCost}`, 20, 240);
    doc.text(`GST (18%): ₹${appointmentData.gst.toFixed(2)}`, 20, 250);
    doc.text(`Grand Total: ₹${appointmentData.grandTotal.toFixed(2)}`, 20, 260);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing our hospital!', 15, 280);
    doc.text('For any queries, contact us at: support@hospital.com', 15, 285);

    doc.save('hospital_booking_bill.pdf');
  });
});
