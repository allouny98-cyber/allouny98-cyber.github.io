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
})();
