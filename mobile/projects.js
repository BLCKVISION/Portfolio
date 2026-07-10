gsap.registerPlugin(ScrollTrigger);

const _allProjects = [
  {
    id: 0, title: "BLCK", slug: "/BLCK", client: "BLCK VISION", caps: "IDENTIDAD VISUAL",
    desc: "Un enfoque audaz para redefinir el estándar del minimalismo puro y diseño brutalista en interfaces digitales.",
    folder: "blck"
  },
  {
    id: 1, title: "Emootis", slug: "/EMOOTIS", client: "EMOOTIS", caps: "IDENTIDAD VISUAL",
    desc: "Identidad dinámica y de alto impacto que captura la esencia expresiva para una marca que desafía las convenciones.",
    folder: "Emootis"
  },
  {
    id: 2, title: "Ink", slug: "/INK", client: "INK STUDIO", caps: "IDENTIDAD VISUAL",
    desc: "Sistema visual que mezcla el arte tradicional con una ejecución moderna, estableciendo nuevas normas de estética.",
    folder: "Ink"
  },
  {
    id: 3, title: "ViralFans", slug: "/VIRALFANS", client: "VIRALFANS", caps: "IDENTIDAD VISUAL",
    desc: "Plataforma de conexión vibrante. Una marca diseñada para escalar con la energía explosiva del ecosistema digital actual.",
    folder: "ViralFans"
  },
  {
    id: 4, title: "Aura", slug: "/AURA", client: "AURA INC", caps: "IDENTIDAD VISUAL",
    desc: "Identidad visual premium. Refinada, sofisticada y diseñada para transmitir una elegancia atemporal inconfundible.",
    folder: "Aura"
  }
].map(p => {
  let prefix = '../img/projects/';
  if (window.location.pathname.includes('/services/')) {
    prefix = '../../img/projects/';
  }
  const dir = prefix + p.folder + '/';
  return {
    ...p,
    heroImg: dir + "1.webp",
    img2: dir + "2.webp",
    img3: dir + "3.webp",
    img4: dir + "4.webp",
    img5: dir + "5.webp",
    img6: dir + "6.webp",
    img7: dir + "7.webp",
    img8: dir + "8.webp"
  };
});

const projects = typeof window.PROJECTS_FILTER !== 'undefined'
  ? _allProjects.filter(p => p.caps.toUpperCase() === window.PROJECTS_FILTER.toUpperCase())
  : _allProjects;

let activeIndex = 0;
let trackTimer = null;
let isAnimating = false;
let currentDiscoverIndex = 3;
let currentDiscoverProjects = [];
const TIME_PER_SLIDE = 5000;
const THUMB_W = 162;
const CENTER_THUMB_IDX = 4;

const thumbTrack = document.getElementById('thumb-track');
const mainTrack = document.getElementById('main-slider-track');
// === CONFIGURACIÓN Y ESTADO ===
const projectDataUrl = '../project/projects.json';

const cursor = document.getElementById('cursor');
if (cursor && !cursor.querySelector('.cursor-text')) {
  cursor.innerHTML = '<span class="cursor-text">VER</span>';
}

function initSliderDOM() {
  // Aseguramos generar un múltiplo exacto de projects.length para no romper el patrón
  const multiplier = Math.ceil(12 / projects.length) + 1;
  const totalSlides = projects.length * multiplier;

  for (let i = 0; i < totalSlides; i++) {
    const pIndex = i % projects.length;
    const slide = document.createElement('div');
    slide.className = 'main-slide';
    slide.dataset.index = pIndex;
    slide.innerHTML = `<img class="slide-bg" src="${projects[pIndex].heroImg}" alt="${projects[pIndex].title}">`;
    mainTrack.appendChild(slide);
  }

  for (let i = 0; i < totalSlides; i++) {
    // Offset the thumbnails so that the 5th item (index 4) matches the 1st item of the main slider
    const pIndex = (i - CENTER_THUMB_IDX + projects.length * 10) % projects.length;
    const thumb = document.createElement('div');
    thumb.className = 'thumb-box';
    thumb.dataset.projectIndex = pIndex;
    thumb.innerHTML = `<img src="${projects[pIndex].heroImg}" alt="${projects[pIndex].title}">`;
    thumb.style.pointerEvents = 'auto';
    thumb.style.cursor = 'none';
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnimating) return;
      const currentIndex = Array.from(thumbTrack.children).indexOf(thumb);
      if (currentIndex === CENTER_THUMB_IDX) return;
      
      const steps = Math.abs(currentIndex - CENTER_THUMB_IDX);
      const direction = currentIndex < CENTER_THUMB_IDX ? -1 : 1;
      navigateSteps(steps, direction);
    });
    // Thumbnails: show hovering cursor state to match navigation and CTAs
    thumb.addEventListener('mouseenter', () => {
      cursor.classList.remove('hover-view');
      cursor.classList.add('hovering');
    });
    thumb.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursor.classList.add('hover-view');
    });
    thumbTrack.appendChild(thumb);
  }

  gsap.set(thumbTrack, { x: -324 });
  updateThumbActive();
}

function jumpToProject(targetIndex) {
  if (targetIndex === activeIndex) return;

  // Rotate DOM elements instantly until activeIndex matches targetIndex
  while (activeIndex !== targetIndex) {
    mainTrack.appendChild(mainTrack.firstElementChild);
    thumbTrack.appendChild(thumbTrack.firstElementChild);
    activeIndex = (activeIndex + 1) % projects.length;
  }
  
  updateThumbActive();
  document.getElementById('slide-counter').innerHTML = `0${activeIndex + 1} &mdash; 0${projects.length}`;
}

function navigateSteps(steps, direction) {
  if (steps === 0) return;
  clearTimeout(trackTimer);
  isAnimating = true;
  let step = 0;

  function doStep() {
    if (step >= steps) {
      isAnimating = false;
      trackTimer = setTimeout(triggerSlideTransition, TIME_PER_SLIDE);
      return;
    }

    const vw = window.innerWidth;
    const dur = steps === 1 ? 1.2 : 0.4;

    if (direction === 1) {
      const nextIndex = (activeIndex + 1) % projects.length;
      const tl = gsap.timeline({
        onComplete: () => {
          mainTrack.appendChild(mainTrack.firstElementChild);
          gsap.set(mainTrack, { x: `+=${vw}` });
          thumbTrack.appendChild(thumbTrack.firstElementChild);
          gsap.set(thumbTrack, { x: `+=${THUMB_W}` });
          updateThumbActive();
          activeIndex = nextIndex;
          document.getElementById('slide-counter').innerHTML = `0${activeIndex + 1} &mdash; 0${projects.length}`;
          step++;
          doStep();
        }
      });
      tl.to(mainTrack, { x: `-=${vw}`, duration: dur, ease: 'power3.inOut' }, 0)
        .to(thumbTrack, { x: `-=${THUMB_W}`, duration: dur, ease: 'power3.inOut' }, 0);
    } else {
      const prevIndex = (activeIndex - 1 + projects.length) % projects.length;
      mainTrack.prepend(mainTrack.lastElementChild);
      gsap.set(mainTrack, { x: `-=${vw}` });
      thumbTrack.prepend(thumbTrack.lastElementChild);
      gsap.set(thumbTrack, { x: `-=${THUMB_W}` });

      const tl = gsap.timeline({
        onComplete: () => {
          updateThumbActive();
          activeIndex = prevIndex;
          document.getElementById('slide-counter').innerHTML = `0${activeIndex + 1} &mdash; 0${projects.length}`;
          step++;
          doStep();
        }
      });
      tl.to(mainTrack, { x: `+=${vw}`, duration: dur, ease: 'power3.inOut' }, 0)
        .to(thumbTrack, { x: `+=${THUMB_W}`, duration: dur, ease: 'power3.inOut' }, 0);
    }
  }

  doStep();
}

// Navigate one step backwards
function navigatePrev() {
  if (isAnimating) return;
  clearTimeout(trackTimer);
  isAnimating = true;
  const vw = window.innerWidth;
  const prevIndex = (activeIndex - 1 + projects.length) % projects.length;

  // Prepend last element to simulate reverse
  mainTrack.prepend(mainTrack.lastElementChild);
  gsap.set(mainTrack, { x: `-=${vw}` });
  thumbTrack.prepend(thumbTrack.lastElementChild);
  gsap.set(thumbTrack, { x: `-=${THUMB_W}` });

  const tl = gsap.timeline({
    onComplete: () => {
      updateThumbActive();
      activeIndex = prevIndex;
      document.getElementById('slide-counter').innerHTML = `0${activeIndex + 1} &mdash; 0${projects.length}`;
      isAnimating = false;
      trackTimer = setTimeout(triggerSlideTransition, TIME_PER_SLIDE);
    }
  });
  tl.to(mainTrack, { x: `+=${vw}`, duration: 1.2, ease: 'power3.inOut' }, 0)
    .to(thumbTrack, { x: `+=${THUMB_W}`, duration: 1.2, ease: 'power3.inOut' }, 0);
}

function updateThumbActive() {
  const thumbs = thumbTrack.children;
  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.toggle('active', i === CENTER_THUMB_IDX);
  }
}

function triggerSlideTransition() {
  if (isAnimating) return;
  isAnimating = true;
  const nextIndex = (activeIndex + 1) % projects.length;
  const vw = window.innerWidth;

  const tl = gsap.timeline({
    onComplete: () => {
      // Rotate BOTH tracks atomically in the same callback
      mainTrack.appendChild(mainTrack.firstElementChild);
      gsap.set(mainTrack, { x: `+=${vw}` });

      thumbTrack.appendChild(thumbTrack.firstElementChild);
      gsap.set(thumbTrack, { x: `+=${THUMB_W}` });

      updateThumbActive();
      activeIndex = nextIndex;
      document.getElementById('slide-counter').innerHTML = `0${nextIndex + 1} &mdash; 0${projects.length}`;
      isAnimating = false;
      trackTimer = setTimeout(triggerSlideTransition, TIME_PER_SLIDE);
    }
  });

  // Both animate at time 0, using exact pixel values
  tl.to(mainTrack, { x: `-=${vw}`, duration: 1.2, ease: "power3.inOut" }, 0)
    .to(thumbTrack, { x: `-=${THUMB_W}`, duration: 1.2, ease: "power3.inOut" }, 0);
}

function populateProjectData(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('proj-main-img').src = p.heroImg;
  document.getElementById('proj-display-title').textContent = p.title;
  document.getElementById('proj-client').textContent = p.client;
  document.getElementById('proj-caps').textContent = p.caps;
  document.getElementById('proj-desc').textContent = p.desc;

  document.getElementById('proj-img-2').src = p.img2;
  document.getElementById('proj-img-3').src = p.img3;
  document.getElementById('proj-img-4').src = p.img4;
  document.getElementById('proj-img-5').src = p.img5;
  document.getElementById('proj-img-6').src = p.img6;
  document.getElementById('proj-img-7').src = p.img7;
  document.getElementById('proj-img-8').src = p.img8;

  const discoverGrid = document.getElementById('discover-grid');
  discoverGrid.innerHTML = '';
  const available = projects.filter(proj => proj.id !== id);
  currentDiscoverProjects = [...available, ...available].slice(0, 6);
  currentDiscoverIndex = 3;

  let cardsHTML = '';
  currentDiscoverProjects.slice(0, 3).forEach(proj => {
    cardsHTML += `
      <div class="card hover-target discover-card" data-id="${proj.id}" data-bg="${proj.heroImg}">
        <img src="${proj.heroImg}" alt="Proyecto">
      </div>
    `;
  });
  discoverGrid.innerHTML = cardsHTML;

  const btnVerMas = document.querySelector('.btn-ver-mas');
  if (btnVerMas) btnVerMas.style.display = 'block';
  setupDiscoverHover();
}

// === ABRIR PROYECTO ===
function openProject(projectId) {
  clearTimeout(trackTimer);
  cursor.classList.remove('hover-view');
  populateProjectData(projectId);

  // Freeze main landing page scroll
  if (typeof lenis !== 'undefined') lenis.stop();
  document.body.classList.add('project-open');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  gsap.set('.proj-hero-wrapper', { height: '100vh' });
  gsap.set('.stagger-elem', { opacity: 0, y: 20 });
    gsap.set('.proj-title-bar', { marginTop: '0vh' });
  gsap.set('#project-view', { display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 80 });
  document.getElementById('project-view').scrollTop = 0;

  

  const tl = gsap.timeline();

  tl.to('#ui-bottom, #thumb-wrapper, #center-line', { opacity: 0, duration: 0.5 })
    .add(() => {
      gsap.set('#slider-view', { display: 'none' });
      gsap.set('#project-view', { position: 'fixed' }); // Keep it fixed to scroll internally
    })
    .to('.proj-title-bar', { marginTop: '-20vh', duration: 0.8, ease: 'power3.inOut' })
    .to('.stagger-elem', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, "-=0.2")
    .add(() => { ScrollTrigger.refresh(); initScrollAnimations(); });
}

// === CERRAR PROYECTO (VOLVER AL SLIDER) ===
function closeProject(e) {
  if (e) e.stopPropagation();
  document.getElementById('back-to-slider').classList.remove('active');
  
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger && st.trigger.classList && typeof st.trigger.classList.contains === 'function') {
      if (st.trigger.classList.contains('gs-reveal') || st.trigger.classList.contains('project-header')) {
        st.kill();
      }
    }
  });

  // Restore landing page navbar if hidden
  const nb = document.getElementById('navbar');
  if (nb) {
    gsap.to(nb, { y: 0, duration: 0.42, ease: 'power2.out' });
  }

  const projView = document.getElementById('project-view');
  const scrollY = projView.scrollTop;
  const tl = gsap.timeline();

  // If the user has scrolled down, smooth scroll back to the top of the case study first!
  if (scrollY > 50) {
    tl.to(projView, { scrollTop: 0, duration: 0.6, ease: 'power3.inOut' })
      .to('.stagger-elem', { opacity: 0, y: -20, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, "-=0.4");
  } else {
    tl.to('.stagger-elem', { opacity: 0, y: -20, duration: 0.4, stagger: 0.05, ease: 'power2.in' });
  }

  // Then shrink the hero wrapper back to the landing page slider view seamlessly
  tl.to('.proj-title-bar', { marginTop: '0vh', duration: 0.7, ease: 'power3.inOut' })
    .add(() => {
      // Re-enable landing page scroll
      if (typeof lenis !== 'undefined') lenis.start();
      document.body.classList.remove('project-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      gsap.set('#slider-view', { display: 'block' });
      gsap.set('#project-view', { display: 'none' });
    })
    .to('#ui-bottom, #thumb-wrapper, #center-line', { opacity: 1, duration: 0.6, ease: 'power2.out' })
    .add(() => {
      trackTimer = setTimeout(triggerSlideTransition, TIME_PER_SLIDE);
    });
}

document.getElementById('back-to-slider').addEventListener('click', closeProject);

// === BOTÓN VER MÁS ===
document.querySelector('.btn-ver-mas').addEventListener('click', (e) => {
  e.stopPropagation();
  const discoverGrid = document.getElementById('discover-grid');
  
  const nextProjects = currentDiscoverProjects.slice(currentDiscoverIndex, currentDiscoverIndex + 3);
  let newCardsHTML = '';
  nextProjects.forEach(proj => {
    newCardsHTML += `
      <div class="card hover-target discover-card" data-id="${proj.id}" data-bg="${proj.heroImg}" style="opacity: 0; transform: translateY(20px);">
        <img src="${proj.heroImg}" alt="Proyecto">
      </div>
    `;
  });
  discoverGrid.insertAdjacentHTML('beforeend', newCardsHTML);

  const newCards = discoverGrid.querySelectorAll('.discover-card:not(.bound)');
  gsap.to(newCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });

  setupDiscoverHover(); 
  
  currentDiscoverIndex += 3;
  if (currentDiscoverIndex >= currentDiscoverProjects.length) {
    e.target.style.display = 'none';
  }
});

// === TRANSICIÓN DESDE DESCUBRE MÁS ===
function setupDiscoverHover() {
  document.querySelectorAll('.discover-card:not(.bound)').forEach(card => {
    card.classList.add('bound');
    
    card.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hover-view');
    });
    card.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hover-view');
    });

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const newId = parseInt(card.dataset.id);
      cursor.classList.remove('hover-view');

      const cardImg = card.querySelector('img');
      const rect = cardImg.getBoundingClientRect();

      const clone = document.createElement('img');
      clone.src = card.dataset.bg;
      clone.style.position = 'fixed';
      clone.style.top = rect.top + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.objectFit = 'cover';
      clone.style.zIndex = 9999;
      document.body.appendChild(clone);

      

      const tl = gsap.timeline();

      tl.to('.project-header, .project-images, #proj-footer, .proj-title-bar', { opacity: 0, duration: 0.3 })
        .to(clone, { top: 0, left: 0, width: '100vw', height: '100vh', duration: 0.7, ease: 'power3.inOut' }, "-=0.2")
        .add(() => {
          populateProjectData(newId);
          jumpToProject(newId);
          document.getElementById('project-view').scrollTop = 0; // Scroll to top instantly while covered by clone!
          gsap.set('.proj-hero-wrapper', { height: '100vh' });
          gsap.set('.stagger-elem', { opacity: 0, y: 20 });
    gsap.set('.proj-title-bar', { marginTop: '0vh' });
          gsap.set('.project-header, .project-images, #proj-footer, .proj-title-bar', { opacity: 0 }); // Hide initially
        })
        .to(clone, { opacity: 0, duration: 0.5, ease: 'power2.out' })
        .add(() => {
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger && st.trigger.classList && typeof st.trigger.classList.contains === 'function') {
              if (st.trigger.classList.contains('gs-reveal') || st.trigger.classList.contains('project-header')) {
                st.kill();
              }
            }
          });
          clone.remove();
        })
        .to('.proj-title-bar', { marginTop: '-20vh', duration: 0.8, ease: 'power3.inOut' })
        .to('.project-header, .proj-title-bar', { opacity: 1, duration: 0.5 }, "-=0.6")
        .to('.stagger-elem', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, "-=0.4")
        .add(() => {
          gsap.set('.project-images, #proj-footer', { opacity: 1 });
          ScrollTrigger.refresh();
          initScrollAnimations();
        });
    });
  });
}

// === SCROLL REVEALS IN DETAIL VIEW ===
function initScrollAnimations() {
  gsap.utils.toArray('.gs-reveal').forEach(sec => {
    gsap.fromTo(sec, { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: sec, scroller: '#project-view', start: 'top 85%' }
    });
  });

  ScrollTrigger.create({
    trigger: '.project-header',
    scroller: '#project-view',
    start: 'top 50%',
    endTrigger: '.discover-more',
    end: 'top 95%',
    onEnter: () => document.getElementById('hire-widget').classList.add('visible'),
    onLeave: () => document.getElementById('hire-widget').classList.remove('visible'),
    onEnterBack: () => document.getElementById('hire-widget').classList.add('visible'),
    onLeaveBack: () => document.getElementById('hire-widget').classList.remove('visible')
  });
}

// === NAVBAR SHOW/HIDE ON INTERNAL SCROLL ===
(function() {
  const projView = document.getElementById('project-view');
  if (!projView) return;
  let projLastY = 0;
  let projNbHidden = false;

  projView.addEventListener('scroll', function() {
    const y = projView.scrollTop;
      if (y > window.innerHeight * 0.2) {
        document.getElementById('back-to-slider').classList.add('active');
      } else {
        document.getElementById('back-to-slider').classList.remove('active');
      }
    const nb = document.getElementById('navbar');
    if (!nb) return;
    if (y > projLastY && y > 120 && !projNbHidden) {
      gsap.to(nb, { y: -90, duration: 0.38, ease: 'power2.inOut' });
      projNbHidden = true;
    } else if (y < projLastY && projNbHidden) {
      gsap.to(nb, { y: 0, duration: 0.42, ease: 'power2.out' });
      projNbHidden = false;
    }
    projLastY = y;
  });
})();

// === CURSOR PERSONALIZADO ===
document.querySelectorAll('.hover-target').forEach(el => {
  if (el.id === 'slider-view' || el.classList.contains('discover-card')) {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hover-view');
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hover-view');
    });
  } else {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('hovering');
    });
  }
});

// === DRAG / SWIPE EN SLIDER ===
(function initDrag() {
  const sliderEl = document.getElementById('slider-view');
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let hasDragged = false;
  const DRAG_THRESHOLD = 60; // px mínimos para considerar swipe
  const CLICK_THRESHOLD = 8; // px máximo para considerar click

  function onDragStart(x, y) {
    startX = x;
    startY = y;
    isDragging = true;
    hasDragged = false;
  }

  function onDragEnd(x, y, e) {
    if (!isDragging) return;
    isDragging = false;
    const dx = x - startX;
    const dy = y - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Swipe horizontal
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > DRAG_THRESHOLD) {
      hasDragged = true;
      if (dx < 0) {
        clearTimeout(trackTimer);
        triggerSlideTransition();
      } else {
        navigatePrev();
      }
    }
    // Simple click (no drag) on main area → open project
    else if (dist < CLICK_THRESHOLD && e && !e.target.closest('.thumbnails-box')) {
      if (isAnimating) return; // Prevent opening while slider is moving to avoid wrong index
      openProject(activeIndex);
    }
  }

  // Mouse
  sliderEl.addEventListener('mousedown', (e) => {
    onDragStart(e.clientX, e.clientY);
  });
  sliderEl.addEventListener('mouseup', (e) => onDragEnd(e.clientX, e.clientY, e));
  sliderEl.addEventListener('mouseleave', () => { isDragging = false; });

  // Touch
  sliderEl.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    onDragStart(t.clientX, t.clientY);
  }, { passive: true });
  sliderEl.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    onDragEnd(t.clientX, t.clientY, e);
  });
})();

// === INICIO ===
initSliderDOM();
trackTimer = setTimeout(triggerSlideTransition, TIME_PER_SLIDE);
