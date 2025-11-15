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
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Copy IP to clipboard
function copyIP() {
    const ip = 'mcfruit.club';
    navigator.clipboard.writeText(ip).then(() => {
        // Show feedback
        const btn = event.target.closest('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copied!</span>';
        btn.style.background = 'linear-gradient(135deg, #00D26A 0%, #00D26A 100%)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(135deg, var(--pink) 0%, var(--green) 100%)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Server status check
async function checkServerStatus() {
    const statusText = document.getElementById('status-text');
    const playerCount = document.getElementById('player-count');
    const pulse = document.querySelector('.pulse');
    
    try {
        // Using mcsrvstat.us API to check server status
        const response = await fetch('https://api.mcsrvstat.us/3/mcfruit.club');
        const data = await response.json();
        
        if (data.online) {
            statusText.textContent = 'Server Online';
            statusText.style.color = 'var(--green)';
            pulse.style.background = 'var(--green)';
            pulse.style.boxShadow = '0 0 10px var(--green)';
            
            // Update player count
            if (data.players) {
                playerCount.textContent = `${data.players.online || 0}/${data.players.max || 0}`;
            } else {
                playerCount.textContent = '0/0';
            }
        } else {
            statusText.textContent = 'Server Offline';
            statusText.style.color = '#ef4444';
            pulse.style.background = '#ef4444';
            pulse.style.boxShadow = '0 0 10px #ef4444';
            playerCount.textContent = '0/0';
        }
    } catch (error) {
        console.error('Error fetching server status:', error);
        statusText.textContent = 'Status Unknown';
        statusText.style.color = 'var(--text-dim)';
        pulse.style.background = 'var(--text-dim)';
        pulse.style.boxShadow = '0 0 10px var(--text-dim)';
        playerCount.textContent = '-';
    }
}

// Check server status on page load
checkServerStatus();

// Refresh server status every 30 seconds
setInterval(checkServerStatus, 30000);

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 26, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(255, 79, 121, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .leaderboard-entry, .stat-box, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    
    // Simulate form submission (replace with actual backend call)
    setTimeout(() => {
        btn.innerHTML = '<span>✓ Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #00D26A 0%, #00D26A 100%)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(135deg, var(--pink) 0%, var(--green) 100%)';
            btn.disabled = false;
            e.target.reset();
        }, 3000);
    }, 1500);
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
