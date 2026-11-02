// チェックリストをひとつずつ表示(動きを減らす設定の人にはそのまま表示)
(function () {
  const items = document.querySelectorAll('.check-list li');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  items.forEach((li) => li.classList.add('check-item'));
  const io2 = new IntersectionObserver((entries) => {
    let k = 0;
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--dly', (k++ * 0.3) + 's');
      e.target.classList.add('in');
      io2.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  items.forEach((li) => io2.observe(li));
})();

// 共感パートを一文字ずつ表示(動きを減らす設定の人にはそのまま表示)
(function () {
  const paras = Array.from(document.querySelectorAll('.lead p'));
  if (!paras.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const STEP = 45; // 1文字ごとの間隔(ミリ秒)
  const split = (p) => {
    let n = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          Array.from(child.textContent).forEach((c) => {
            const s = document.createElement('span');
            s.className = 'ch';
            s.style.setProperty('--i', n++);
            s.textContent = c;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          if (child.classList.contains('marker')) child.style.setProperty('--md', (n * STEP) + 'ms');
          walk(child);
        }
      });
    };
    walk(p);
    p.classList.add('typing');
    return n;
  };
  let prev = Promise.resolve();
  paras.forEach((p) => {
    const count = split(p);
    const seen = new Promise((resolve) => {
      const o = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { o.disconnect(); resolve(); }
      }, { threshold: 0.4 });
      o.observe(p);
    });
    prev = Promise.all([prev, seen]).then(() => {
      p.classList.add('on');
      return new Promise((r) => setTimeout(r, count * STEP + 300));
    });
  });
})();

// ファーストビューをゆっくり表示(フォント読み込み後に開始)
const hero = document.querySelector('.hero');
const startHero = () => setTimeout(() => hero.classList.add('is-loaded'), 300);
if (document.fonts && document.fonts.ready) { document.fonts.ready.then(startHero); } else { window.addEventListener('load', startHero); }

// スクロールでふわっと表示
const fades = document.querySelectorAll('.fade, .card, .step, .col-box, .detail');
fades.forEach(el => el.classList.add('fade'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
fades.forEach(el => io.observe(el));

// スマホの追従LINEボタン(ファーストビューを過ぎたら表示)
const floatBtn = document.querySelector('.float-btn');
const toTop = document.querySelector('.to-top');
window.addEventListener('scroll', () => {
  const passed = window.scrollY > window.innerHeight * 0.7;
  floatBtn.classList.toggle('show', passed);
  toTop.classList.toggle('show', passed);
});

// ヘッダー:ページの一番上では透明、スクロールしたら白くする
(function () {
  const header = document.querySelector('.header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ファーストビューの一文を一文字ずつ表示し、光を走らせる
(function () {
  const el = document.querySelector('.hero-lead');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let n = 0;
  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    Array.from(node.textContent).forEach((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', n++);
      s.textContent = c;
      frag.appendChild(s);
    });
    node.replaceWith(frag);
  });
})();
