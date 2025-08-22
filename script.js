// Advanced JavaScript for 3D Landing Page

// Global variables
let mouseX = 0;
let mouseY = 0;
let windowX = window.innerWidth / 2;
let windowY = window.innerHeight / 2;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParallax();
    initializeCounters();
    initializeScrollAnimations();
    initializeTiltEffects();
    initializeParticleSystem();
    initializeCursorEffects();
    initializeSkillChart();
    initializeProgressAnimations();
});

// Enhanced navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.1)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Enhanced mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Add body scroll lock when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Initialize animations
function initializeAnimations() {
    // Stagger animation for feature highlights
    const highlights = document.querySelectorAll('.highlight-item');
    highlights.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('fade-in-up');
    });
    
    // Animate floating cards with different delays
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 1.5}s`;
    });
}

// Advanced parallax effects
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax for floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        // Parallax for hero visual
        const heroVisual = document.querySelector('.hero-visual-3d');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
        
        // Parallax for floating elements
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Enhanced counter animation
function initializeCounters() {
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.7 });

    document.querySelectorAll('.stat-number-3d').forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Advanced scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Special animations for different elements
                if (entry.target.classList.contains('feature-card-3d')) {
                    entry.target.style.animationDelay = '0.2s';
                }
                
                if (entry.target.classList.contains('progress-fill')) {
                    const progress = entry.target.getAttribute('data-progress');
                    setTimeout(() => {
                        entry.target.style.width = progress + '%';
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card-3d, .demo-feature, .progress-fill, .reveal').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Initialize tilt effects using Vanilla Tilt
function initializeTiltEffects() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
            scale: 1.05
        });
    }
}

// Advanced particle system
function initializeParticleSystem() {
    const particleContainer = document.querySelector('.hero-section');
    if (!particleContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const startPositionX = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 6 + 4;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startPositionX}px;
            animation-duration: ${animationDuration}s;
        `;
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, animationDuration * 1000);
    }

    // Create particles periodically
    setInterval(createParticle, 500);
    
    // Create initial burst of particles
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 200);
    }
}

// Custom cursor effects
function initializeCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Update global mouse position for other effects
        updateMousePosition(e);
    });

    // Enhance cursor on hover
    document.querySelectorAll('button, a, .feature-card-3d').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = 'rgba(99, 102, 241, 0.6)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(99, 102, 241, 0.3)';
        });
    });
}

// Mouse position tracking for 3D effects
function updateMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Apply subtle 3D rotation to main dashboard based on mouse position
    const dashboard = document.querySelector('.main-dashboard');
    if (dashboard) {
        const rect = dashboard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = (mouseY - centerY) / rect.height * 10;
        const rotateY = (mouseX - centerX) / rect.width * 10;
        
        dashboard.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    }
}

// Initialize skill chart (using Canvas)
function initializeSkillChart() {
    const canvas = document.getElementById('skillChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    const skills = [
        { name: 'React', value: 85, color: '#61dafb' },
        { name: 'Node.js', value: 78, color: '#68a063' },
        { name: 'Python', value: 92, color: '#3776ab' },
        { name: 'MongoDB', value: 76, color: '#4db33d' },
        { name: 'AWS', value: 70, color: '#ff9900' }
    ];
    
    function drawSkillChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        skills.forEach((skill, index) => {
            const angle = (index / skills.length) * 2 * Math.PI - Math.PI / 2;
            const value = skill.value / 100;
            
            // Draw skill line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius * value,
                centerY + Math.sin(angle) * radius * value
            );
            ctx.strokeStyle = skill.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw skill point
            ctx.beginPath();
            ctx.arc(
                centerX + Math.cos(angle) * radius * value,
                centerY + Math.sin(angle) * radius * value,
                4, 0, 2 * Math.PI
            );
            ctx.fillStyle = skill.color;
            ctx.fill();
        });
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
    }
    
    // Animate chart drawing
    let progress = 0;
    const animateChart = () => {
        if (progress < 1) {
            progress += 0.02;
            drawSkillChart();
            requestAnimationFrame(animateChart);
        }
    };
    
    // Start animation when chart comes into view
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateChart();
            }
        });
    });
    
    chartObserver.observe(canvas);
}

// Initialize progress bar animations
function initializeProgressAnimations() {
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-fill');
                const progress = progressBar.getAttribute('data-progress');
                
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 300);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-card').forEach(card => {
        progressObserver.observe(card);
    });
}

// Smooth scrolling for anchor links
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

// Button interaction functions
function startJourney() {
    const targetSection = document.querySelector('#features');
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add button animation
    animateButton(event.target);
    
    // Analytics tracking (if needed)
    trackEvent('start_journey_clicked');
}

function watchDemo() {
    // Add loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner loading"></i> Loading Demo...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('🎬 Interactive demo starting!\n\nThis will connect to your demo platform.');
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
    
    trackEvent('watch_demo_clicked');
}

function startDemo() {
    const demoSection = document.querySelector('#demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Simulate demo start
    simulateDemoInterface();
    
    trackEvent('interactive_demo_started');
}

function startAssessment() {
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-brain"></i> Initializing AI...';
    button.disabled = true;
    
    // Simulate assessment loading
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Ready!';
        setTimeout(() => {
            alert('🧠 AI Assessment Portal Loading...\n\nRedirecting to skill analysis dashboard!');
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }, 2000);
    
    trackEvent('assessment_started');
}

function contactUs() {
    alert('💬 Contact form opening...\n\nThis will open your contact/support system.');
    trackEvent('contact_us_clicked');
}

// Button animation helper
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Simulate demo interface interactions
function simulateDemoInterface() {
    const uploadArea = document.querySelector('.upload-area');
    const progressLine = document.querySelector('.progress-line');
    const results = document.querySelector('.analysis-results');
    
    if (!uploadArea) return;
    
    // Simulate file upload
    uploadArea.style.borderColor = '#10b981';
    uploadArea.style.background = '#f0fdf4';
    
    // Show progress
    setTimeout(() => {
        progressLine.style.animation = 'loadProgress 3s ease-in-out';
    }, 500);
    
    // Show results
    setTimeout(() => {
        if (results) {
            results.style.opacity = '1';
            results.style.transform = 'translateY(0)';
        }
    }, 3500);
    
    // Reset after demo
    setTimeout(() => {
        uploadArea.style.borderColor = '#6366f1';
        uploadArea.style.background = '#f8fafc';
        if (results) {
            results.style.opacity = '0.7';
        }
    }, 8000);
}

// Analytics tracking helper
function trackEvent(eventName) {
    // Implement your analytics tracking here
    console.log(`Event tracked: ${eventName}`);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, {
    //     event_category: 'engagement',
    //     event_label: 'landing_page'
    // });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Performance optimization
function optimizeAnimations() {
    // Reduce animations on low-performance devices
    const isLowPerformance = navigator.hardwareConcurrency < 4;
    
    if (isLowPerformance) {
        document.body.classList.add('reduce-animations');
        
        // Disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
            .reduce-animations * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize performance optimizations
optimizeAnimations();

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initializeLazyLoading();

// Error handling for animations
window.addEventListener('error', (e) => {
    console.warn('Animation error caught:', e.error);
    // Gracefully degrade animations if there are errors
});

// Resize handler for responsive animations
window.addEventListener('resize', debounce(() => {
    // Recalculate positions for responsive animations
    windowX = window.innerWidth / 2;
    windowY = window.innerHeight / 2;
}, 250));

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Page visibility API for pausing animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Initialize everything
console.log('🚀 SkillForge AI landing page loaded successfully!');
