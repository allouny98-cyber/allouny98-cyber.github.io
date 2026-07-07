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
  function onScroll(){
    var y = window.pageYOffset || D.documentElement.scrollTop || 0;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (toTop) toTop.classList.toggle('show', y > window.innerHeight * 0.9);
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
})();
