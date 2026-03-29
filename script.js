/* ═══════════════════════════════════════════════════════════
   REWIRED — script.js  v2.0
   Features: scroll reveals, health panel, geolocation gym/diet
   finder, feed filter, stat counters, nav, scroll progress,
   cursor glow, banner dismiss
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavActiveState();
  initStatCounters();
  initScrollProgress();
  initSmoothAnchors();
  initNavScroll();
  if (window.innerWidth > 960) initCursorGlow();
});


/* ─────────────────────────────────────────────────────────
   1. SCROLL REVEAL
───────────────────────────────────────────────────────── */
function initScrollReveal() {
  const selectors = [
    '.trap-card', '.fight-step', '.timeline-item',
    '.ext-feature', '.pullquote', '.story-note',
    '.discord-box', '.section-title', '.section-intro',
    '.section-label', '.ext-mockup', '.fight-intro',
    '.health-card', '.comm-card', '.feed-card',
    '.hero-tagline-block', '.feed-filter', '.hp-action-card',
  ];

  const els = document.querySelectorAll(selectors.join(','));
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => obs.observe(el));
}


/* ─────────────────────────────────────────────────────────
   2. ACTIVE NAV
───────────────────────────────────────────────────────── */
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--amber-lt)';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
}


/* ─────────────────────────────────────────────────────────
   3. STAT COUNTERS
───────────────────────────────────────────────────────── */
function initStatCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const dur    = 1400;
      const start  = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };

      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
}


/* ─────────────────────────────────────────────────────────
   4. SCROLL PROGRESS BAR
───────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; width:0%;
    background:linear-gradient(to right, var(--red), var(--amber));
    z-index:99999; transition:width 0.1s linear; pointer-events:none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────
   5. SMOOTH ANCHOR SCROLL
───────────────────────────────────────────────────────── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 100;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}


/* ─────────────────────────────────────────────────────────
   6. NAV SCROLL SHADOW
───────────────────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 60 ? '0 4px 30px rgba(0,0,0,0.5)' : 'none';
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────
   7. CURSOR GLOW
───────────────────────────────────────────────────────── */
function initCursorGlow() {
  const g = document.createElement('div');
  g.style.cssText = `
    position:fixed; width:280px; height:280px; border-radius:50%;
    background:radial-gradient(ellipse, rgba(184,48,37,0.055) 0%, transparent 70%);
    pointer-events:none; z-index:0; transform:translate(-50%,-50%);
    transition:opacity 0.4s; opacity:0;
  `;
  document.body.appendChild(g);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    g.style.left = mx + 'px'; g.style.top = my + 'px'; g.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { g.style.opacity = '0'; });
}


/* ─────────────────────────────────────────────────────────
   GLOBAL: NAV MOBILE MENU
───────────────────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}


/* ─────────────────────────────────────────────────────────
   GLOBAL: APP BANNER DISMISS
───────────────────────────────────────────────────────── */
function closeBanner() {
  const b = document.getElementById('appBanner');
  b.style.maxHeight = b.offsetHeight + 'px';
  requestAnimationFrame(() => {
    b.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, padding 0.3s ease';
    b.style.maxHeight  = '0';
    b.style.opacity    = '0';
    b.style.padding    = '0';
    b.style.overflow   = 'hidden';
  });
  setTimeout(() => { b.style.display = 'none'; }, 420);
}


/* ─────────────────────────────────────────────────────────
   HEALTH PANEL
───────────────────────────────────────────────────────── */
let currentPanel = null;

function openHealthPanel(type) {
  const panel   = document.getElementById('healthPanel');
  const content = document.getElementById('healthPanelContent');
  const tpl     = document.getElementById(`tpl-${type}`);

  if (!tpl) return;

  // If same panel clicked again → close it
  if (currentPanel === type && panel.classList.contains('open')) {
    closeHealthPanel();
    return;
  }

  currentPanel = type;
  content.innerHTML = '';
  content.appendChild(tpl.content.cloneNode(true));

  // Highlight active card
  document.querySelectorAll('.health-card').forEach(c => c.style.background = '');
  const labels = { workout: 'WORKOUT', diet: 'DIET', hygiene: 'HYGIENE', sleep: 'SLEEP' };
  document.querySelectorAll('.hc-label').forEach(l => {
    if (l.textContent === labels[type]) {
      l.closest('.health-card').style.background = 'rgba(200,154,40,0.08)';
      l.closest('.health-card').style.borderColor = 'rgba(200,154,40,0.3)';
    }
  });

  panel.classList.add('open');

  // Scroll panel into view
  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function closeHealthPanel() {
  const panel = document.getElementById('healthPanel');
  panel.classList.remove('open');
  document.querySelectorAll('.health-card').forEach(c => {
    c.style.background = '';
    c.style.borderColor = '';
  });
  currentPanel = null;
}


/* ─────────────────────────────────────────────────────────
   GEO: FIND GYMS NEAR ME
───────────────────────────────────────────────────────── */
function findGymsNearMe() {
  if (!navigator.geolocation) {
    // Fallback — open general gym search in Google Maps
    window.open('https://www.google.com/maps/search/gym+near+me/', '_blank');
    return;
  }

  const btn = event.currentTarget;
  const originalHTML = btn.innerHTML;
  btn.querySelector('strong').textContent = 'Getting your location...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const url = `https://www.google.com/maps/search/gym/@${latitude},${longitude},14z/`;
      window.open(url, '_blank');
      btn.querySelector('strong').textContent = '✓ Opened Google Maps';
      setTimeout(() => { btn.querySelector('strong').textContent = 'Find Gyms Near Me'; }, 3000);
    },
    (err) => {
      // Location denied — fallback to generic
      window.open('https://www.google.com/maps/search/gym+near+me/', '_blank');
      btn.querySelector('strong').textContent = 'Find Gyms Near Me';
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}


/* ─────────────────────────────────────────────────────────
   GEO: FIND DIET CENTRES NEAR ME
───────────────────────────────────────────────────────── */
function findDietNearMe() {
  if (!navigator.geolocation) {
    window.open('https://www.google.com/maps/search/nutritionist+dietitian+near+me/', '_blank');
    return;
  }

  const btn = event.currentTarget;
  btn.querySelector('strong').textContent = 'Getting your location...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const url = `https://www.google.com/maps/search/nutritionist+diet+centre/@${latitude},${longitude},14z/`;
      window.open(url, '_blank');
      btn.querySelector('strong').textContent = '✓ Opened Google Maps';
      setTimeout(() => { btn.querySelector('strong').textContent = 'Find Diet Centres Near Me'; }, 3000);
    },
    () => {
      window.open('https://www.google.com/maps/search/nutritionist+dietitian+near+me/', '_blank');
      btn.querySelector('strong').textContent = 'Find Diet Centres Near Me';
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}


/* ─────────────────────────────────────────────────────────
   FEED FILTER
───────────────────────────────────────────────────────── */
function filterFeed(cat, btn) {
  // Update active button
  document.querySelectorAll('.feed-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide cards
  document.querySelectorAll('.feed-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
      // Re-trigger reveal
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
    } else {
      card.classList.add('hidden');
    }
  });
}


/* ─────────────────────────────────────────────────────────
   EMAIL NOTIFY
───────────────────────────────────────────────────────── */
function handleNotify(btn) {
  const input = document.getElementById('emailInput');
  const email = input.value.trim();

  if (!email || !email.includes('@') || !email.includes('.')) {
    input.style.outline = '2px solid var(--red)';
    input.placeholder = 'Enter a valid email';
    setTimeout(() => {
      input.style.outline = '';
      input.placeholder = 'your@email.com';
    }, 2200);
    return;
  }

  btn.textContent = '✓ Done';
  btn.style.background = 'var(--teal)';
  btn.disabled = true;
  input.value = '';
  input.placeholder = "You'll be first to know.";

  // In production: POST to Mailchimp/ConvertKit/etc.
  console.log('[REWIRED] Email signup:', email);
}