// Create scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to top when clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Page transition effect
function navigateWithTransition(url) {
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.98)';
    document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Add transition to all internal page links
document.querySelectorAll('a[href^="/"], a[href^="index.html"], a[href^="rules.html"], a[href^="staff.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')) {
            e.preventDefault();
            navigateWithTransition(href);
        }
    });
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

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isActive);
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Add keyboard support for hamburger menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</div>
        <div class="toast-message">${message}</div>
    `;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Copy IP to clipboard
function copyIP() {
    const ip = 'mcfruit.club';
    navigator.clipboard.writeText(ip).then(() => {
        showToast('IP copied to clipboard! (mcfruit.club)', 'success');
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
    const animatedElements = document.querySelectorAll('.stat-box, .rule-item, .staff-card, .overview-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Double-click IP to select it
const ipElements = document.querySelectorAll('.ip-address, .server-status strong');
ipElements.forEach(el => {
    el.addEventListener('dblclick', function() {
        const range = document.createRange();
        range.selectNodeContents(this);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showToast('IP selected! Press Ctrl+C to copy', 'info');
    });
    
    // Make IP elements focusable for keyboard navigation
    el.setAttribute('tabindex', '0');
    el.style.cursor = 'text';
});

// Add keyboard support for hamburger menu
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
            hamburger.setAttribute('aria-expanded', 
                hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        }
    });
}

// Keyboard shortcuts help modal
function showKeyboardHelp() {
    const modal = document.createElement('div');
    modal.className = 'keyboard-help-modal';
    modal.innerHTML = `
        <div class="keyboard-help-content">
            <h2>⌨️ Keyboard Shortcuts</h2>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>K</kbd>
                    <span>Copy Server IP</span>
                </div>
                <div class="shortcut-item">
                    <kbd>/</kbd>
                    <span>Focus Search</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Clear Selection / Close</span>
                </div>
                <div class="shortcut-item">
                    <kbd>?</kbd>
                    <span>Show This Help</span>
                </div>
                <div class="shortcut-item">
                    <span class="tip">💡 Double-click IP to select it</span>
                </div>
            </div>
            <button class="close-help btn btn-primary">Got it!</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close button handler
    modal.querySelector('.close-help').onclick = () => modal.remove();
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to copy IP
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        copyIP();
    }
    
    // Press '/' to focus search/navigation
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[type="text"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Press '?' to show keyboard shortcuts
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        showKeyboardHelp();
    }
    
    // Escape to clear selection, close modals, and blur
    if (e.key === 'Escape') {
        const modal = document.querySelector('.keyboard-help-modal');
        if (modal) {
            modal.remove();
        } else {
            window.getSelection().removeAllRanges();
            document.activeElement.blur();
        }
    }
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
