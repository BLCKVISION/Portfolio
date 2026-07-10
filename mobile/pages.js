/* ── 0. Preloader — Curtain Letter Reveal ───────── */
var preloaderDone = false;
var pageRevealQueue = [];
(function(){
  var letters = document.querySelectorAll('.pre-letter');
  var preloader = document.getElementById('preloader');

  if(preloader) {
    document.body.style.overflow = 'hidden';
    gsap.set(letters, { y: -80, opacity: 0 });

    var tl = gsap.timeline({
      onComplete: function(){
        document.body.style.overflow = '';
        preloaderDone = true;
        pageRevealQueue.forEach(function(fn){ fn(); });
      }
    });

    tl.to(letters, {
      y: 0, opacity: 1,
      duration: 0.7,
      stagger: 0.07,
      ease: 'power3.out'
    }, 0)
    .to({}, { duration: 0.55 })
    .to(preloader, {
      yPercent: -100,
      duration: 1.05,
      ease: 'power4.inOut'
    });
  } else {
    preloaderDone = true;
    pageRevealQueue.forEach(function(fn){ fn(); });
  }
})();

/* ── 1. Register + Lenis ─────────────────────────── */
gsap.registerPlugin(ScrollTrigger);
var lenis = new Lenis({ duration:1.6, smoothWheel:true, wheelMultiplier:.9 });
function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);

/* ── 2. Cursor ───────────────────────────────────── */
var cur=document.getElementById('cursor');
if(cur) {
  var mx=window.innerWidth/2,my=window.innerHeight/2,cx=mx,cy=my;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
  (function loop(){cx+=(mx-cx)*.11;cy+=(my-cy)*.11;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.srv-item,.pg-submit-btn').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.classList.add('hovering')});
    el.addEventListener('mouseleave',function(){cur.classList.remove('hovering')});
  });
}

/* ── 3. Navbar hide/show ─────────────────────────── */
var nb=document.getElementById('navbar');
if(nb) {
  gsap.set(nb,{y:-120});
  var lastY=0,nbHidden=true;
  lenis.on('scroll',function(e){
    var y=e.scroll;
    if(y<=50){
      if(!nbHidden){gsap.to(nb,{y:-120,duration:.38,ease:'power2.inOut'});nbHidden=true;}
    } else {
      if(y>lastY&&y>120&&!nbHidden){gsap.to(nb,{y:-120,duration:.38,ease:'power2.inOut'});nbHidden=true;}
      else if(y<lastY&&nbHidden){gsap.to(nb,{y:0,duration:.42,ease:'power2.out'});nbHidden=false;}
    }
    lastY=y;
  });
}

/* ── 4. FAQ Accordion + Entrance ─────────────────── */
(function(){
  var faqSec = document.getElementById('faq');
  if(!faqSec) return;
  var faqTitle = document.querySelector('.faq-title');
  var faqItems = document.querySelectorAll('.faq-item');
  if(faqTitle && faqItems.length) {
    gsap.set(faqTitle, {opacity:0, y:30});
    gsap.set(faqItems, {opacity:0, y:25});
    ScrollTrigger.create({trigger:'#faq',start:'top 70%',once:true,
      onEnter:function(){
        gsap.timeline()
          .to(faqTitle, {opacity:1,y:0,duration:1.2,ease:'power3.out'},0)
          .to(faqItems, {opacity:1,y:0,duration:1,ease:'power3.out',stagger:0.12},0.2);
      }
    });
  }
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var isOpen=item.classList.contains('faq-open');
      document.querySelectorAll('.faq-item').forEach(function(el){el.classList.remove('faq-open');});
      if(!isOpen) item.classList.add('faq-open');
    });
  });
})();

/* ── 5. Text Swap buttons ───────────────────────── */
(function(){
  var swapSels = ['.nav-cta', '.pg-submit-btn', '.cta-consult-btn', '.cta-wa'];
  swapSels.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(btn){
      if(btn.classList.contains('btn-swap')) return;
      var textNode = null;
      btn.childNodes.forEach(function(n){
        if(n.nodeType===3 && n.textContent.trim()) textNode = n;
      });
      var textStr = textNode ? textNode.textContent.trim() : '';
      if(!textStr) return;
      var svg = btn.querySelector('svg');
      var svgClone = svg ? svg.cloneNode(true) : null;
      var label = document.createElement('span');
      label.className = 'btn-label';
      label.style.cssText = 'display:inline-flex;align-items:center;gap:8px;';
      var labelText = document.createTextNode(textStr);
      label.appendChild(labelText);
      if(svg){ label.appendChild(svg); }
      var clone = document.createElement('span');
      clone.className = 'btn-label-clone';
      clone.appendChild(document.createTextNode(textStr));
      if(svgClone){ clone.appendChild(svgClone); }
      if(textNode) btn.removeChild(textNode);
      btn.insertBefore(clone, btn.firstChild);
      btn.insertBefore(label, clone);
      btn.classList.add('btn-swap');
    });
  });
})();

/* ── 6. Page Specific: Contact Hero Reveal ───────── */
(function(){
  var contactHero = document.getElementById('pg-hero-contact');
  if(!contactHero) return;

  var titleLines = document.querySelectorAll('.pg-line-inner');
  var subtext = document.querySelector('.pg-subtext');
  var contactMeta = document.querySelectorAll('.pg-contact-item, .pg-meta-block');
  var formWrapper = document.querySelector('.pg-form-wrapper');

  gsap.set(titleLines, { y: '100%' });
  gsap.set(subtext, { opacity: 0, y: 20 });
  gsap.set(contactMeta, { opacity: 0, y: 20 });
  gsap.set(formWrapper, { opacity: 0, y: 40 });

  function revealContact() {
    var tl = gsap.timeline({delay: 0.2});
    tl.to(titleLines, {
      y: '0%',
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    })
    .to(subtext, {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, "-=0.6")
    .to(contactMeta, {
      opacity: 1, y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, "-=0.6")
    .to(formWrapper, {
      opacity: 1, y: 0,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.8");
  }

  if (preloaderDone) {
    revealContact();
  } else {
    pageRevealQueue.push(revealContact);
  }
})();

/* ── 7. Scroll Snap para secciones de servicios ── */
(function(){
  var snapSections = [
    '#srv-hero',
    '#entregamos',
    '#srv-results',
    '#srv-mockup'
  ];
  snapSections.forEach(function(sel){
    var sec = document.querySelector(sel);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top bottom",
      end: "bottom top",
      snap: {
        snapTo: 0.5,
        duration: {min: 0.5, max: 1.0},
        delay: 0.2,
        ease: "power2.inOut"
      }
    });
  });
})();

/* ── 8. Global smooth scroll for anchor links ── */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl && typeof lenis !== 'undefined') {
        e.preventDefault();
        lenis.scrollTo(targetEl, { duration: 1.4, easing: function(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; } });
      }
    });
  });
})();

/* ── 9. Contact Section Counter ─────────────────── */
(function(){
  var ctaNumber = document.querySelector('.cta-number'); if(!ctaNumber) return;
  var ctaStat   = document.querySelector('.cta-stat');
  var ctaWa     = document.querySelector('.cta-wa');
  var targetVal = parseInt(ctaNumber.dataset.target || '95', 10);
  
  gsap.set([ctaStat, ctaWa].filter(Boolean), {opacity:0, y:45});
  ScrollTrigger.create({
    trigger: '#contact', start: 'top 70%', once: true,
    onEnter: function() {
      var tl = gsap.timeline();
      var countObj = { val: 0 };
      tl.to(countObj, {
        val: targetVal,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: function() {
          if (ctaNumber) {
            ctaNumber.innerHTML = Math.floor(countObj.val) + '%';
          }
        }
      }, 0);
      tl.fromTo(ctaNumber, {opacity: 0, scale: 0.95}, {opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out'}, 0);
      tl.to(ctaStat, {opacity:1, y:0, duration:1, ease:'power3.out'}, 1.5)
        .to(ctaWa, {opacity:1, y:0, duration:1, ease:'power3.out'}, 1.7);
    }
  });
})();

/* ── 5. Statement split-text ─────────────────────── */
(function(){
  var box=document.getElementById('stmtText'); if(!box) return;
  var text = box.textContent.trim();
  var words = text.split(/\s+/);
  box.innerHTML = '';
  var frag=document.createDocumentFragment();
  words.forEach(function(word, i){
    var s=document.createElement('span');
    s.className='w';
    var cleanWord = word.toUpperCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    if (cleanWord === 'DOMINAR' || cleanWord === 'INVISIBLE' || cleanWord === 'ESTRATEGIA' || cleanWord === 'PRECISIÓN' || cleanWord === 'SOLUCIONES' || cleanWord === 'CONVERSIONES' || cleanWord === 'FRICCIÓN' || cleanWord === 'REPETITIVO' || cleanWord === 'MOTOR') {
      s.className += ' w-italic';
    }
    s.textContent=word;
    frag.appendChild(s);
    if(i < words.length - 1){
      var sp=document.createElement('span');
      sp.className='ws';
      sp.innerHTML='&nbsp;';
      frag.appendChild(sp);
    }
  });
  box.appendChild(frag);
  var wordSpans=box.querySelectorAll('.w');
  gsap.set(wordSpans,{opacity:0,filter:'blur(14px)'});
  var tl=gsap.timeline({scrollTrigger:{trigger:'#statement',start:'top top',end:'+='+(wordSpans.length*140),pin:true,scrub:1.2,anticipatePin:1}});
  tl.to(wordSpans,{opacity:1,filter:'blur(0px)',ease:'none',stagger:{each:.14},duration:1.2});

  /* Statement sec-bar — fade up at 50% */
  var stmtBar = document.querySelector('#statement .sec-bar');
  if (stmtBar) {
    ScrollTrigger.create({
      trigger: '#statement',
      start: 'top top',
      end: '+=' + (wordSpans.length * 70),
      scrub: true,
      onUpdate: function(self) {
        if (self.progress > 0.5) {
          gsap.to(stmtBar, {y: -40, opacity: 0, duration: 0.4, ease: 'power2.in', overwrite: true});
        } else {
          gsap.to(stmtBar, {y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: true});
        }
      }
    });
  }
})();



/* ── 6. Projects Slider Entrance Animation (Stagger) ──── */
(function(){
  var projSec = document.querySelector('#entregamos'); if(!projSec) return;
  var sliderView = projSec.querySelector('#slider-view');
  var secBar = projSec.querySelector('.sec-bar');
  var botBar = projSec.querySelector('#ui-bottom');
  var centerLine = projSec.querySelector('#center-line');
  
  // Set initial states immediately to avoid FOUC
  gsap.set(sliderView, { opacity: 0, y: 150 });
  if (secBar) gsap.set(secBar, { opacity: 0, y: -30 });
  if (botBar) gsap.set(botBar, { opacity: 0, y: 30 });
  if (centerLine) gsap.set(centerLine, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' });
  
  window.addEventListener('load', function() {
    var thumbs = projSec.querySelectorAll('.thumb-box');
    if (thumbs.length > 0) {
      gsap.set(thumbs, { opacity: 0, y: 30 });
    }
    
        ScrollTrigger.create({
      trigger: projSec,
      start: 'top top',
      end: '+=800',
      pin: true,
      anticipatePin: 1,
      pinSpacing: true,
      scrub: false
    });
    
    ScrollTrigger.create({
      trigger: projSec,
      start: 'top top',
      onEnter: function(){
        var tl = gsap.timeline();
        tl.to(sliderView, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
          .to(secBar, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.6')
          .to(botBar, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.6')
          .to(centerLine, { opacity: 1, scaleY: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');
          
        if (thumbs.length > 0) {
          tl.to(thumbs, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.5');
        }
      }
    });
  });
})();
