// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Appointment Form Handling
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const appointmentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            date: formData.get('date'),
            time: formData.get('time'),
            message: formData.get('message')
        };

        // Validate form data
        if (!appointmentData.name || !appointmentData.email || !appointmentData.phone || 
            !appointmentData.service || !appointmentData.date || !appointmentData.time) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(appointmentData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(appointmentData.phone.replace(/\s/g, ''))) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Homeopathic consultation request submitted successfully! We will contact you soon.', 'success');
        
        // Clear form
        this.reset();
        
        // In a real application, you would send this data to your server
        console.log('Appointment Data:', appointmentData);
        
        // Optional: Send WhatsApp message
        const whatsappMessage = `Hello! I would like to book a homeopathic consultation for ${appointmentData.service} on ${appointmentData.date} at ${appointmentData.time}. Name: ${appointmentData.name}, Phone: ${appointmentData.phone}`;
        const whatsappUrl = `https://wa.me/918830206342?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Show WhatsApp option
        setTimeout(() => {
            if (confirm('Would you like to send this consultation request via WhatsApp as well?')) {
                window.open(whatsappUrl, '_blank');
            }
        }, 1000);
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const contactData = {
            name: formData.get('name') || this.querySelector('input[type="text"]').value,
            email: formData.get('email') || this.querySelector('input[type="email"]').value,
            subject: formData.get('subject') || this.querySelectorAll('input[type="text"]')[1].value,
            message: formData.get('message') || this.querySelector('textarea').value
        };

        // Validate form data
        if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactData.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        
        // Clear form
        this.reset();
        
        // In a real application, you would send this data to your server
        console.log('Contact Data:', contactData);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Date validation for appointment form
const dateInput = document.getElementById('date');
if (dateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Prevent selecting past dates
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date.', 'error');
            this.value = '';
        }
    });
}

// Time slot availability (simplified)
const timeSelect = document.getElementById('time');
if (timeSelect) {
    // Disable past times for today
    const updateTimeSlots = () => {
        const selectedDate = dateInput.value;
        const today = new Date().toISOString().split('T')[0];
        
        if (selectedDate === today) {
            const currentHour = new Date().getHours();
            Array.from(timeSelect.options).forEach(option => {
                if (option.value) {
                    const optionHour = parseInt(option.value.split(':')[0]);
                    if (optionHour <= currentHour) {
                        option.disabled = true;
                        option.textContent += ' (Unavailable)';
                    }
                }
            });
        }
    };
    
    if (dateInput) {
        dateInput.addEventListener('change', updateTimeSlots);
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .about-text, .appointment-form, .contact-form');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// WhatsApp integration enhancement
function openWhatsApp(message = '') {
    const defaultMessage = message || 'Hello! I would like to know more about your homeopathic services.';
    const whatsappUrl = `https://wa.me/918830206342?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Add click event to WhatsApp float button
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp();
    });
}

// Service card click to book appointment
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3').textContent;
        const appointmentSection = document.getElementById('appointment');
        const serviceSelect = document.getElementById('service');
        
        if (appointmentSection && serviceSelect) {
            // Scroll to appointment section
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
            
            // Set the service in the dropdown
            setTimeout(() => {
                const serviceValue = serviceName.toLowerCase().replace(/\s+/g, '');
                const option = Array.from(serviceSelect.options).find(opt => 
                    opt.value === serviceValue || opt.text.toLowerCase().includes(serviceName.toLowerCase())
                );
                if (option) {
                    serviceSelect.value = option.value;
                }
            }, 500);
        }
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
    transition: all 0.3s ease;
    z-index: 999;
`;

document.body.appendChild(backToTopBtn);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

// Back to top functionality
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hover effect for back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'translateY(-3px)';
    backToTopBtn.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'translateY(0)';
    backToTopBtn.style.boxShadow = '0 5px 15px rgba(37, 99, 235, 0.3)';
});

console.log('Indu Homeopathy Clinic Website - JavaScript loaded successfully!'); 