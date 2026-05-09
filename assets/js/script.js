/* ═══════════════════════════════════════════
   RISQUEVERT – MAIN SCRIPT
═══════════════════════════════════════════ */

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Reveal on scroll ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

/* ── Satellite Canvas Animation ── */
const canvas = document.getElementById('satelliteCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], orbitals = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.7 + 0.1,
  }));
  orbitals = Array.from({ length: 3 }, (_, i) => ({
    cx: W * (0.5 + i * 0.15),
    cy: H * 0.4,
    rx: 120 + i * 60, ry: 40 + i * 20,
    angle: i * Math.PI * 0.6,
    speed: 0.003 + i * 0.001,
  }));
}
initParticles();

function drawGrid() {
  ctx.strokeStyle = 'rgba(46,204,113,0.04)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawGrid();

  // Particles (stars)
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();
  });

  // Orbital paths + satellites
  orbitals.forEach(o => {
    o.angle += o.speed;
    ctx.beginPath();
    ctx.ellipse(o.cx, o.cy, o.rx, o.ry, -0.3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(46,204,113,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const sx = o.cx + Math.cos(o.angle) * o.rx;
    const sy = o.cy + Math.sin(o.angle) * o.ry;
    // Satellite dot
    ctx.beginPath();
    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#2ecc71';
    ctx.shadowColor = '#2ecc71';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Signal line down
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    const landX = o.cx + Math.cos(o.angle + 0.3) * o.rx * 0.3;
    const landY = H * 0.85;
    ctx.lineTo(landX, landY);
    ctx.strokeStyle = 'rgba(46,204,113,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  requestAnimationFrame(animate);
}
animate();

/* Removed legacy gallery and lightbox code */

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      formSuccess.style.display = 'block';
      contactForm.reset();
    } else {
      alert('Oops! There was a problem submitting your form');
    }
  } catch (error) {
    alert('Oops! There was a problem submitting your form');
  }

  btn.textContent = 'Send a Message';
  btn.disabled = false;
});

/* ── Smooth active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navA.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--green)' : '';
  });
}, { passive: true });
