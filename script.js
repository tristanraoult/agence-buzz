document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. CUSTOM CURSOR
  // ==========================================
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow
  function animateCursor() {
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effects
  const hoverElements = document.querySelectorAll('a, button, input, select, textarea, .project-card, .hamburger, .filter-btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));


  // ==========================================
  // 2. MOBILE MENU HAMBURGER
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // ==========================================
  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================
  // 4. SPLIT HERO TITLE ANIMATION (LETTERS STAGGER)
  // ==========================================
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = '';
    
    // Split into characters
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = char === ' ' ? '\u00A0' : char; // Handle space
      span.style.transition = `transform 0.6s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.03}s, opacity 0.6s ease ${index * 0.03}s`;
      heroTitle.appendChild(span);
    });

    // Trigger reveal after a short delay
    setTimeout(() => {
      heroTitle.querySelectorAll('.char').forEach(charSpan => {
        charSpan.style.opacity = '1';
        charSpan.style.transform = 'translateY(0)';
      });
    }, 150);
  }


  // ==========================================
  // 5. MAGNETIC BUTTONS EFFECT
  // ==========================================
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-accent, .btn-secondary, .btn-rdv');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });


  // ==========================================
  // 6. COUNT-UP STATS ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const statsSection = document.querySelector('.stats-container');
    
    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = 2000 / target; // Total duration 2s
      
      const updateCount = () => {
        const increment = Math.ceil(target / 100);
        if (count < target) {
          count += increment;
          if (count > target) count = target;
          el.textContent = count + suffix;
          setTimeout(updateCount, speed * increment);
        } else {
          el.textContent = target + suffix;
        }
      };
      updateCount();
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => countUp(num));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }


  // ==========================================
  // 7. APPOINTMENT BOOKING FORM LOGIC
  // ==========================================
  const rdvForm = document.getElementById('rdv-form');
  const formStatus = document.getElementById('rdv-form-status');

  if (rdvForm && formStatus) {
    rdvForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formStatus.className = 'form-status-msg';
      formStatus.textContent = 'Envoi de votre demande en cours...';
      formStatus.style.display = 'block';

      // Simulate API Call
      setTimeout(() => {
        formStatus.className = 'form-status-msg success';
        formStatus.innerHTML = '<strong>Demande envoyée !</strong> Merci. Notre interlocuteur unique vous contactera sous 24h avec des propositions de rendez-vous.';
        rdvForm.reset();
      }, 1500);
    });
  }


  // ==========================================
  // 8. PROJECTS FILTERING (projets.html)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  }
});
