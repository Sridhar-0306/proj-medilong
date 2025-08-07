// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor behavior
      const targetId = this.getAttribute('href'); // Get the target section ID
      const targetSection = document.querySelector(targetId); // Find the target section
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the section
      }
    });
  });
  
  // Dark Mode Toggle
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  const body = document.body;
  
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode'); // Toggle dark mode class
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.textContent = '☀️'; // Change icon to sun
    } else {
      darkModeToggle.textContent = '🌙'; // Change icon to moon
    }
  });
  
  // Animate Doctor Cards on Scroll
  const doctorCards = document.querySelectorAll('.doctor-card');
  
  const animateCardsOnScroll = () => {
    doctorCards.forEach((card, index) => {
      const cardPosition = card.getBoundingClientRect().top; // Get card's position
      const screenPosition = window.innerHeight / 1.3; // Set trigger point
  
      // If card is in view, apply animation
      if (cardPosition < screenPosition) {
        card.style.animation = `slideIn 0.5s ease-out ${index * 0.2}s forwards`;
      }
    });
  };
  
  // Add scroll event listener to trigger animations
  window.addEventListener('scroll', animateCardsOnScroll);
  
  // Hamburger Menu Toggle for Mobile
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Toggle mobile navigation menu
    hamburger.classList.toggle('active'); // Toggle hamburger icon animation
  });
  
  // Book Appointment Button Functionality
  const bookAppointmentButtons = document.querySelectorAll('.book-appointment');
  
  bookAppointmentButtons.forEach(button => {
    button.addEventListener('click', () => {
      const doctorName = button.parentElement.querySelector('h3').textContent; // Get doctor's name
      alert(`Booking appointment with ${doctorName}`); // Show confirmation alert
    });
  });
  
  // Initialize Animations on Page Load
  window.addEventListener('load', () => {
    animateCardsOnScroll(); // Trigger animations for cards already in view
  });