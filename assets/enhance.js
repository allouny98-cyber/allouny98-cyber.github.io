/* Electropack — enrichissements UI (vanilla, sans dépendance)
   Révélations au scroll, timeline, scrollspy, header compact, retour en haut,
   lightbox des attestations. Mouvement discret, reduced-motion respecté. */
(function(){
  "use strict";
  var D = document, root = D.documentElement;
  root.classList.add('js');
  root.classList.add('enh');   // n'active les animations que si ce script s'exécute
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

  // --- 2. Timeline "Notre méthode" (remplissage en cascade) ---
  var tl = D.querySelector('.timeline');
  if (tl) {
    if (hasIO && !reduce) {
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io2.unobserve(e.target); } });
      }, { threshold: 0.35 });
      io2.observe(tl);
    } else { tl.classList.add('in'); }
  }

  // --- 3. Scrollspy : lien de menu actif selon la section visible ---
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

  // --- 4. Header compact au scroll + bouton retour en haut ---
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

  // --- 5. Lightbox galerie d'attestations (navigation + compteur) ---
  // La galerie se construit à partir des liens présents dans la page :
  // chaque référence (.tlink) et chaque vignette (.doc-btn) porte data-full.
  var lb = D.getElementById('lightbox');
  var sources = [].slice.call(D.querySelectorAll('.doc-btn[data-full], .tlink[data-full]'));
  var gallery = [], seen = {};
  sources.forEach(function(el){
    var src = el.getAttribute('data-full');
    if (!src || seen[src]) return;
    seen[src] = true;
    gallery.push({ src: src, label: el.getAttribute('data-label') || '' });
  });
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
  function closeLb(){
    if (!lb) return;
    lb.classList.remove('open'); D.body.style.overflow = '';
    setTimeout(function(){ var img = lb.querySelector('img'); if (img) img.src = ''; }, 250);
  }
  if (lb && gallery.length) {
    sources.forEach(function(el){
      el.addEventListener('click', function(ev){
        ev.preventDefault();
        openAt(indexOfSrc(el.getAttribute('data-full')));
      });
    });
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
})();
