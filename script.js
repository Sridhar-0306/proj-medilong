// Toggle Mobile Navigation Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Dark Mode Toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    darkModeToggle.textContent = '☀️';
  } else {
    darkModeToggle.textContent = '🌙';
  }
});

// Patient History Tabs
const tabLinks = document.querySelectorAll('.tab-link');
const tabPanes = document.querySelectorAll('.tab-pane');

tabLinks.forEach((link) => {
  link.addEventListener('click', () => {
    // Remove active class from all tabs
    tabLinks.forEach((l) => l.classList.remove('active'));
    // Add active class to the clicked tab
    link.classList.add('active');

    // Hide all tab panes
    tabPanes.forEach((pane) => pane.classList.remove('active'));

    // Show the selected tab pane
    const targetTab = link.getAttribute('data-tab');
    document.getElementById(targetTab).classList.add('active');
  });
});