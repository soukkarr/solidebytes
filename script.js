/* SolideBytes — interactions
   1. The byte (hero)      2. Work slider      3. Block Party screen
   4. Pixel sprite          5. Scroll reveal    */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ───────── 1. The byte ───────── */
(() => {
  const byteEl = $('.byte');
  const bitsOut = $('#readout-bits');
  const charOut = $('#readout-char');
  if (!byteEl) return;

  const WORD = 'SOLIDE';
  let value = WORD.charCodeAt(0);
  let wordIndex = 0;
  let autoplay = !reduceMotion.matches;
  let timer;

  const bits = Array.from({ length: 8 }, (_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'bit';
    b.innerHTML = '<span class="face zero">0</span><span class="face one">1</span>';
    b.addEventListener('click', () => {
      autoplay = false;
      clearTimeout(timer);
      value ^= 1 << (7 - i);
      render();
    });
    byteEl.appendChild(b);
    return b;
  });

  const printable = (v) => (v === 32 ? '␣' : v > 32 && v < 127 ? String.fromCharCode(v) : '·');

  function render(stagger = 0) {
    bits.forEach((b, i) => {
      const on = (value >> (7 - i)) & 1;
      const apply = () => {
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.setAttribute('aria-label', `Bit ${i + 1}, ${on ? 'on' : 'off'}`);
      };
      stagger ? setTimeout(apply, i * stagger) : apply();
    });
    const show = () => {
      bitsOut.textContent = value.toString(2).padStart(8, '0');
      charOut.textContent = printable(value);
      charOut.classList.remove('pop');
      void charOut.offsetWidth;
      charOut.classList.add('pop');
      setTimeout(() => charOut.classList.remove('pop'), 300);
    };
    stagger ? setTimeout(show, 8 * stagger) : show();
  }

  function tick() {
    if (!autoplay) return;
    wordIndex = (wordIndex + 1) % WORD.length;
    value = WORD.charCodeAt(wordIndex);
    render(55);
    timer = setTimeout(tick, 1900);
  }

  render();
  if (autoplay) timer = setTimeout(tick, 1600);

  // pause the loop when the hero is off-screen
  new IntersectionObserver(([e]) => {
    clearTimeout(timer);
    if (e.isIntersecting && autoplay) timer = setTimeout(tick, 1200);
  }).observe(byteEl);
})();

/* ───────── 2. Work slider ───────── */
(() => {
  const section = $('#work');
  const track = $('#track');
  if (!section || !track) return;

  const slides = $$('.slide', track);
  const phones = slides.map((s) => $('.phone', s));
  const n = slides.length;
  section.style.setProperty('--n', n);
  $('#work-total').textContent = n;

  const progressEl = $('.work-progress');
  const dots = slides.map(() => progressEl.appendChild(document.createElement('i')));
  const indexOut = $('#work-index');
  const prev = $('#prev');
  const next = $('#next');

  const pinnedMQ = matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
  let active = -1;

  function setActive(i) {
    if (i === active) return;
    active = i;
    indexOut.textContent = i + 1;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    section.style.setProperty('--tint', slides[i].dataset.tint);
    prev.disabled = i === 0;
    next.disabled = i === n - 1;
    slides.forEach((s, k) => s.setAttribute('aria-hidden', pinnedMQ.matches && k !== i ? 'true' : 'false'));
    slides.forEach((s, k) => $$('a, button', s).forEach((el) => (el.tabIndex = pinnedMQ.matches && k !== i ? -1 : 0)));
  }

  // Pinned mode: vertical scroll drives the horizontal track
  function onScroll() {
    if (!pinnedMQ.matches) return;
    const rect = section.getBoundingClientRect();
    const total = rect.height - innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / total));
    const pos = p * (n - 1);
    track.style.transform = `translate3d(${-pos * innerWidth}px,0,0)`;
    phones.forEach((ph, i) => {
      const d = i - pos;
      ph.style.setProperty('--rot', `${(d * 9).toFixed(2)}deg`);
      ph.style.setProperty('--lift', `${(Math.abs(d) * 60).toFixed(1)}px`);
    });
    setActive(Math.round(pos));
  }

  // Swipe mode: native horizontal scroll
  function onTrackScroll() {
    if (pinnedMQ.matches) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  function go(i) {
    i = Math.max(0, Math.min(n - 1, i));
    if (pinnedMQ.matches) {
      const top = section.offsetTop + (i / (n - 1)) * (section.offsetHeight - innerHeight);
      scrollTo({ top, behavior: 'smooth' });
    } else {
      track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  prev.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));

  // Arrow keys while the work section fills the screen
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;
    const r = section.getBoundingClientRect();
    if (r.top > innerHeight / 2 || r.bottom < innerHeight / 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  });

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  track.addEventListener('scroll', onTrackScroll, { passive: true });
  addEventListener('resize', onScroll);
  pinnedMQ.addEventListener('change', () => {
    track.style.transform = '';
    phones.forEach((ph) => { ph.style.removeProperty('--rot'); ph.style.removeProperty('--lift'); });
    active = -1;
    pinnedMQ.matches ? onScroll() : onTrackScroll();
  });

  setActive(0);
  onScroll();
})();

/* ───────── 3. Block Party mini-board ───────── */
(() => {
  const grid = $('#block-grid');
  if (!grid) return;
  const colors = ['#FFB020', '#E5484D', '#2B59F0', '#1F9E6A', '#7B5CFA', '#2BC4E8'];
  const cols = 6, rows = 9;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = document.createElement('span');
      const filled = r > 3 && Math.random() > (r > 6 ? 0.1 : 0.45);
      paint(s, filled);
      grid.appendChild(s);
      cells.push(s);
    }
  }
  function paint(s, filled) {
    s.className = filled ? 'fill' : 'empty';
    s.style.background = filled ? colors[(Math.random() * colors.length) | 0] : '';
  }
  if (reduceMotion.matches) return;
  setInterval(() => {
    const s = cells[(rows - 5) * cols + ((Math.random() * cols * 5) | 0)];
    s.classList.add('pop');
    setTimeout(() => { paint(s, true); }, 380);
  }, 650);
})();

/* ───────── 4. Pixel sprite (an original little hopper) ───────── */
(() => {
  const el = $('#sprite');
  if (!el) return;
  const map = [
    '..aaaa..',
    '.aaaaaa.',
    'aawaawaa',
    'aakaakaa',
    'aaaaaaaa',
    'aaappaaa',
    '.aaaaaa.',
    '.b....b.',
  ];
  const pal = { a: '#FFB020', w: '#FFFFFF', k: '#120C2A', p: '#E5484D', b: '#B06A00', '.': 'transparent' };
  el.innerHTML = map.join('').split('').map((ch) => `<i style="background:${pal[ch]}"></i>`).join('');
})();

/* ───────── 5. Scroll reveal + footer year ───────── */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
  $$('.yr').forEach((el) => (el.textContent = new Date().getFullYear()));
})();
