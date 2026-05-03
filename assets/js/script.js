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

/* ── Gallery filter tabs ── */
const tabBtns = document.querySelectorAll('.tab-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    formSuccess.style.display = 'block';
    contactForm.reset();
    btn.textContent = 'Send Request';
    btn.disabled = false;
  }, 1200);
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
