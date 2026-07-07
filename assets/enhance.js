/* Electropack — enrichissements UI (vanilla, sans dépendance)
   Révélations scroll, hero mot-à-mot, rotation de mots, scrollspy,
   header compact, back-to-top, pop des compteurs. 60fps, reduced-motion. */
(function(){
  "use strict";
  var D = document, root = D.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  // --- 1. Révélations au scroll (une seule fois) ---
  var reveals = [].slice.call(D.querySelectorAll('.reveal'));
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // --- Timeline "Notre méthode" (remplissage + allumage en cascade) ---
  var tl = D.querySelector('.timeline');
  if (tl) {
    if (hasIO && !reduce) {
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io2.unobserve(e.target); } });
      }, { threshold: 0.35 });
      io2.observe(tl);
    } else { tl.classList.add('in'); }
  }

  // --- 2. Titre du hero mot par mot ---
  var h1 = D.getElementById('heroTitle');
  if (h1 && !reduce) {
    var i = 0, nodes = [].slice.call(h1.childNodes);
    nodes.forEach(function(n){
      if (n.nodeType === 3) { // texte
        var frag = D.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(tok){
          if (tok.trim() === '') { frag.appendChild(D.createTextNode(tok)); }
          else {
            var s = D.createElement('span');
            s.className = 'word'; s.textContent = tok;
            s.style.transitionDelay = (i * 0.08) + 's'; i++;
            frag.appendChild(s);
          }
        });
        h1.replaceChild(frag, n);
      } else if (n.nodeType === 1) { // élément (ex : le rotateur)
        n.classList.add('word');
        n.style.transitionDelay = (i * 0.08) + 's'; i++;
      }
    });
    requestAnimationFrame(function(){ h1.classList.add('animate'); });
  }

  // --- 2bis. Rotation de mots-clés ---
  var rot = D.querySelector('.rotator .rot-word');
  if (rot) {
    var words = ['hôtels', 'banques', 'bureaux', 'industries'], idx = 0;
    setInterval(function(){
      idx = (idx + 1) % words.length;
      if (reduce) { rot.textContent = words[idx]; return; }
      rot.classList.add('out');
      setTimeout(function(){ rot.textContent = words[idx]; rot.classList.remove('out'); }, 300);
    }, 2500);
  }

  // --- 4. Pop des compteurs (appelé par le script inline de la page) ---
  window.__popCounter = function(el){
    if (reduce) return;
    el.classList.add('pop');
    setTimeout(function(){ el.classList.remove('pop'); }, 440);
  };

  // --- 4bis. Scrollspy : lien de menu actif selon la section visible ---
  var navlinks = [].slice.call(D.querySelectorAll('.nav-links a[href^="#"]'));
  var map = {};
  navlinks.forEach(function(a){ var id = a.getAttribute('href').slice(1); if (id) map[id] = a; });
  var secs = Object.keys(map).map(function(id){ return D.getElementById(id); }).filter(Boolean);
  if (secs.length && hasIO) {
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          navlinks.forEach(function(a){ a.classList.remove('current'); });
          var a = map[e.target.id]; if (a) a.classList.add('current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    secs.forEach(function(s){ spy.observe(s); });
  }

  // --- 7. Header compact au scroll + bouton retour en haut ---
  var header = D.querySelector('header'), toTop = D.querySelector('.to-top');
  var heroSchem = D.querySelector('.hero-schematic');
  function onScroll(){
    var y = window.pageYOffset || D.documentElement.scrollTop || 0;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (toTop) toTop.classList.toggle('show', y > window.innerHeight * 0.9);
    // Parallaxe très discrète du schéma de fond du hero (max 30px, transform only)
    if (heroSchem && !reduce) heroSchem.style.transform = 'translate3d(0,' + Math.min(30, y * 0.06).toFixed(1) + 'px,0)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  // --- Lightbox galerie d'attestations (navigation + compteur) ---
  var lb = D.getElementById('lightbox');
  var docBtns = [].slice.call(D.querySelectorAll('.doc-btn'));
  var gallery = docBtns.map(function(b){ return { src: b.getAttribute('data-full'), label: b.getAttribute('data-label') || '' }; });
  var lbIndex = 0;
  function indexOfSrc(src){
    for (var k = 0; k < gallery.length; k++){ if (gallery[k].src === src) return k; }
    return -1;
  }
  function openAt(i){
    if (!lb || !gallery.length) return;
    lbIndex = (i + gallery.length) % gallery.length;
    var it = gallery[lbIndex];
    var img = lb.querySelector('img');
    img.src = it.src; img.alt = 'Attestation ' + it.label;
    var lbl = lb.querySelector('.lb-label'); if (lbl) lbl.textContent = it.label;
    var cnt = lb.querySelector('.lb-count'); if (cnt) cnt.textContent = (lbIndex + 1) + ' / ' + gallery.length;
    lb.classList.add('open'); D.body.style.overflow = 'hidden';
  }
  function openSrc(src){ var i = indexOfSrc(src); openAt(i < 0 ? 0 : i); }
  function closeLb(){
    if (!lb) return;
    lb.classList.remove('open'); D.body.style.overflow = '';
    setTimeout(function(){ var img = lb.querySelector('img'); if (img) img.src = ''; }, 250);
  }
  if (lb) {
    docBtns.forEach(function(b, i){ b.addEventListener('click', function(){ openAt(i); }); });
    var attOpen = D.querySelector('.att-open');
    if (attOpen) attOpen.addEventListener('click', function(){ openAt(0); });
    var lbClose = lb.querySelector('.lb-close');
    var lbPrev = lb.querySelector('.lb-prev'), lbNext = lb.querySelector('.lb-next');
    if (lbClose) lbClose.addEventListener('click', closeLb);
    if (lbPrev) lbPrev.addEventListener('click', function(e){ e.stopPropagation(); openAt(lbIndex - 1); });
    if (lbNext) lbNext.addEventListener('click', function(e){ e.stopPropagation(); openAt(lbIndex + 1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLb(); });
    D.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') openAt(lbIndex - 1);
      else if (e.key === 'ArrowRight') openAt(lbIndex + 1);
    });
  }

  // --- Carrousel témoignages (un seul à la fois, fondu, flèches + points, 6s) ---
  var stage = D.querySelector('.tst-stage');
  if (stage) {
    var slides = [].slice.call(stage.querySelectorAll('.tslide'));
    var dotsWrap = D.querySelector('.tst-dots');
    var prevBtn = D.querySelector('.tst-arrow.prev'), nextBtn = D.querySelector('.tst-arrow.next');
    var cur = 0, tdots = [];
    if (dotsWrap) {
      slides.forEach(function(s, i){
        var b = D.createElement('button'); b.type = 'button';
        b.setAttribute('aria-label', 'Aller au témoignage ' + (i + 1));
        b.addEventListener('click', function(){ show(i); restart(); });
        dotsWrap.appendChild(b); tdots.push(b);
      });
    }
    function show(i){
      cur = (i + slides.length) % slides.length;
      slides.forEach(function(s, j){ s.classList.toggle('is-active', j === cur); });
      tdots.forEach(function(d, j){ d.classList.toggle('active', j === cur); });
    }
    show(0);
    if (prevBtn) prevBtn.addEventListener('click', function(){ show(cur - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ show(cur + 1); restart(); });
    var tt = null;
    function play(){ if (reduce) return; stop(); tt = setInterval(function(){ show(cur + 1); }, 6000); }
    function stop(){ if (tt) { clearInterval(tt); tt = null; } }
    function restart(){ stop(); play(); }
    var carousel = D.querySelector('.tst-carousel');
    if (carousel) { carousel.addEventListener('mouseenter', stop); carousel.addEventListener('mouseleave', play); }
    play();
    // Liens "Voir l'attestation originale" -> ouvre la lightbox sur le bon document
    [].slice.call(D.querySelectorAll('.tst-att-link')).forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); openSrc(a.getAttribute('data-full')); });
    });
  }

  // --- Tableau de bord électrique du hero (SVG/CSS, 60fps, pause si onglet caché / hors-écran) ---
  var dash = D.getElementById('dash');
  if (dash) {
    var dwrap = dash.parentNode;                 // .hero-visual.dash-wrap
    var inner = dash.querySelector('.dash-inner');
    var needle = dash.querySelector('.gauge-needle');
    var wave = dash.querySelector('.scope-wave');
    var vOut = D.getElementById('dV'), hzOut = D.getElementById('dHz'), kwhOut = D.getElementById('dKwh');
    var leds = [].slice.call(dash.querySelectorAll('.led'));
    var brks = [].slice.call(dash.querySelectorAll('.brk'));

    // Sinusoïde (courant alternatif) : forme générée une seule fois, période 100
    if (wave) {
      var lam = 100, amp = 24, midY = 45, tot = 520, dd = 'M0 ' + midY;
      for (var wx = 4; wx <= tot; wx += 4) {
        dd += ' L' + wx + ' ' + (midY - amp * Math.sin(2 * Math.PI * wx / lam)).toFixed(2);
      }
      wave.setAttribute('d', dd);
    }
    function fmt(n){ return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
    function setHz(v){ if (hzOut) hzOut.innerHTML = v.toFixed(1) + '<span>Hz</span>'; }
    function setKwh(v){ if (kwhOut) kwhOut.innerHTML = fmt(v) + '<span>kWh</span>'; }
    var kwh = 1240;

    if (reduce) {
      // Version statique : panneau visible, aiguille à 230 V, voyants allumés (CSS par défaut)
      dwrap.classList.add('dash-in');
      if (needle) needle.style.transform = 'rotate(0deg)';
    } else {
      dash.classList.add('anim');
      requestAnimationFrame(function(){ dwrap.classList.add('dash-in'); });
      if (needle) needle.style.transform = 'rotate(-90deg)';          // départ : 0 V
      // Séquence d'allumage (~1,5 s) : voyants un par un, puis la courbe
      setTimeout(function(){ leds[0] && leds[0].classList.add('lit'); }, 350);
      setTimeout(function(){ leds[1] && leds[1].classList.add('lit'); }, 700);
      setTimeout(function(){ leds[2] && leds[2].classList.add('lit'); }, 1050);
      setTimeout(function(){ dash.classList.add('scope-on'); }, 600);

      var bootStart = performance.now(), BOOT = 1250, angle = -90;
      var running = false, visible = !D.hidden, inView = true;
      var lastNum = 0, brkTimer = null, rafId = 0;

      function frame(now){
        if (!running) return;
        var bp = Math.min(1, (now - bootStart) / BOOT);
        var base = -90 + (1 - Math.pow(1 - bp, 3)) * 90;            // 0 V -> 230 V (ease-out)
        var wob = bp >= 1 ? Math.sin(now / 680) * 3.2 + (Math.random() - 0.5) * 1.1 : 0;
        angle += ((base + wob) - angle) * 0.09;                     // lissage : jamais de à-coups
        if (needle) needle.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
        if (vOut) vOut.textContent = Math.round(230 + angle * (28 / 90));
        if (bp >= 1 && now - lastNum > 520) {
          lastNum = now;
          setHz(50 + (Math.random() - 0.5) * 0.2);                  // 50,0 Hz ± 0,1
          kwh += 0.3 + Math.random() * 0.5; setKwh(kwh);            // kWh qui monte lentement
        }
        rafId = requestAnimationFrame(frame);
      }
      function toggleBrk(){ if (brks.length) brks[(Math.random() * brks.length) | 0].classList.toggle('on'); }
      function sync(){
        if (visible && inView) {
          if (!running) { running = true; rafId = requestAnimationFrame(frame); }
          dash.classList.remove('paused');
          if (!brkTimer) brkTimer = setInterval(toggleBrk, 8000);
        } else {
          running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
          dash.classList.add('paused');
          if (brkTimer) { clearInterval(brkTimer); brkTimer = null; }
        }
      }
      D.addEventListener('visibilitychange', function(){ visible = !D.hidden; sync(); });
      if (hasIO) {
        var vio = new IntersectionObserver(function(es){ inView = es[0].isIntersecting; sync(); }, { threshold: 0 });
        vio.observe(dash);
      }
      sync();

      // Parallaxe très subtile à la souris (desktop uniquement, translate max 6px)
      if (inner && window.matchMedia('(min-width:901px) and (pointer:fine)').matches) {
        var section = dash.closest('.hero') || dash;
        section.addEventListener('mousemove', function(e){
          var r = section.getBoundingClientRect();
          var px = ((e.clientX - r.left) / r.width - 0.5) * 12;
          var py = ((e.clientY - r.top) / r.height - 0.5) * 12;
          inner.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)';
        });
        section.addEventListener('mouseleave', function(){ inner.style.transform = 'translate3d(0,0,0)'; });
      }
    }
  }
})();
