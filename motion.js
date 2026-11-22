/* ============================================================
   Dearest — motion layer  /  vanilla, zero dependencies
   Native re-imagining of several ReactBits ideas:
     Aurora · Silk          → drifting soft-light blobs (canvas)
     DotGrid                → pointer-reactive dot field (CSS + canvas halo)
     ClickSpark             → starburst particles (canvas)
     RippleGrid             → click ripple ring (canvas)
     BlurText / SplitText   → per-character blur-in (DOM)
     ScrollReveal           → staggered fade-up (IntersectionObserver)
     TiltedCard / GlareHover→ 3D tilt + cursor spotlight (DOM)
     Magnet                 → magnetic CTA pull (DOM)

   Performance: low DPR, ~22fps cap, no full-screen texture copy per
   frame, lighter effects on touch/small screens, paused when hidden.
   ============================================================ */
(function () {
'use strict';

var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
var lite = window.innerWidth < 760 || coarse;
var canvas = document.getElementById('fx');
var ctx = canvas && canvas.getContext('2d', { alpha: true });
var glowEl = document.getElementById('cursorGlow');
var W = 0, H = 0, DPR = 1;
var mouse = { x: -9999, y: -9999, inside: false };
var particles = [], ripples = [];
var last = 0, clock = 0, running = true, paused = false;
var frameGap = lite ? 60 : (reduce ? 200 : 45);
var dotGap = 42;

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

/* ---------- soft light sprites (Aurora / Silk) ---------- */
function glow(color, size) {
  var c = document.createElement('canvas');
  c.width = c.height = size;
  var g = c.getContext('2d');
  var rg = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  rg.addColorStop(0, color);
  rg.addColorStop(.45, color.replace(/[\d.]+\)$/, '.10)'));
  rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, size, size);
  return c;
}
var blobs = [
  { s: glow('rgba(198,190,225,.30)', 460), px: .14, py: .14, ax: .11, ay: .07, sx: .000071, sy: .000053, ph: 0.0, a: .9 },
  { s: glow('rgba(190,222,168,.30)', 420), px: .84, py: .24, ax: .10, ay: .11, sx: .000049, sy: .000077, ph: 1.9, a: .85 },
  { s: glow('rgba(169,194,230,.25)', 480), px: .50, py: .86, ax: .16, ay: .09, sx: .000061, sy: .000043, ph: 3.4, a: .8 }
];

function resize() {
  if (!canvas || !ctx) return;
  DPR = lite ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

/* ---------- main loop ---------- */
function frame(ts) {
  requestAnimationFrame(frame);
  if (!running || paused || !ctx) return;
  if (ts - last < frameGap) return;
  var dt = Math.min(ts - last, 90); last = ts;
  clock += reduce ? 0 : dt;

  ctx.clearRect(0, 0, W, H);

  /* drifting aurora — skipped on phones / coarse pointers */
  if (!reduce && !lite) {
    blobs.forEach(function (b) {
      var cx = (b.px + Math.sin(clock * b.sx + b.ph) * b.ax) * W;
      var cy = (b.py + Math.cos(clock * b.sy + b.ph) * b.ay) * H;
      var s = b.s.width;
      ctx.globalAlpha = b.a;
      ctx.drawImage(b.s, cx - s / 2, cy - s / 2);
    });
    ctx.globalAlpha = 1;

    /* dot grid halo — only the dots near the pointer are redrawn */
    if (mouse.inside) {
      var R = 150;
      var x0 = Math.floor((mouse.x - R) / dotGap) * dotGap + dotGap / 2;
      var y0 = Math.floor((mouse.y - R) / dotGap) * dotGap + dotGap / 2;
      for (var y = y0; y < mouse.y + R; y += dotGap) {
        for (var x = x0; x < mouse.x + R; x += dotGap) {
          var d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d > R) continue;
          var k = 1 - d / R;
          ctx.fillStyle = 'rgba(92,122,24,' + (k * .5).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(x, y, 1.1 + k * 2.4, 0, 6.283); ctx.fill();
        }
      }
    }
  }

  /* click ripples */
  for (var i = ripples.length - 1; i >= 0; i--) {
    var rp = ripples[i]; rp.r += dt * .16; rp.life -= dt;
    if (rp.life <= 0) { ripples.splice(i, 1); continue; }
    var a = clamp(rp.life / 620, 0, 1) * .5;
    ctx.strokeStyle = 'rgba(92,122,24,' + a.toFixed(3) + ')';
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, 6.283); ctx.stroke();
    ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * .62, 0, 6.283); ctx.stroke();
  }

  /* click spark particles */
  for (var j = particles.length - 1; j >= 0; j--) {
    var p = particles[j];
    p.life -= dt;
    if (p.life <= 0) { particles.splice(j, 1); continue; }
    p.x += p.vx * dt * .06; p.y += p.vy * dt * .06;
    p.vy += dt * .00035; p.rot += p.vr * dt * .06;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    if (p.star) {
      ctx.beginPath();
      for (var k2 = 0; k2 < 8; k2++) {
        var rr = k2 % 2 ? p.size * .34 : p.size;
        var ang = k2 * Math.PI / 4 - Math.PI / 2;
        var px = Math.cos(ang) * rr, py = Math.sin(ang) * rr;
        k2 ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, 0, p.size * .5, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

/* ---------- public spark / burst ---------- */
var palette = ['#c8ee7a', '#fffef8', '#c6bede', '#a9c2e6', '#f2c8d8'];
function burst(x, y, count, opts) {
  if (reduce) return;
  opts = opts || {};
  var n = Math.round((count || 10) * (lite ? .5 : 1));
  for (var i = 0; i < n; i++) {
    var a = Math.random() * 6.283, sp = (opts.speed || 1) * (.6 + Math.random() * 1.5);
    var life = 420 + Math.random() * 480;
    particles.push({
      x: x + (Math.random() - .5) * 14, y: y + (Math.random() - .5) * 14,
      vx: Math.cos(a) * sp * 2.4, vy: Math.sin(a) * sp * 2.4 - .5,
      size: 2.6 + Math.random() * 4.2, rot: Math.random() * 6.283,
      vr: (Math.random() - .5) * .012,
      color: (opts.colors || palette)[i % (opts.colors || palette).length],
      star: Math.random() > .35, life: life, max: life
    });
  }
  var cap = lite ? 70 : 160;
  if (particles.length > cap) particles.splice(0, particles.length - cap);
}
function ripple(x, y) { if (!reduce) ripples.push({ x: x, y: y, r: 4, life: 620 }); }

/* ---------- BlurText / SplitText ---------- */
function splitText(el) {
  if (!el || el.dataset.splitDone === '1') return;
  var raw = el.getAttribute('data-raw');
  if (raw === null) { raw = el.textContent; el.setAttribute('data-raw', raw); }
  var chars = Array.from(raw);
  var frag = document.createDocumentFragment();
  chars.forEach(function (ch, i) {
    var s = document.createElement('span');
    s.className = 'ch';
    s.style.setProperty('--i', i);
    s.textContent = ch === ' ' ? '\u00a0' : ch;
    frag.appendChild(s);
  });
  el.textContent = ''; el.appendChild(frag);
  el.dataset.splitDone = '1';
}
function resetSplit(el) {
  if (!el) return;
  var raw = el.getAttribute('data-raw');
  if (raw === null) return;
  el.textContent = raw;
  el.dataset.splitDone = '';
}

/* ---------- ScrollReveal ---------- */
var io = null;
if ('IntersectionObserver' in window) {
  io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: .06, rootMargin: '0px 0px -30px 0px' });
}

function reveal(root) {
  if (!root) return;
  $$('[data-split]', root).forEach(function (el) {
    resetSplit(el);
    el.classList.remove('split-run');
    splitText(el);
    el.classList.add('split-run');
  });
  $$('[data-reveal]', root).forEach(function (el) {
    el.classList.remove('revealed');
    if (io) { io.unobserve(el); io.observe(el); }
    else el.classList.add('revealed');
  });
}

/* ---------- TiltedCard + GlareHover ---------- */
function bindTilt(el) {
  if (el.dataset.tiltBound) return;
  el.dataset.tiltBound = '1';
  var queued = false, pe = null;
  el.addEventListener('pointermove', function (e) {
    if (reduce || e.pointerType === 'touch' || lite) return;
    pe = e;
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      if (!pe) return;
      var r = el.getBoundingClientRect();
      var px = (pe.clientX - r.left) / r.width, py = (pe.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      el.style.setProperty('--ry', ((px - .5) * 9).toFixed(2) + 'deg');
      el.style.setProperty('--rx', ((.5 - py) * 7).toFixed(2) + 'deg');
    });
  });
  el.addEventListener('pointerleave', function () {
    el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg');
  });
}

/* ---------- Magnet ---------- */
function bindMagnet(el) {
  if (el.dataset.magnetBound) return;
  el.dataset.magnetBound = '1';
  var strength = 0.28, radius = 110;
  el.addEventListener('pointermove', function (e) {
    if (reduce || e.pointerType === 'touch' || lite) return;
    var r = el.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < radius) el.style.transform = 'translate(' + (dx * strength).toFixed(1) + 'px,' + (dy * strength).toFixed(1) + 'px)';
  });
  el.addEventListener('pointerleave', function () { el.style.transform = ''; });
}

function scan() {
  $$('[data-tilt]').forEach(bindTilt);
  $$('[data-magnet]').forEach(bindMagnet);
}

/* re-run reveals when a screen becomes active — coalesced into one frame so
   a screen switch never causes a dozen synchronous reflows */
var pending = ('Set' in window) ? new Set() : [];
var moRaf = 0;
function queueReveal(el) {
  if (pending.add) pending.add(el);
  else if (pending.indexOf(el) < 0) pending.push(el);
  if (moRaf) return;
  moRaf = requestAnimationFrame(function () {
    moRaf = 0;
    var list = pending.add ? Array.from(pending) : pending.slice();
    if (pending.clear) pending.clear(); else pending.length = 0;
    list.forEach(function (s) { if (s.classList.contains('active')) reveal(s); });
  });
}
if ('MutationObserver' in window) {
  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      if (m.target.classList && m.target.classList.contains('active')) queueReveal(m.target);
    });
  });
  $$('.screen').forEach(function (s) { mo.observe(s, { attributes: true, attributeFilter: ['class'] }); });
}

/* ---------- events ---------- */
window.addEventListener('resize', resize, { passive: true });
var moveRaf = 0, mx = 0, my = 0;
window.addEventListener('pointermove', function (e) {
  mx = e.clientX; my = e.clientY;
  mouse.x = mx; mouse.y = my; mouse.inside = true;
  if (moveRaf) return;
  moveRaf = requestAnimationFrame(function () {
    moveRaf = 0;
    if (glowEl) glowEl.style.transform = 'translate3d(' + (mx - 180) + 'px,' + (my - 180) + 'px,0)';
  });
}, { passive: true });
document.addEventListener('pointerleave', function () { mouse.inside = false; });
document.addEventListener('pointerdown', function (e) {
  if (e.target.closest && e.target.closest('.lightbox')) return;
  burst(e.clientX, e.clientY, 9);
  ripple(e.clientX, e.clientY);
}, { passive: true });
document.addEventListener('visibilitychange', function () { running = !document.hidden; });

/* ---------- boot ---------- */
resize();
scan();
reveal(document.querySelector('.screen.active'));
requestAnimationFrame(frame);

window.MB = {
  burst: burst, ripple: ripple, reveal: reveal, scan: scan, reduce: reduce,
  pause: function (v) { paused = !!v; }
};
})();
