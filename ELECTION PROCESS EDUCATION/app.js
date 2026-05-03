/* global gsap, ScrollTrigger */
'use strict';

// ══════════════════════════════════════════════════════════
//  ANTI-GRAVITY ELECTION EXPLAINER — APP.JS
// ══════════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ── UTILS ──────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

// ── STATE ──────────────────────────────────────────────────
let audioPlaying = false;
let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── AUDIO ──────────────────────────────────────────────────
const audio = document.getElementById('space-audio');
const audioBtn = document.getElementById('audio-toggle');

audio.volume = 0.18;

function startAudio() {
  if (audioPlaying) return;
  audio.play().then(() => {
    audioPlaying = true;
    audioBtn.classList.remove('muted');
  }).catch(() => {});
}

audioBtn.addEventListener('click', () => {
  if (audioPlaying) {
    audio.pause();
    audioPlaying = false;
    audioBtn.classList.add('muted');
  } else {
    startAudio();
  }
});

// Auto-start on first user interaction
document.addEventListener('scroll', startAudio, { once: true });
document.addEventListener('click', startAudio, { once: true });

// ── REDUCE MOTION TOGGLE ───────────────────────────────────
const motionBtn = document.getElementById('reduce-motion-toggle');
motionBtn.addEventListener('click', () => {
  reduceMotion = !reduceMotion;
  document.body.classList.toggle('reduce-motion', reduceMotion);
  motionBtn.title = reduceMotion ? 'Enable animations' : 'Reduce motion';
});

// ── SCROLL PROGRESS ───────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
  progressBar.setAttribute('aria-valuenow', Math.round(pct));
});

// ── NAV ACTIVE STATE ──────────────────────────────────────
const scenes = document.querySelectorAll('.scene');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.5 });
scenes.forEach(s => observer.observe(s));

// ── CAPTION BAR ───────────────────────────────────────────
const captionBar = document.getElementById('caption-bar');
const captions = {
  scene1: '🌍 Scene 1 — Earth is the foundation of democracy.',
  scene2: '🧑‍🚀 Scene 2 — Every citizen rises equally as a voter.',
  scene3: '🗳️ Scene 3 — Votes orbit the ballot system equally.',
  scene4: '⚖️ Scene 4 — Corruption pulls votes down. Fairness lifts them up.',
  scene5: '📦 Scene 5 — Every vote is counted equally.',
  scene6: '📊 Scene 6 — Results reflect the people\'s true choice.',
  'scene-final': '✨ Democracy works best when nothing pulls your vote down.',
};
let captionTimer;
const captionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && captions[e.target.id]) {
      captionBar.textContent = captions[e.target.id];
      captionBar.classList.remove('hidden');
      clearTimeout(captionTimer);
      captionTimer = setTimeout(() => captionBar.classList.add('hidden'), 5000);
    }
  });
}, { threshold: 0.4 });
scenes.forEach(s => captionObserver.observe(s));

// ── PARALLAX ─────────────────────────────────────────────
document.querySelectorAll('.parallax-bg').forEach(bg => {
  const scene = bg.closest('.scene');
  window.addEventListener('scroll', () => {
    if (reduceMotion) return;
    const rect = scene.getBoundingClientRect();
    const offset = rect.top * 0.3;
    bg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
});

// ══════════════════════════════════════════════════════════
//  SCENE 1 — STAR CANVAS
// ══════════════════════════════════════════════════════════
const starCanvas = document.getElementById('star-canvas');
const ctx = starCanvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    speed: Math.random() * 0.005 + 0.002,
    drift: Math.random() * 0.3 - 0.15,
  });
}

function drawStars() {
  ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => {
    s.a += s.speed;
    s.x += s.drift;
    if (s.x > starCanvas.width) s.x = 0;
    if (s.x < 0) s.x = starCanvas.width;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.6 * Math.abs(Math.sin(s.a))})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// Scene1 floating micro-particles
const s1particles = document.getElementById('scene1-particles');
for (let i = 0; i < 25; i++) {
  const d = document.createElement('div');
  d.style.cssText = `
    position:absolute;width:${rand(2,5)}px;height:${rand(2,5)}px;border-radius:50%;
    background:rgba(0,212,255,${rand(0.3,0.8)});
    left:${rand(0,100)}%;top:${rand(10,90)}%;
    animation:floatSmooth ${rand(4,9)}s ease-in-out ${rand(0,5)}s infinite alternate;
    box-shadow:0 0 ${rand(4,12)}px rgba(0,212,255,0.7);
  `;
  s1particles.appendChild(d);
}

// ══════════════════════════════════════════════════════════
//  SCENE 2 — FLOATING CITIZENS
// ══════════════════════════════════════════════════════════
const citizenField = document.getElementById('citizen-field');
const NUM_CITIZENS = 48;
let citizenCount = 0;

function spawnCitizen() {
  const img = document.createElement('img');
  img.src = 'user.svg';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.className = 'citizen-icon';
  const size = randInt(20, 42);
  const dur = rand(6, 16);
  const delay = rand(0, 8);
  const hue = randInt(170, 260);
  img.style.cssText = `
    left:${rand(2,95)}%;
    bottom:${rand(-10,10)}%;
    width:${size}px; height:${size}px;
    animation-duration:${dur}s;
    animation-delay:${delay}s;
    filter:invert(1) sepia(1) saturate(${rand(2,5)}) hue-rotate(${hue}deg) brightness(${rand(1.2,2)});
  `;
  citizenField.appendChild(img);
}
for (let i = 0; i < NUM_CITIZENS; i++) spawnCitizen();

// Animate count-up
ScrollTrigger.create({
  trigger: '#scene2',
  start: 'top 70%',
  onEnter: () => {
    const el = document.getElementById('count-citizens');
    let n = 0;
    const target = NUM_CITIZENS;
    const step = () => { if (n < target) { n++; el.textContent = n; requestAnimationFrame(step); } };
    step();
  }
});

// ══════════════════════════════════════════════════════════
//  SCENE 3 — ORBIT SYSTEM
// ══════════════════════════════════════════════════════════
const orbitsContainer = document.getElementById('orbits-container');
const orbitSizes = [130, 190, 250, 310];
const votesPerOrbit = [4, 6, 8, 10];

orbitSizes.forEach((size, i) => {
  // orbit path ring
  const ring = document.createElement('div');
  ring.className = 'orbit-path';
  ring.style.cssText = `width:${size*2}px;height:${size*2}px;margin-left:-${size}px;margin-top:-${size}px;`;
  orbitsContainer.appendChild(ring);

  // orbit group that rotates
  const group = document.createElement('div');
  group.style.cssText = `
    position:absolute;width:${size*2}px;height:${size*2}px;
    top:50%;left:50%;margin:-${size}px 0 0 -${size}px;
    animation:orbitSpin ${14 + i*8}s linear infinite ${i%2===0?'':'reverse'};
  `;
  const count = votesPerOrbit[i];
  for (let j = 0; j < count; j++) {
    const angle = (j / count) * Math.PI * 2;
    const x = size + size * Math.cos(angle) - 11;
    const y = size + size * Math.sin(angle) - 11;
    const vp = document.createElement('img');
    vp.src = 'user.svg';
    vp.alt = '';
    vp.setAttribute('aria-hidden', 'true');
    vp.className = 'vote-particle';
    vp.style.cssText = `left:${x}px;top:${y}px;`;
    group.appendChild(vp);
  }
  orbitsContainer.appendChild(group);
});

// ══════════════════════════════════════════════════════════
//  SCENE 4 — FALLING + RISING VOTES
// ══════════════════════════════════════════════════════════
const fallingVotes = document.getElementById('falling-votes');
const risingVotes = document.getElementById('rising-votes');

for (let i = 0; i < 18; i++) {
  const fp = document.createElement('img');
  fp.src = i % 2 === 0 ? 'user.svg' : 'money.svg';
  fp.alt = '';
  fp.setAttribute('aria-hidden', 'true');
  fp.className = 'fall-particle';
  fp.style.cssText = `left:${rand(5,88)}%;animation-duration:${rand(2.5,5)}s;animation-delay:${rand(0,4)}s;`;
  fallingVotes.appendChild(fp);
}

for (let i = 0; i < 20; i++) {
  const rp = document.createElement('img');
  rp.src = i % 3 === 0 ? 'ballot.svg' : 'user.svg';
  rp.alt = '';
  rp.setAttribute('aria-hidden', 'true');
  rp.className = 'rise-particle';
  rp.style.cssText = `left:${rand(5,88)}%;bottom:0;animation-duration:${rand(2,4.5)}s;animation-delay:${rand(0,4)}s;`;
  risingVotes.appendChild(rp);
}

// ══════════════════════════════════════════════════════════
//  SCENE 5 — VOTE FUNNEL + COUNTER
// ══════════════════════════════════════════════════════════
const voteFunnel = document.getElementById('vote-funnel');
const voteCountEl = document.getElementById('vote-count-display');

for (let i = 0; i < 14; i++) {
  const fv = document.createElement('img');
  fv.src = i % 2 === 0 ? 'user.svg' : 'ballot.svg';
  fv.alt = '';
  fv.setAttribute('aria-hidden', 'true');
  fv.className = 'funnel-vote';
  const xOff = rand(-80, 80);
  fv.style.cssText = `
    left:50%;margin-left:-10px;
    --fx:${xOff}px;
    animation-duration:${rand(1.8,3.5)}s;
    animation-delay:${rand(0,5)}s;
    filter:invert(1) sepia(1) saturate(3) hue-rotate(${randInt(160,250)}deg) brightness(2) drop-shadow(0 0 6px #00D4FF);
  `;
  voteFunnel.appendChild(fv);
}

ScrollTrigger.create({
  trigger: '#scene5',
  start: 'top 65%',
  onEnter: () => {
    let v = 0;
    const target = 847;
    const duration = 2200;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      v = Math.round(eased * target);
      voteCountEl.textContent = v.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
});

// ══════════════════════════════════════════════════════════
//  SCENE 6 — BAR CHART ANIMATION + PARTICLES
// ══════════════════════════════════════════════════════════
const barItems = document.querySelectorAll('.bar-item');
const resultParticles = document.getElementById('result-particles');

barItems.forEach(item => {
  const fill = item.querySelector('.bar-fill');
  const color = item.dataset.color;
  fill.style.background = `linear-gradient(to top, ${color}, ${color}88)`;
  fill.style.boxShadow = `0 0 20px ${color}66`;
});

ScrollTrigger.create({
  trigger: '#scene6',
  start: 'top 65%',
  onEnter: () => {
    barItems.forEach((item, i) => {
      const fill = item.querySelector('.bar-fill');
      const value = item.dataset.value;
      setTimeout(() => {
        fill.style.height = `${value * 2.5}px`;
      }, i * 180);
    });

    // spawn result particles
    const colors = ['#00D4FF', '#7B61FF', '#00FFB3', '#FF6B9D', '#FFD700'];
    for (let i = 0; i < 40; i++) {
      const rp = document.createElement('div');
      rp.className = 'result-p';
      rp.style.cssText = `
        left:${rand(5,95)}%;bottom:${rand(0,40)}%;
        background:${colors[randInt(0,colors.length)]};
        width:${rand(4,9)}px;height:${rand(4,9)}px;
        animation-duration:${rand(1.5,3.5)}s;
        animation-delay:${rand(0,3)}s;
        box-shadow:0 0 8px currentColor;
      `;
      resultParticles.appendChild(rp);
    }
  }
});

// ══════════════════════════════════════════════════════════
//  FINALE — QUOTE ANIMATION + CELEBRATION PARTICLES
// ══════════════════════════════════════════════════════════
const quoteLines = document.querySelectorAll('.quote-line');
const finaleParticles = document.getElementById('finale-particles');

ScrollTrigger.create({
  trigger: '#scene-final',
  start: 'top 70%',
  onEnter: () => {
    quoteLines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), i * 350);
    });

    // celebration particles
    const cols = ['#00D4FF','#7B61FF','#FFD700','#FF6B9D','#00FFB3','#ffffff'];
    for (let i = 0; i < 60; i++) {
      const fp = document.createElement('div');
      const col = cols[randInt(0, cols.length)];
      fp.style.cssText = `
        position:absolute;
        left:${rand(2,98)}%;top:${rand(10,90)}%;
        width:${rand(3,7)}px;height:${rand(3,7)}px;
        border-radius:50%;background:${col};
        box-shadow:0 0 10px ${col};
        animation:resultRise ${rand(2,5)}s linear ${rand(0,4)}s infinite;
      `;
      finaleParticles.appendChild(fp);
    }
  }
});

// ══════════════════════════════════════════════════════════
//  GSAP SCROLL ANIMATIONS (fade-in per scene)
// ══════════════════════════════════════════════════════════
const fadeTargets = [
  { el: '.scene1-text', x: -60 },
  { el: '.earth-container', x: 60 },
  { el: '.scene2-text', x: -60 },
  { el: '.scene3-text', x: 60 },
  { el: '.orbit-system', x: -60 },
  { el: '.scene4-header', y: -40 },
  { el: '.split-corruption', x: -60 },
  { el: '.split-fair', x: 60 },
  { el: '.scene5-text', x: -60 },
  { el: '.ballot-stage', x: 60 },
  { el: '.scene6-header', y: -40 },
  { el: '.bar-chart', y: 60 },
  { el: '.finale-earth-wrap', scale: 0.7 },
  { el: '.finale-quote', y: 50 },
  { el: '.finale-sub', y: 30 },
  { el: '.btn-restart', y: 30 },
];

fadeTargets.forEach(({ el, x = 0, y = 30, scale = 1 }) => {
  const elements = document.querySelectorAll(el);
  elements.forEach(elem => {
    gsap.fromTo(elem,
      { opacity: 0, x, y, scale },
      {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
});

// ── CORRUPTION SIDE SHAKE INTENSIFY ON SCROLL ────────────
ScrollTrigger.create({
  trigger: '#scene4',
  start: 'top 60%',
  end: 'bottom 40%',
  onEnter: () => {
    gsap.to('.corr-icon', { filter: 'invert(1) sepia(1) saturate(8) hue-rotate(310deg) brightness(1.5) drop-shadow(0 0 12px #FF3B5C)', duration: 0.8 });
  },
  onLeave: () => {
    gsap.to('.corr-icon', { filter: 'invert(1) sepia(1) saturate(5) hue-rotate(310deg) brightness(1.2)', duration: 0.5 });
  }
});

// ── BALLOT ICON LIGHT BURST TRIGGER ──────────────────────
ScrollTrigger.create({
  trigger: '#scene5',
  start: 'top 60%',
  onEnter: () => {
    gsap.fromTo('#big-ballot',
      { scale: 0.4, opacity: 0, rotation: -20 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'back.out(2)' }
    );
  }
});

console.log('%c⚡ AntiGravity Election Explainer Loaded', 'color:#00D4FF;font-weight:bold;font-size:14px;');
