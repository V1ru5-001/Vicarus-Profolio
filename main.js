/* ═══════════════════════════════════════════
   Rex Nwogbo — portfolio
   Requires: GSAP, ScrollTrigger, Lenis (all optional —
   the page degrades to static if any fail to load)
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* current year in footer */
  var yr = $('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ───────────────────────────────────────────
     PRELOADER
     Tracks real load signals. Fails open — three
     independent escapes so nobody gets stranded.
     ─────────────────────────────────────────── */
  function initPreloader(onDone) {
    var pre = $('pre');
    if (!pre) { onDone(); return; }

    var fill = $('preFill'), pct = $('prePct'),
        msg = $('preMsg'), word = $('preWord'), bars = $('preBars');
    var done = false, shown = 0, target = 0;
    var glitchInt, wordInt;

    function release(instant) {
      if (done) return;
      done = true;
      clearInterval(glitchInt);
      clearInterval(wordInt);
      if (word) { word.textContent = 'READY'; word.setAttribute('data-t', 'READY'); }
      if (fill) fill.style.width = '100%';
      if (pct) pct.textContent = '100%';
      if (msg) msg.textContent = 'ready';
      document.body.classList.remove('booting');

      var shutters = document.querySelectorAll('.shut');
      if (instant || typeof gsap === 'undefined') {
        pre.style.display = 'none';
        Array.prototype.forEach.call(shutters, function (s) { s.style.display = 'none'; });
        onDone();
        return;
      }
      gsap.timeline()
        .to(pre, { opacity: 0, duration: .28, delay: .22 })
        .set(pre, { display: 'none' })
        .to('.shut.t', { yPercent: -100, duration: .7, ease: 'expo.inOut' }, 0.3)
        .to('.shut.b', { yPercent: 100, duration: .7, ease: 'expo.inOut' }, 0.3)
        .set('.shut', { display: 'none' })
        .add(onDone);
    }

    /* never strand the visitor */
    window.addEventListener('error', function () { release(true); });

    if (RM) { release(true); return; }

    function bump(to, label) {
      target = Math.max(target, to);
      if (label && msg) msg.textContent = label;
    }

    (document.fonts ? document.fonts.ready : Promise.resolve())
      .then(function () { bump(0.35, 'loading fonts'); });

    if (document.readyState === 'complete') bump(0.70, 'compiling scene');
    else window.addEventListener('load', function () { bump(0.70, 'compiling scene'); });

    setTimeout(function () { bump(0.70, 'compiling scene'); }, 1200);
    setTimeout(function () { bump(1, 'ready'); }, 1900);
    setTimeout(function () { release(); }, 5000);

    /* tear bars across the word */
    function tearPre() {
      if (!bars) return;
      var n = 2 + Math.floor(Math.random() * 3);
      for (var i = 0; i < n; i++) {
        var b = document.createElement('div');
        b.style.cssText = 'top:' + (Math.random() * 100) + '%;height:' +
          (3 + Math.random() * 12) + '%;transform:translateX(' +
          ((Math.random() - .5) * 80) + 'px)';
        bars.appendChild(b);
        (function (el) { setTimeout(function () { el.remove(); }, 70 + Math.random() * 60); })(b);
      }
    }

    glitchInt = setInterval(function () {
      pre.classList.add('hit');
      tearPre();
      setTimeout(function () { pre.classList.remove('hit'); }, 90);
    }, 420);

    var CHR = '!<>-_/[]{}=+*^?#%01';
    wordInt = setInterval(function () {
      if (shown > 0.92 || !word) return;
      word.textContent = 'LOADING'.split('').map(function (c) {
        return Math.random() > 0.72 ? CHR[(Math.random() * CHR.length) | 0] : c;
      }).join('');
    }, 90);

    (function tick() {
      if (done) return;
      shown += (target - shown) * 0.08;
      var v = Math.min(100, Math.round(shown * 100));
      if (fill) fill.style.width = v + '%';
      if (pct) pct.textContent = v + '%';
      if (shown > 0.985 && target >= 1) { release(); return; }
      requestAnimationFrame(tick);
    })();
  }

  /* ───────────────────────────────────────────
     MAIN
     ─────────────────────────────────────────── */
  function init() {
    if (typeof gsap === 'undefined') {
      document.body.classList.remove('booting');
      return;
    }
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    /* smooth scroll */
    if (!RM && typeof Lenis !== 'undefined') {
      var lenis = new Lenis({ lerp: .085 });
      if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* hero entrance — paused until preloader clears */
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true });
    tl.from('.topline>*', { y: 14, opacity: 0, duration: .7, stagger: .07 })
      .from('.cmd', { opacity: 0, duration: .4 }, '-=.3')
      .from('.ln>span', { yPercent: 112, duration: 1, stagger: .08 }, '-=.2')
      .from('.lede p', { x: -18, opacity: 0, duration: .7, stagger: .09 }, '-=.55')
      .from('.meta div', { y: 14, opacity: 0, duration: .6, stagger: .08 }, '-=.55')
      .from('.tick', { opacity: 0, duration: .5 }, '-=.45');

    initPreloader(function () { tl.play(); });

    if (!RM) gsap.to('.caret', { opacity: 0, repeat: -1, yoyo: true, duration: .5, ease: 'steps(1)' });

    /* ── glitch bursts ── */
    var head = $('head');
    var bursting = false;

    function tear() {
      if (!head) return;
      var lines = head.querySelectorAll('.ln');
      Array.prototype.forEach.call(lines, function (l) {
        var n = 2 + Math.floor(Math.random() * 3);
        for (var i = 0; i < n; i++) {
          var bar = document.createElement('div');
          bar.className = 'slice';
          bar.style.cssText = 'display:block;top:' + (Math.random() * 100) + '%;height:' +
            (4 + Math.random() * 14) + '%;background:var(--void);transform:translateX(' +
            ((Math.random() - .5) * 70) + 'px)';
          l.appendChild(bar);
          (function (el) { gsap.to(el, { duration: .09, onComplete: function () { el.remove(); } }); })(bar);
        }
      });
    }

    if (!RM && head) {
      (function burst() {
        bursting = true;
        head.classList.add('hit');
        tear();
        gsap.to('#burn', { opacity: .35, duration: .05, yoyo: true, repeat: 1 });
        gsap.to('#screen', {
          x: gsap.utils.random(-8, 8), skewX: gsap.utils.random(-1.6, 1.6),
          duration: .055, repeat: 3, yoyo: true,
          onComplete: function () {
            gsap.set('#screen', { x: 0, skewX: 0 });
            head.classList.remove('hit');
            bursting = false;
          }
        });
        gsap.delayedCall(gsap.utils.random(1.4, 3.6), burst);
      })();

      /* micro-jitter so it never sits still */
      var scr = $('screen'), jit = 0;
      gsap.ticker.add(function () {
        if (bursting) return;
        if (jit > 0) { jit--; if (jit === 0) gsap.set(scr, { x: 0 }); return; }
        if (Math.random() > 0.982) { gsap.set(scr, { x: (Math.random() - .5) * 2.4 }); jit = 3; }
      });

      gsap.fromTo('#roll', { top: '-120px' }, { top: '100%', duration: 5.5, repeat: -1, ease: 'none' });
      gsap.to('#scan', { backgroundPositionY: '4px', repeat: -1, duration: .28, ease: 'none' });
      gsap.to('.tick p', { xPercent: -100, repeat: -1, duration: 20, ease: 'none' });
    }

    if (typeof ScrollTrigger === 'undefined') return;

    /* ── section headings decode ── */
    var CH = '!<>-_\\/[]{}=+*^?#%01';
    function decode(el, final) {
      var f = 0;
      var q = final.split('').map(function (c, i) {
        return { c: c, s: Math.floor(i * 1.9), e: Math.floor(i * 1.9) + 8 + Math.random() * 14 };
      });
      var total = Math.max.apply(null, q.map(function (o) { return o.e; }));
      var id = setInterval(function () {
        el.textContent = q.map(function (o) {
          return f >= o.e ? o.c : (f >= o.s ? CH[(Math.random() * CH.length) | 0] : ' ');
        }).join('');
        if (f++ > total) { clearInterval(id); el.textContent = final; }
      }, 1000 / 32);
    }

    gsap.utils.toArray('.lead').forEach(function (l) {
      var h = l.querySelector('h2'), txt = h.textContent;
      gsap.from(h, { y: 20, opacity: 0, duration: .7, ease: 'expo.out',
        scrollTrigger: { trigger: l, start: 'top 87%' } });
      gsap.from(l.querySelector('.rule'), { scaleX: 0, transformOrigin: 'left',
        duration: .9, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 87%' } });
      if (!RM) ScrollTrigger.create({ trigger: l, start: 'top 87%', once: true,
        onEnter: function () { decode(h, txt); } });
    });

    /* ── story word reveal ── */
    var st = $('story');
    if (st) {
      (function wrap(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (t) {
              if (!t.trim()) { frag.appendChild(document.createTextNode(t)); return; }
              var s = document.createElement('span'); s.className = 'w';
              var i = document.createElement('i'); i.textContent = t;
              s.appendChild(i); frag.appendChild(s);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1) wrap(n);
        });
      })(st);
      gsap.from('#story .w i', { yPercent: 115, duration: .75, stagger: .018, ease: 'expo.out',
        scrollTrigger: { trigger: st, start: 'top 80%' } });
    }

    /* ── projects + self-drawing glyphs ── */
    gsap.utils.toArray('.proj').forEach(function (p) {
      gsap.from(p, { y: 34, opacity: 0, duration: .8, ease: 'expo.out',
        scrollTrigger: { trigger: p, start: 'top 91%' } });

      p.querySelectorAll('.glyph path,.glyph circle,.glyph line,.glyph rect').forEach(function (s) {
        var len = s.getTotalLength ? s.getTotalLength() : 100;
        gsap.set(s, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(s, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: p, start: 'top 89%' } });
      });

      if (!RM) p.addEventListener('mouseenter', function () {
        var h3 = p.querySelector('h3');
        if (!h3) return;
        gsap.to(h3, { x: gsap.utils.random(-4, 4), duration: .04, repeat: 3, yoyo: true,
          onComplete: function () { gsap.set(h3, { x: 0 }); } });
      });
    });

    /* ── stack ── */
    gsap.utils.toArray('.stack > div').forEach(function (d, i) {
      gsap.from(d, { y: 24, opacity: 0, duration: .7, delay: i * .09, ease: 'expo.out',
        scrollTrigger: { trigger: '.stack', start: 'top 86%' } });
    });

    /* ── contact ── */
    gsap.from('.say', { y: 36, opacity: 0, duration: .9, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact', start: 'top 75%' } });
    gsap.from('.sub, .contact-list li, .links a', { y: 12, opacity: 0, duration: .6, stagger: .07,
      scrollTrigger: { trigger: '.sub', start: 'top 91%' } });

    /* ── matrix rain ── */
    if (!RM) {
      var cv = $('rain');
      if (!cv) return;
      var cx = cv.getContext('2d');
      var G = '01<>/\\[]{}*#$%&@ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ';
      var W, H, cols, CW = 15;
      function size() {
        W = cv.width = window.innerWidth;
        H = cv.height = window.innerHeight;
        cols = [];
        for (var i = 0; i < Math.ceil(W / CW); i++) {
          cols.push({ y: Math.random() * -H, sp: 1.6 + Math.random() * 4, len: 5 + Math.random() * 16 });
        }
      }
      size();
      window.addEventListener('resize', size);
      (function fall() {
        requestAnimationFrame(fall);
        cx.fillStyle = 'rgba(10,2,3,.16)';
        cx.fillRect(0, 0, W, H);
        cx.font = (CW - 2) + 'px JetBrains Mono, monospace';
        cols.forEach(function (c, i) {
          for (var j = 0; j < c.len; j++) {
            var y = c.y - j * CW;
            if (y < 0 || y > H) continue;
            var t = 1 - j / c.len;
            cx.fillStyle = j === 0 ? 'rgba(255,180,170,.9)' : 'rgba(255,46,31,' + (t * .6) + ')';
            cx.fillText(G[(Math.random() * G.length) | 0], i * CW, y);
          }
          c.y += c.sp;
          if (c.y - c.len * CW > H) { c.y = Math.random() * -160; c.sp = 1.6 + Math.random() * 4; }
        });
      })();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();