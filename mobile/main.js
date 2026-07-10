/* ── 0. Preloader — Curtain Letter Reveal ───────── */
var preloaderDone = false;
var heroRevealQueue = [];
(function(){
  var letters = document.querySelectorAll('.pre-letter');
  var preloader = document.getElementById('preloader');

  document.body.style.overflow = 'hidden';

  /* Letters start ABOVE, fall down into place */
  gsap.set(letters, { y: -80, opacity: 0 });

  var tl = gsap.timeline({
    onComplete: function(){
      document.body.style.overflow = '';
      preloaderDone = true;
      heroRevealQueue.forEach(function(fn){ fn(); });
    }
  });

  /* 1. Letters fall from above with stagger */
  tl.to(letters, {
    y: 0, opacity: 1,
    duration: 0.7,
    stagger: 0.07,
    ease: 'power3.out'
  }, 0)

  /* 2. Dramatic pause once all letters land */
  .to({}, { duration: 0.55 })

  /* 3. Curtain rises — no bar, no letter exit */
  .to(preloader, {
    yPercent: -100,
    duration: 1.05,
    ease: 'power4.inOut'
  })

  /* 4. Navbar slides in */
  .to('#navbar', {
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.35');
})();


/* ── 1. Register + Lenis ─────────────────────────── */
gsap.registerPlugin(ScrollTrigger);
var lenis = new Lenis({ duration:1.6, smoothWheel:true, wheelMultiplier:.9 });
function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);

/* ── 2. Cursor ───────────────────────────────────── */
var cur=document.getElementById('cursor');
var mx=window.innerWidth/2,my=window.innerHeight/2,cx=mx,cy=my;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
(function loop(){cx+=(mx-cx)*.11;cy+=(my-cy)*.11;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.srv-item').forEach(function(el){
  el.addEventListener('mouseenter',function(){cur.classList.add('hovering')});
  el.addEventListener('mouseleave',function(){cur.classList.remove('hovering')});
});
['#statement','#metrics'].forEach(function(sel){
  var el=document.querySelector(sel); if(!el)return;
  ScrollTrigger.create({trigger:el,start:'top top',end:'bottom top',
    onEnter:function(){cur.classList.add('on-light')},
    onLeave:function(){cur.classList.remove('on-light')},
    onEnterBack:function(){cur.classList.add('on-light')},
    onLeaveBack:function(){cur.classList.remove('on-light')}
  });
});

/* ── 3. Navbar hide/show ─────────────────────────── */
var nb=document.getElementById('navbar');
/* navbar reveal handled by preloader */
gsap.set(nb,{y:-120});
var lastY=0,nbHidden=false;
lenis.on('scroll',function(e){
  var y=e.scroll;
  if(y>lastY&&y>120&&!nbHidden){gsap.to(nb,{y:-90,duration:.38,ease:'power2.inOut'});nbHidden=true;}
  else if(y<lastY&&nbHidden){gsap.to(nb,{y:0,duration:.42,ease:'power2.out'});nbHidden=false;}
  lastY=y;
});


/* ── 4. Statement split-text ─────────────────────── */
(function(){
  var phrase=[
    {t:'Impulsados'},{t:'por'},{t:'la'},{t:'Estrategia,',cls:'w-italic'},
    {t:'Construimos'},{t:'sistemas'},{t:'que'},{t:'ayudan'},{t:'a'},{t:'las'},{t:'Marcas',cls:'w-italic'},
    {t:'a'},{t:'Destacar'},{t:'y'},{t:'Crecer'},{t:'en'},{t:'la'},{t:'era'},{t:'Digital.'}
  ];
  var box=document.getElementById('stmtText'); if(!box) return;
  var frag=document.createDocumentFragment();
  phrase.forEach(function(item,i){
    var s=document.createElement('span');s.className='w'+(item.cls?' '+item.cls:'');s.textContent=item.t;frag.appendChild(s);
    if(i<phrase.length-1){var sp=document.createElement('span');sp.className='ws';sp.innerHTML='&nbsp;';frag.appendChild(sp);}
  });
  box.appendChild(frag);
  var words=box.querySelectorAll('.w');
  gsap.set(words,{opacity:0,filter:'blur(14px)'});
  var tl=gsap.timeline({scrollTrigger:{trigger:'#statement',start:'top top',end:'+='+(words.length*140),pin:true,scrub:1.2,anticipatePin:1}});
  tl.to(words,{opacity:1,filter:'blur(0px)',ease:'none',stagger:{each:.14},duration:1.2});

  /* Statement sec-bar — fade up at 50% */
  var stmtBar = document.querySelector('#statement .sec-bar');
  if (stmtBar) {
    ScrollTrigger.create({
      trigger: '#statement',
      start: 'top top',
      end: '+=' + (words.length * 70),
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

/* ── 5. Trust quote (removed) ────────────────────── */

/* ── 6. Services ─────────────────────────────────── */
(function(){
  var introText = document.getElementById('srvIntroText'); if(!introText) return;
  
  // Helper to split text into words
  var text = introText.textContent.trim();
  var words = text.split(/\s+/);
  introText.innerHTML = '';
  var frag = document.createDocumentFragment();
  words.forEach(function(word, i){
    var s = document.createElement('span');
    if (word.toUpperCase().indexOf('ESTRATEGICOS') !== -1) {
      s.className = 'w font-mr';
    } else {
      s.className = 'w font-ml';
    }
    s.textContent = word;
    frag.appendChild(s);
    if (i < words.length - 1) {
      var sp = document.createElement('span');
      sp.className = 'ws';
      sp.innerHTML = '&nbsp;';
      frag.appendChild(sp);
    }
  });
  introText.appendChild(frag);

  var wordSpans = introText.querySelectorAll('.w');
  var cardsWrap = document.getElementById('srvCardsWrap');
  var cards = cardsWrap ? cardsWrap.querySelectorAll('.srv-card-row') : [];

  // Set initial states
  gsap.set(wordSpans, { opacity: 0, filter: 'blur(14px)' });
  if (cards.length >= 3) {
    gsap.set(cards[0], { opacity: 0, y: 550, pointerEvents: 'none' });
    gsap.set(cards[1], { opacity: 0, y: 400, pointerEvents: 'none' });
    gsap.set(cards[2], { opacity: 0, y: 300, pointerEvents: 'none' });

    // Set initial states for card children
    cards.forEach(function(card){
      var title = card.querySelector('.srv-card-title');
      var desc = card.querySelector('.srv-card-desc');
      var arrow = card.querySelector('.srv-card-arrow');
      gsap.set(title, { opacity: 0, y: 30 });
      gsap.set([desc, arrow], { opacity: 0, y: 20 });
    });
  }

  // Timeline with ScrollTrigger pinning
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#services',
      start: 'top top',
      end: '+=3200',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1
    }
  });

  tl
    // 1. Reveal intro text word-by-word
    .to(wordSpans, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.05,
      duration: 0.8,
      ease: 'none'
    })
    // 2. Pause on text
    .to({}, { duration: 0.3 })
    // 3. Move text up and fade out
    .to(introText, {
      opacity: 0,
      y: -80,
      duration: 0.6,
      ease: 'power2.inOut'
    }, 'transition');

  if (cards.length >= 3) {
    tl.addLabel('cards');

    // Card 0:
    tl.to(cards[0], { opacity: 1, y: 0, pointerEvents: 'all', duration: 0.9, ease: 'power2.out' }, 'cards')
      .to(cards[0].querySelector('.srv-card-title'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'cards+=0.6')
      .to([cards[0].querySelector('.srv-card-desc'), cards[0].querySelector('.srv-card-arrow')], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, 'cards+=0.9');

    // Card 1:
    tl.to(cards[1], { opacity: 1, y: 0, pointerEvents: 'all', duration: 0.9, ease: 'power2.out' }, 'cards+=1.5')
      .to(cards[1].querySelector('.srv-card-title'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'cards+=2.1')
      .to([cards[1].querySelector('.srv-card-desc'), cards[1].querySelector('.srv-card-arrow')], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, 'cards+=2.4');

    // Card 2:
    tl.to(cards[2], { opacity: 1, y: 0, pointerEvents: 'all', duration: 0.9, ease: 'power2.out' }, 'cards+=3.0')
      .to(cards[2].querySelector('.srv-card-title'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'cards+=3.6')
      .to([cards[2].querySelector('.srv-card-desc'), cards[2].querySelector('.srv-card-arrow')], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, 'cards+=3.9');

    tl.to({}, { duration: 0.8 }); // Hold after last card finishes
  }

})();

/* ── 7. Carousel — PIN fijo, sólo botones navegan ── */
(function(){
  const section = document.getElementById('entregamos');
  
  if (typeof CustomEase !== "undefined") {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop",
        "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606, 1 0.752,1 1, 1 "
    );
  }

  /* PIN: sección fija mientras el usuario esté ahí */
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=800',
    pin: true,
    anticipatePin: 1,
    pinSpacing: true,
    scrub: false
  });

  /* ANIMACIÓN STAGGER DE ENTRADA PARA PROYECTOS */
  var sliderView = document.getElementById('slider-view');
  var secBar = document.querySelector('#entregamos .sec-bar');
  var botBar = document.getElementById('ui-bottom');
  var centerLine = document.getElementById('center-line');
  var thumbs = document.querySelectorAll('.thumb-container');
  
  if (section && sliderView) {
      gsap.set(sliderView, { opacity: 0, y: 60 });
      gsap.set(secBar, { opacity: 0, y: 30 });
      if (botBar) gsap.set(botBar, { opacity: 0, y: 30 });
      if (centerLine) gsap.set(centerLine, { opacity: 0, scaleY: 0 });
      if (thumbs.length > 0) gsap.set(thumbs, { opacity: 0, y: 20 });
      
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        onEnter: function(){
          var tl = gsap.timeline();
          tl.to(sliderView, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
          if (secBar) tl.to(secBar, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.6');
          if (botBar) tl.to(botBar, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.6');
          if (centerLine) tl.to(centerLine, { opacity: 1, scaleY: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');
            
          if (thumbs.length > 0) {
            tl.to(thumbs, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.5');
          }
        }
      });
  }


  const projectData = [
      { title: "ELEVATE APP", desc: "Plataforma de bienestar y meditación diseñada para mejorar la salud mental mediante rutinas diarias personalizadas.", tags: ["UI/UX", "APP", "WELLNESS"] },
      { title: "NOVA STUDIO", desc: "Agencia creativa especializada en identidades visuales disruptivas para startups tecnológicas de alto crecimiento.", tags: ["BRANDING", "CREATIVE", "WEB"] },
      { title: "LUMEN TECH", desc: "Desarrollo de un sistema de gestión inteligente para optimizar el consumo energético en edificios corporativos.", tags: ["SYSTEMS", "TECH", "DASHBOARD"] },
      { title: "NEXUS PAY", desc: "Aplicación financiera que simplifica las transferencias internacionales y pagos móviles sin comisiones ocultas.", tags: ["FINTECH", "MOBILE", "UX"] },
      { title: "AURA DESIGN", desc: "Rediseño completo de la experiencia de usuario y plataforma de comercio electrónico para marca de moda sostenible.", tags: ["E-COMMERCE", "FASHION", "DESIGN"] }
  ];

  const slider = document.querySelector(".slider");
  if (!slider) return;
  let slides = slider.querySelectorAll(".slide");
  let animating = false;
  let duration = 1.5;
  let currentIndex = 0;
  let autoSlideInterval;

  const tag1 = document.getElementById("tag-1");
  const tag2 = document.getElementById("tag-2");
  const tag3 = document.getElementById("tag-3");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  /* Counter element */
  const counter = document.getElementById('proj-counter');

  if(tag1) tag1.textContent = projectData[0].tags[0];
  if(tag2) tag2.textContent = projectData[0].tags[1];
  if(tag3) tag3.textContent = projectData[0].tags[2];
  if(counter) counter.textContent = '01 / 0' + projectData.length;

  slides.forEach((slide, index) => {
      if (index > 0) {
          gsap.set(slide,{
              clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
          })
      }
  });

  function updateUI(newIndex) {
      if(!tag1) return;
      gsap.to([tag1, tag2, tag3], {
          opacity: 0, y: 10, duration: 0.4, ease: "power2.inOut",
          onComplete: () => {
              tag1.textContent = projectData[newIndex].tags[0];
              tag2.textContent = projectData[newIndex].tags[1];
              tag3.textContent = projectData[newIndex].tags[2];
              if(counter) gsap.fromTo(counter,{opacity:0,y:-6},{opacity:1,y:0,duration:.3,ease:'power2.out'});
              if(counter) counter.textContent = '0'+(newIndex+1)+' / 0'+projectData.length;
              gsap.fromTo([tag1, tag2, tag3], 
                  { opacity: 0, y: -10 },
                  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 }
              );
          }
      });
  }

  function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => nextSlide(), 6000);
  }

  function nextSlide() {
      if (animating) return;
      animating = true;
      resetAutoSlide();

      slides = slider.querySelectorAll(".slide");
      const firstSlide = slides[0];
      const firstSlideImg = firstSlide.querySelector("img");
      const easeCurve = typeof CustomEase !== "undefined" ? "hop" : "power3.inOut";

      if (slides.length > 1) {
          const secondSlide = slides[1];
          const secondSlideImg = secondSlide.querySelector("img");

          gsap.set(secondSlideImg, { x: 250 });

          gsap.to(secondSlideImg, {
              x: 0,
              duration: duration,
              ease: easeCurve,
          });

          gsap.to(firstSlideImg, {
              x: -500,
              duration: duration,
              ease: easeCurve,
          });
          
          gsap.to(secondSlide, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: duration,
              ease: easeCurve,
              onComplete: () => {
                  firstSlide.remove();
                  slider.appendChild(firstSlide);

                  gsap.set(firstSlide, {
                      clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
                  });

                  animating = false;
              },
          });

          currentIndex = (currentIndex + 1) % projectData.length;
          updateUI(currentIndex);
      } else {
          animating = false;
      }
  }

  function prevSlide() {
      if (animating) return;
      animating = true;
      resetAutoSlide();

      slides = slider.querySelectorAll(".slide");
      const lastSlide = slides[slides.length - 1];
      const lastSlideImg = lastSlide.querySelector("img");
      const firstSlide = slides[0];
      const firstSlideImg = firstSlide.querySelector("img");
      const easeCurve = typeof CustomEase !== "undefined" ? "hop" : "power3.inOut";

      if (slides.length > 1) {
          slider.prepend(lastSlide);
          
          gsap.set(lastSlide, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
          });
          gsap.set(lastSlideImg, { x: -500 });

          gsap.to(lastSlideImg, {
              x: 0,
              duration: duration,
              ease: easeCurve,
          });

          gsap.to(firstSlideImg, {
              x: 250,
              duration: duration,
              ease: easeCurve,
          });
          
          gsap.to(firstSlide, {
              clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
              duration: duration,
              ease: easeCurve,
              onComplete: () => {
                  gsap.set(firstSlideImg, { x: 0 });
                  animating = false;
              }
          });

          currentIndex = (currentIndex - 1 + projectData.length) % projectData.length;
          updateUI(currentIndex);
      } else {
          animating = false;
      }
  }

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  resetAutoSlide();

  /* Carousel bottom-nav stagger entrance */
  var bottomNav = section.querySelector('.bottom-nav');
  if (bottomNav) {
    var bottomEls = bottomNav.querySelectorAll('.glass-tag, .proj-counter-wrap, .proj-cta, .nav-btn, #proj-counter');
    gsap.set(bottomEls, {opacity:0, y:25});
    ScrollTrigger.create({trigger:section, start:'top 60%', once:true,
      onEnter:function(){
        gsap.to(bottomEls, {opacity:1, y:0, duration:1, ease:'power3.out', stagger:0.08, delay:0.3});
      }
    });
  }
})();

/* ── 8. Metrics counter ──────────────────────────── */
(function(){
  var items=document.querySelectorAll('.mtr-item');
  var mtrTitle = document.querySelector('.mtr-title');
  var mtrBtn = document.querySelector('.mtr-btn');
  var lineInner = mtrTitle ? mtrTitle.querySelector('.line-inner') : null;

  gsap.set(items,{opacity:0,y:50});
  gsap.set(mtrBtn,{opacity:0,y:35});
  if (lineInner) {
    gsap.set(lineInner, { yPercent: 100 });
  } else {
    gsap.set(mtrTitle, { opacity: 0, y: 35 });
  }

  ScrollTrigger.create({trigger:'#metrics',start:'top 30%',once:true,
    onEnter:function(){
      var tl = gsap.timeline();
      if (lineInner) {
        tl.to(lineInner, { yPercent: 0, duration: 1.1, ease: 'power4.out' }, 0);
      } else {
        tl.to(mtrTitle,  { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0);
      }
      tl.to(mtrBtn,    {opacity:1, y:0, duration:1,   ease:'power3.out'}, 0.3)
        .to(items,     {opacity:1, y:0, duration:1,   ease:'power3.out', stagger:0.2}, 0.2);
      
      document.querySelectorAll('.mtr-count').forEach(function(el){
        var target=parseInt(el.dataset.target,10);
        var obj={val:0};
        gsap.to(obj,{val:target,duration:2.2,ease:'power2.out',delay:0.5,
          onUpdate:function(){el.textContent=Math.round(obj.val);}
        });
      });
    }
  });
})();

/* ── 9. Brand stories — cards libres suben ───────── */
(function(){
  var col=document.getElementById('bsCol'); if(!col) return;
  var cards=col.querySelectorAll('.bs-card');
  var cardH=cards[0].offsetHeight||320;
  var gap=32;
  var totalH=(cardH+gap)*cards.length;
  var vh=window.innerHeight;

  /* Cards start below viewport */
  /* recalc cardH after layout */
  cardH = cards[0].getBoundingClientRect().height || 320;
  gsap.set(col,{y: vh + 100});

  /* Text starts hidden for stagger entrance */
  gsap.set('.bs-left .bs-line, .bs-right .bs-line', {opacity:0, y:30});

  /* Cursor mode */
  ScrollTrigger.create({trigger:'#brand-split',start:'top top',end:'bottom top',
    onEnter:function(){cur.classList.add('on-light')},
    onLeave:function(){cur.classList.remove('on-light')},
    onEnterBack:function(){cur.classList.add('on-light')},
    onLeaveBack:function(){cur.classList.remove('on-light')}
  });

  /* Stagger entrance for text lines when section enters */
  ScrollTrigger.create({trigger:'#brand-split',start:'top 80%',once:true,
    onEnter:function(){
      gsap.to('.bs-left .bs-line, .bs-right .bs-line', {
        opacity:1, y:0, duration:1.2, ease:'power3.out', stagger:0.15
      });
    }
  });

  /* Secuencia pinned:
     0.00–0.15 : texto quieto, normal (hold inicial)
     0.15–0.30 : texto baja 15vh suavemente
     0.30–0.75 : gap se abre + texto sale a los lados (expansión)
     0.55–1.00 : cards suben a velocidad moderada
  */
  var splitTl=gsap.timeline({
    scrollTrigger:{trigger:'#brand-split',start:'top top',end:'+=5000',pin:true,scrub:1.2,anticipatePin:1}
  });

  splitTl
    /* Fase 1 (0→0.15): hold — nada */
    /* Fase 2 (0.15→0.30): texto baja 15vh */
    .to('.bs-text-wrap',{y:'15vh', duration:0.6, ease:'power1.inOut'}, 0.15)
    /* Fase 3 (0.30→0.65): expansión — gap + x a ±8vw */
    .to('.bs-text-wrap',{gap: window.innerWidth < 768 ? '100vw' : 'clamp(280px,36vw,580px)', duration:1.4, ease:'power2.inOut'}, 0.30)
    .to('.bs-left', {x: window.innerWidth < 768 ? '-100vw' : '-8vw', duration:1.4, ease:'power2.inOut'}, 0.30)
    .to('.bs-right',{x: window.innerWidth < 768 ? '100vw' : '8vw',  duration:1.4, ease:'power2.inOut'}, 0.30)
    /* Fase 4 (0.60→1.00): cards suben */
    .to(col,{
      y: -(totalH - cardH/2 - vh/2 + 20),
      duration:1.6,
      ease:'power1.inOut'
    }, 0.60);
})();

/* ── 10. Contact entrance ────────────────────────── */
(function(){
  var ctaNumber = document.querySelector('.cta-number'); if(!ctaNumber) return;
  var ctaStat   = document.querySelector('.cta-stat');
  var ctaWa     = document.querySelector('.cta-wa');
  gsap.set([ctaStat, ctaWa].filter(Boolean),{opacity:0,y:45});
  ScrollTrigger.create({trigger:'#contact',start:'top 70%',once:true,
    onEnter:function(){
      var tl = gsap.timeline();
      
      // Animate the counter from 0 to 95
      var countObj = { val: 0 };
      tl.to(countObj, {
        val: 95,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: function() {
          if (ctaNumber) {
            ctaNumber.innerHTML = Math.floor(countObj.val) + '%';
          }
        }
      }, 0);

      // Fade in the counter container just in case it was hidden, though we didn't hide it
      tl.fromTo(ctaNumber, {opacity: 0, scale: 0.95}, {opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out'}, 0);

      // When counter is around 80% (which is around 1.6s based on ease out), show the text and button
      tl.to(ctaStat,   {opacity:1,y:0,duration:1,  ease:'power3.out'}, 1.5)
        .to(ctaWa,     {opacity:1,y:0,duration:1,  ease:'power3.out'}, 1.7);
    }
  });
})();


/* ── FAQ accordion + entrance ───────────────────── */
(function(){
  /* Entrance */
  var faqTitle = document.querySelector('.faq-title');
  var faqItems = document.querySelectorAll('.faq-item');
  var lineInner = faqTitle ? faqTitle.querySelector('.line-inner') : null;

  gsap.set(faqItems, {opacity:0, y:25});
  if (lineInner) {
    gsap.set(lineInner, { yPercent: 100 });
    gsap.set(faqTitle, { opacity: 1 });
  } else {
    gsap.set(faqTitle, {opacity:0, y:30});
  }

  ScrollTrigger.create({trigger:'#faq',start:'top 30%',once:true,
    onEnter:function(){
      var tl = gsap.timeline();
      if (lineInner) {
        tl.to(lineInner, { yPercent: 0, duration: 1.1, ease: 'power4.out' }, 0);
      } else {
        tl.to(faqTitle, {opacity:1,y:0,duration:1.2,ease:'power3.out'}, 0);
      }
      tl.to(faqItems, {opacity:1,y:0,duration:1,ease:'power3.out',stagger:0.12}, 0.2);
    }
  });
  /* Accordion */
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var isOpen=item.classList.contains('faq-open');
      document.querySelectorAll('.faq-item').forEach(function(el){el.classList.remove('faq-open');});
      if(!isOpen) item.classList.add('faq-open');
    });
  });
})();


/* ── Text Swap buttons ───────────────────────── */
(function(){
  var swapSels = ['.nav-cta', '.srv-pricing-btn', '.cta-wa', '.mtr-btn', '.proj-cta'];
  swapSels.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(btn){
      // grab text node (first child that is a text node or first span without svg)
      var textNode = null;
      btn.childNodes.forEach(function(n){
        if(n.nodeType===3 && n.textContent.trim()) textNode = n;
      });
      var textStr = textNode ? textNode.textContent.trim() : '';
      if(!textStr) return;

      // get SVG if present
      var svg = btn.querySelector('svg');
      var svgClone = svg ? svg.cloneNode(true) : null;

      // Build swap structure
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

      // Replace btn content
      if(textNode) btn.removeChild(textNode);
      btn.insertBefore(clone, btn.firstChild);
      btn.insertBefore(label, clone);
      btn.classList.add('btn-swap');
    });
  });
})();


// Hero entrance — stagger lines then reveal sub and scroll indicator
(function() {
  if(!document.getElementById('hero')) return;
  document.querySelectorAll('#hero .line').forEach(line => {
    const html = line.innerHTML;
    line.innerHTML = '<span class="line-inner">' + html + '</span>';
  });

  const heroLines = document.querySelectorAll('#hero .hero-title .line-inner');
  const heroSubLines = document.querySelectorAll('#hero .hero-sub .line-inner');
  gsap.set(heroLines, { y: 100, opacity: 0 });
  gsap.set(heroSubLines, { y: 60, opacity: 0 });

  function runHeroReveal() {
    gsap.timeline({ delay: 0.15 })
      .to(heroLines, {
        y: 0, opacity: 1,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power4.out'
      })
      .to(heroSubLines, {
        y: 0, opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.55')
      .to('.hero-scroll-indicator', {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out'
      }, '-=0.3');
  }

  if (preloaderDone) { runHeroReveal(); }
  else { heroRevealQueue.push(runHeroReveal); }

  // Hero scroll indicator scroll behavior
  const heroScrollBtn = document.getElementById('heroScrollBtn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', function(e) {
      e.preventDefault();
      lenis.scrollTo('#statement', { duration: 1.4, easing: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t });
    });
  }

  // Global smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl && typeof lenis !== 'undefined') {
        e.preventDefault();
        lenis.scrollTo(targetEl, { duration: 1.4, easing: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t });
      }
    });
  });
})();

/* ── Sec-bar stagger reveal on each section ────────── */
(function(){
  var sections = ['#services','#entregamos','#metrics','#brand-split','#faq'];
  sections.forEach(function(sel){
    var sec = document.querySelector(sel);
    if (!sec) return;
    var barEls = sec.querySelectorAll('.sec-bar-left, .sec-bar-center, .sec-bar-right');
    if (!barEls.length) return;
    gsap.set(barEls, { y: 14, opacity: 0 });
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(barEls, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
      }
    });
  });

  /* Hero sec-bar — reveal after preloader */
  var heroBar = document.querySelectorAll('#hero .sec-bar-left, #hero .sec-bar-center, #hero .sec-bar-right');
  gsap.set(heroBar, { y: 14, opacity: 0 });
  function revealHeroBar() {
    gsap.to(heroBar, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
  }
  if (preloaderDone) { revealHeroBar(); }
  else { heroRevealQueue.push(revealHeroBar); }

  /* Statement sec-bar — reveal with section */
  var stmtBarEls = document.querySelectorAll('#statement .sec-bar-left, #statement .sec-bar-center, #statement .sec-bar-right');
  gsap.set(stmtBarEls, { y: 14, opacity: 0 });
  ScrollTrigger.create({
    trigger: '#statement',
    start: 'top 80%',
    once: true,
    onEnter: function() {
      gsap.to(stmtBarEls, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }
  });
})();


window.addEventListener("load", () => {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
});

/* ── Scroll Controlado (Hijacked Scroll Snapping) ── */
(function(){
  var snapSections = ['#hero', '#services', '#metrics', '#faq', '#contact'];
  var snapPositions = [];

  function updateSnapPositions() {
    snapPositions = snapSections.map(function(sel){
      var el = document.querySelector(sel);
      return el ? el.offsetTop : null;
    }).filter(function(v){ return v !== null; });
  }

  updateSnapPositions();
  window.addEventListener('resize', updateSnapPositions);
  window.addEventListener('load', updateSnapPositions);

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    snap: {
      snapTo: function(value) {
        var totalScroll = ScrollTrigger.maxScroll(window);
        var currentScroll = value * totalScroll;

        // Check if inside any active pin/scrub scroll trigger
        var isInsideSpecial = false;
        ScrollTrigger.getAll().forEach(function(st){
          // Ignore this snapping trigger itself
          if (st.vars.trigger === document.body && st.vars.snap) return;
          if (st.pin || (st.vars && st.vars.scrub)) {
            // Give 50px buffer around pins
            if (currentScroll >= (st.start - 50) && currentScroll <= (st.end + 50)) {
              isInsideSpecial = true;
            }
          }
        });

        if (isInsideSpecial) {
          return value; // stay where we are (no snap)
        }

        // Find nearest snap position
        var nearest = snapPositions[0];
        var minDiff = Math.abs(currentScroll - nearest);
        snapPositions.forEach(function(pos){
          var diff = Math.abs(currentScroll - pos);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = pos;
          }
        });

        return nearest / totalScroll;
      },
      duration: { min: 0.5, max: 0.9 },
      delay: 0.15,
      ease: "power2.inOut"
    }
  });
})();

/* -- 11. CTA Form Reveal + Overlay -- */
(function(){
  var WA_URL = 'https://wa.me/584121234567?text=Hola%2C%20quiero%20iniciar%20un%20proyecto%20con%20BLCK%20VISION';

  // Nav "CONTACTAR" → WhatsApp direct
  var navCta = document.getElementById('navContactCta');
  if (navCta) {
    navCta.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(WA_URL, '_blank', 'noopener');
    });
  }

  // CTA section form reveal
  var statView  = document.getElementById('ctaStatView');
  var formState = document.getElementById('ctaFormState');
  var ctaBg     = document.getElementById('ctaBg');
  var backBtn   = document.getElementById('ctaFormBack');
  var formOpen  = false;

  function openCtaForm() {
    if (formOpen || !formState) return;
    formOpen = true;
    formState.classList.add('active');

    // Prepare stagger targets — set hidden before reveal
    var animEls = formState.querySelectorAll('.cf-anim');
    gsap.set(animEls, { opacity: 0, y: 22 });

    gsap.timeline()
      // Keep bg but dim it slightly for readability
      .to(ctaBg,    { opacity: 0.06, duration: 0.55, ease: 'power2.inOut' }, 0)
      .to(statView, { opacity: 0, y: -28, duration: 0.38, ease: 'power2.in' }, 0)
      .set(statView, { pointerEvents: 'none' })
      // Form wrapper fades in
      .fromTo(formState, { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.32)
      // Stagger each element
      .to(animEls, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out'
      }, 0.36);
  }

  function closeCtaForm() {
    if (!formOpen || !formState) return;
    formOpen = false;

    gsap.timeline({
      onComplete: function() {
        formState.classList.remove('active');
        gsap.set(statView, { clearProps: 'all' });
      }
    })
      .to(formState, { opacity: 0, y: 16, duration: 0.35, ease: 'power2.in' }, 0)
      .to(ctaBg,     { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.1)
      .fromTo(statView, { opacity: 0, y: 18, pointerEvents: '' },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.28);
  }

  var bottomCta = document.getElementById('bottomContactCta');
  if (bottomCta) {
    bottomCta.addEventListener('click', function(e) {
      e.preventDefault();
      openCtaForm();
    });
  }

  if (backBtn) backBtn.addEventListener('click', closeCtaForm);

  // ── Custom dropdowns ──────────────────────────────
  function initDropdowns() {
    document.querySelectorAll('.cta-dd-wrap').forEach(function(wrap) {
      var trigger  = wrap.querySelector('.cta-dd-selected');
      var valSpan  = wrap.querySelector('.cta-dd-val');
      var list     = wrap.querySelector('.cta-dd-list');
      var hidden   = wrap.querySelector('input[type="hidden"]');
      var isOpen   = false;

      function openDD() {
        isOpen = true;
        wrap.classList.add('dd-open');
        list.style.display = 'block';
        gsap.fromTo(list, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' });
      }
      function closeDD() {
        isOpen = false;
        wrap.classList.remove('dd-open');
        gsap.to(list, { opacity: 0, y: -6, duration: 0.18, ease: 'power2.in',
          onComplete: function() { list.style.display = 'none'; }
        });
      }

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        isOpen ? closeDD() : openDD();
      });

      wrap.querySelectorAll('.cta-dd-opt').forEach(function(opt) {
        opt.addEventListener('click', function(e) {
          e.stopPropagation();
          valSpan.textContent = opt.textContent;
          hidden.value = opt.dataset.val;
          wrap.classList.add('dd-filled');
          closeDD();
        });
      });

      document.addEventListener('click', function() { if(isOpen) closeDD(); });
    });
  }

  // Init dropdowns when form state first activates
  var ddInited = false;
  if (bottomCta) {
    bottomCta.addEventListener('click', function() {
      if (!ddInited) { initDropdowns(); ddInited = true; }
    }, { once: false });
  }

  // ── Form submit → WhatsApp ────────────────────────
  var ctaForm = document.getElementById('ctaContactForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name    = (document.getElementById('cf-name')    || {}).value || '';
      var type    = (document.getElementById('cf-type')    || {}).value || '';
      var company = (document.getElementById('cf-company') || {}).value || '';
      var phone   = (document.getElementById('cf-phone')   || {}).value || '';

      var waMsg =
        '👋 Hola, quiero iniciar un proyecto con BLCK VISION.\n\n'
        + '👤 Nombre: ' + name
        + (company ? '\n🏢 Empresa: ' + company : '')
        + '\n📁 Tipo: '   + (type  || 'No especificado')
        + '\n📱 Tel: '    + (phone || 'No especificado');

      window.open('https://wa.me/584121234567?text=' + encodeURIComponent(waMsg), '_blank', 'noopener');
    });
  }

  // Project overlay
  var overlay     = document.getElementById('page-overlay');
  var overlayBg   = document.getElementById('overlay-bg');
  var overlayWrap = document.getElementById('overlay-content-wrap');
  var overlayArea = document.getElementById('overlay-content-area');
  var closeBtn    = document.getElementById('overlay-close-btn');
  var isOpen      = false;

  if (!overlay) return;

  gsap.set(overlayWrap, { y: '100%' });
  gsap.set(overlayBg,   { opacity: 0 });
  gsap.set(closeBtn,    { opacity: 0 });

  function openOverlay(templateId) {
    if (isOpen) return;
    isOpen = true;

    var tpl = document.getElementById(templateId);
    if (tpl) {
      overlayArea.innerHTML = '';
      overlayArea.appendChild(tpl.content.cloneNode(true));
    }

    overlay.classList.add('active');
    closeBtn.classList.add('active');
    if (typeof lenis !== 'undefined') lenis.stop();
    document.body.style.overflow = 'hidden';

    gsap.timeline()
      .to(overlayBg,   { opacity: 1, duration: 0.45, ease: 'power2.inOut' }, 0)
      .to(overlayWrap, { y: '0%',   duration: 0.75, ease: 'power4.out'   }, 0)
      .to(closeBtn,    { opacity: 1, duration: 0.35, ease: 'power2.out'   }, 0.4);
  }

  function closeOverlay() {
    if (!isOpen) return;
    isOpen = false;
    closeBtn.classList.remove('active');

    gsap.timeline({
      onComplete: function() {
        overlay.classList.remove('active');
        overlayArea.innerHTML = '';
        if (typeof lenis !== 'undefined') lenis.start();
        document.body.style.overflow = '';
      }
    })
      .to(closeBtn,    { opacity: 0, duration: 0.25, ease: 'power2.in'    }, 0)
      .to(overlayWrap, { y: '100%', duration: 0.65, ease: 'power3.inOut' }, 0)
      .to(overlayBg,   { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 0.15);
  }

  closeBtn.addEventListener('click', closeOverlay);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeOverlay();
  });

  var projCta = document.getElementById('projCta');
  if (projCta) {
    projCta.addEventListener('click', function(e) {
      e.preventDefault();
      openOverlay('tpl-project');
    });
  }
})();

/* ── Footer entrance ────────────────────────────── */
(function(){
  var footer = document.getElementById('footer'); if(!footer) return;
  var logo = footer.querySelector('.ftr-logo');
  var tagline = footer.querySelector('.ftr-tagline');
  var links = footer.querySelectorAll('.ftr-nav-link');

  gsap.set(logo, { opacity: 0, y: 25 });
  gsap.set(tagline, { opacity: 0, y: 20 });
  gsap.set(links, { opacity: 0, y: 15 });

  ScrollTrigger.create({
    trigger: footer,
    start: 'top 92%',
    once: true,
    onEnter: function() {
      var tl = gsap.timeline();
      tl.to(logo, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(tagline, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .to(links, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 }, '-=0.4');
    }
  });
})();
