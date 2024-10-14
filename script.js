// script.js

// Smooth Scroll for Navigation Links and "View My Work" Button
document.querySelectorAll('nav ul li a, .btn').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
        });
    });
});

// Update Navbar Active Link on Scroll
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach((li) => {
        li.classList.remove('active');
        if (li.getAttribute('href') === '#' + current) {
            li.classList.add('active');
        }
    });
});

// Interactive Background Script with Smooth Interactions
const canvas = document.getElementById('interactive-bg');
const ctx = canvas.getContext('2d');

let particlesArray;
let radiusFraction = 20;
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / radiusFraction) * (canvas.width / radiusFraction),
};

// Track mouse position with smoothing
let lastMouse = { x: null, y: null };
let mouseVelocity = { x: 0, y: 0 };

window.addEventListener('mousemove', function (event) {
    if (lastMouse.x !== null && lastMouse.y !== null) {
        mouseVelocity.x = event.x - lastMouse.x;
        mouseVelocity.y = event.y - lastMouse.y;
    }
    lastMouse.x = event.x;
    lastMouse.y = event.y;
    mouse.x = event.x;
    mouse.y = event.y;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create Particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.speed = 2; // Increased speed from 1 to 2
    }
    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // Method to handle particle interactions (repulsion)
    repel(otherParticle) {
        const dx = this.x - otherParticle.x;
        const dy = this.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (this.size + otherParticle.size) * 20;

        if (distance < minDistance && distance > 0) {
            // Calculate angle between particles
            const angle = Math.atan2(dy, dx);
            // Calculate force magnitude (you can adjust the strength as needed)
            const force = (minDistance - distance) / distance * 0.1;

            // Apply force to both particles in opposite directions
            this.directionX += Math.cos(angle) * force;
            this.directionY += Math.sin(angle) * force;

            otherParticle.directionX -= Math.cos(angle) * force;
            otherParticle.directionY -= Math.sin(angle) * force;
        }
    }
    // Check particle position, check mouse position, move the particle, draw the particle
    update(particlesArray) {
        // Move particle
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Apply damping for smoother movement
        this.directionX *= 0.98;
        this.directionY *= 0.98;

        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;

        // Add random motion to particles
        this.directionX += (Math.random() - 0.5) * 0.05;
        this.directionY += (Math.random() - 0.5) * 0.05;

        // Mouse interactivity
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            // Calculate angle
            let angle = Math.atan2(dy, dx);
            // Push particle away from mouse with gradual change
            this.directionX -= Math.cos(angle) * 0.25;
            this.directionY -= Math.sin(angle) * 0.25;
        }

        // Repel from other particles
        for (let i = 0; i < particlesArray.length; i++) {
            if (this === particlesArray[i]) continue;
            this.repel(particlesArray[i]);
        }

        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 5000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x =
            Math.random() * (innerWidth - size * 2 - (size * 2)) + size * 2;
        let y =
            Math.random() * (innerHeight - size * 2 - (size * 2)) + size * 2;
        let directionX = Math.random() * 1 - 0.5;
        let directionY = Math.random() * 1 - 0.5;
        let color = '#ffa0a0';

        particlesArray.push(
            new Particle(x, y, directionX, directionY, size, color)
        );
    }
}

// Check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance =
                (particlesArray[a].x - particlesArray[b].x) *
                    (particlesArray[a].x - particlesArray[b].x) +
                (particlesArray[a].y - particlesArray[b].y) *
                    (particlesArray[a].y - particlesArray[b].y);
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - distance / 15000;
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y); // Corrected y-coordinate
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y); // Corrected y-coordinate
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(particlesArray);
    }
    connect();
}

// Resize event
window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    // mouse.radius = (canvas.height / 25) * (canvas.width / 25); // Removed dynamic radius
    // Re-initialize particles to adjust to new canvas size
    init();
});

// Mouse out event
window.addEventListener('mouseout', function () {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Email Toggle Functionality
const emailButton = document.getElementById('email-button');
const emailDisplay = document.getElementById('email-display');
const contactSection = document.getElementById('contact');

// Toggle email display on button click
emailButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    emailDisplay.classList.toggle('show');
});

// Collapse email display when clicking outside
document.addEventListener('click', (e) => {
    if (!contactSection.contains(e.target)) {
        emailDisplay.classList.remove('show');
    }
});

// Collapse email display when scrolling away from contact section
window.addEventListener('scroll', () => {
    const rect = contactSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
        emailDisplay.classList.remove('show');
    }
});

// Modal Functionality
const modal = document.getElementById('detail-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalImage = document.querySelector('.modal-image');
const closeButton = document.querySelector('.close-button');

// Function to open modal with specific content
function openModal(title, description, imageSrc) {
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalImage.src = imageSrc;
    modalImage.alt = title;
    modal.classList.add('show');
}

// Function to close modal
function closeModal() {
    modal.classList.remove('show');
}

// Add event listeners to all "View Details" buttons
const viewDetailButtons = document.querySelectorAll('.view-details-btn');
viewDetailButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        // Determine if the button is in a project or hackathon card
        const card = e.target.closest('.project-card, .hackathon-card');
        const title = card.querySelector('h3').textContent.trim();
        const description = card.querySelector('p').textContent.trim();
        // Placeholder image; replace with actual image paths as needed
        let imageSrc = 'detail-image.jpg';
        // Optionally, use specific images based on project/hackathon
        if (title.includes('Robotic Arm')) {
            imageSrc = 'robotic_arm_detail.jpg';
        } else if (title.includes('Arcade Game')) {
            imageSrc = 'arcade_game_detail.jpg';
        } else if (title.includes('Paint Project')) {
            imageSrc = 'paint_project_detail.jpg';
        } else if (title.includes('League Fair Teams')) {
            imageSrc = 'league_fair_teams_detail.jpg';
        } else if (title.includes('Periodic Trend Analysis')) {
            imageSrc = 'periodic_trend_analysis_detail.jpg';
        } else if (title.includes('EventSheet')) {
            imageSrc = 'eventsheet_detail.jpg';
        } else if (title.includes('NASA Space Apps')) {
            imageSrc = 'nasa_space_apps_detail.jpg';
        } else if (title.includes('Massey Hacks X')) {
            imageSrc = 'massey_hacks_x_detail.jpg';
        } else if (title.includes('Massey Hacks IX')) {
            imageSrc = 'massey_hacks_ix_detail.jpg';
        }

        // Replace the placeholder image and description with actual content as needed
        openModal(title, description + " " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imageSrc);
    });
});

// Close modal when the close button is clicked
closeButton.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize particles and start animation
init();
animate();
