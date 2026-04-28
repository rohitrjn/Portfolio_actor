/* ============================================
   INTERACTIVE FEATURES
   ============================================ */

// Smooth scroll behavior for navigation
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

// Active nav link highlighting based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// CTA Button interaction
document.querySelector('.cta-button').addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
});

// Gallery item hover effect (placeholder for future functionality)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.1)';
    });
    item.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(1)';
    });
});

// Video item hover effect
document.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.15)';
    });
    item.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(1)';
    });
});

console.log('Portfolio loaded successfully!');
