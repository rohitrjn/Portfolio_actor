/* ================================================================
   PORTFOLIO — script.js
   Rohit Ranjan Actor Portfolio
================================================================ */
'use strict';

/* ----------------------------------------------------------------
   RED STRING — global JS-driven dot registry + RAF loop
   (animateMotion/mpath is unreliable across browsers for <rect>;
    we drive the dot position ourselves with requestAnimationFrame)
---------------------------------------------------------------- */
window._rsDots = window._rsDots || [];
(function rafTick(ts) {
  for (const a of window._rsDots) {
    const t = ((((ts - a.t0) / 1000) / a.dur) + a.phase) % 1;
    const p = _posOnRR(((t % 1) + 1) % 1, a.ox, a.oy, a.rw, a.rh, a.r);
    a.dot.setAttribute('cx', p[0].toFixed(1));
    a.dot.setAttribute('cy', p[1].toFixed(1));
  }
  requestAnimationFrame(rafTick);
}(performance.now()));

/** Returns [cx, cy] at fractional position t (0–1) around a rounded rect */
function _posOnRR(t, ox, oy, rw, rh, r) {
  const al = (Math.PI / 2) * r;
  const ss = [rw - 2*r, al, rh - 2*r, al, rw - 2*r, al, rh - 2*r, al];
  const tot = ss.reduce((a, b) => a + b, 0);
  let d = ((t * tot) % tot + tot) % tot;
  /* Top edge (L→R) */
  if (d < ss[0]) { return [ox + r + (d / ss[0]) * (rw - 2*r), oy]; } d -= ss[0];
  /* Top-right arc */
  if (d < ss[1]) { const a = -Math.PI/2 + (d/al)*(Math.PI/2); return [ox+rw-r + r*Math.cos(a), oy+r   + r*Math.sin(a)]; } d -= ss[1];
  /* Right edge (T→B) */
  if (d < ss[2]) { return [ox + rw, oy + r + (d / ss[2]) * (rh - 2*r)]; } d -= ss[2];
  /* Bottom-right arc */
  if (d < ss[3]) { const a =             (d/al)*(Math.PI/2); return [ox+rw-r + r*Math.cos(a), oy+rh-r + r*Math.sin(a)]; } d -= ss[3];
  /* Bottom edge (R→L) */
  if (d < ss[4]) { return [ox + rw - r - (d / ss[4]) * (rw - 2*r), oy + rh]; } d -= ss[4];
  /* Bottom-left arc */
  if (d < ss[5]) { const a =  Math.PI/2 + (d/al)*(Math.PI/2); return [ox+r   + r*Math.cos(a), oy+rh-r + r*Math.sin(a)]; } d -= ss[5];
  /* Left edge (B→T) */
  if (d < ss[6]) { return [ox, oy + rh - r - (d / ss[6]) * (rh - 2*r)]; } d -= ss[6];
  /* Top-left arc */
  const a = Math.PI + (d / al) * (Math.PI / 2);
  return [ox + r + r*Math.cos(a), oy + r + r*Math.sin(a)];
}

/* ----------------------------------------------------------------
   DATA
---------------------------------------------------------------- */
async function loadData() {
  try {
    const [dataRes, videosRes] = await Promise.all([
      fetch('./data.json'),
      fetch('./videos.json').catch(() => null)   // optional — won't break if missing
    ]);
    const data = await dataRes.json();

    if (videosRes && videosRes.ok) {
      const videosFile = await videosRes.json();
      // Merge YouTube links from videos.json into data, overriding any empty array
      if (Array.isArray(videosFile.videos) && videosFile.videos.length > 0) {
        data.youtube = videosFile.videos;
      }
    }

    return data;
  } catch (e) {
    console.error('Could not load data', e);
    return {};
  }
}

/* ================================================================
   HERO — full bleed
================================================================ */
function renderHero(hero) {
  if (!hero) return;
  const bg   = document.getElementById('heroBg');
  const name = document.getElementById('heroName');
  if (bg)   bg.style.backgroundImage = `url('${hero.photo}')`;
  if (name) name.textContent = hero.name || '';
}

/* ================================================================
   ABOUT
================================================================ */
function renderAbout(about) {
  if (!about) return;
  const img     = document.getElementById('aboutImg');
  const heading = document.getElementById('aboutHeading');
  const bio     = document.getElementById('aboutBio');

  if (img)     { img.src = about.photo || ''; img.alt = 'Rohit Ranjan'; }
  if (heading && about.heading) {
    const lines = about.heading.split('\n');
    heading.innerHTML = lines.map((l, i) =>
      i === 1 ? `<em>${l.trim()}</em>` : l.trim()
    ).join('<br>');
  }
  if (bio && about.bio) {
    about.bio.split('\n\n').forEach(para => {
      if (!para.trim()) return;
      const p = document.createElement('p');
      p.textContent = para.trim();
      bio.appendChild(p);
    });
  }
}

/* ================================================================
   GALLERY — 2-column with captions + red string
================================================================ */
let galleryPhotos = [];
let currentLightboxIndex = 0;
let lightboxType = 'photo';

function renderGallery(photos) {
  galleryPhotos = photos || [];
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  galleryPhotos.forEach((photo, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(Math.min(i * 60, 400)));

    // Image wrapper (for aspect ratio + overlay)
    const imgWrap = document.createElement('div');
    imgWrap.className = 'gallery-card-img-wrap';

    const img = document.createElement('img');
    img.src  = photo.src;
    img.alt  = photo.alt || '';
    img.loading = 'lazy';

    // Overlay buttons
    const overlay = document.createElement('div');
    overlay.className = 'gallery-card-overlay';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'gallery-overlay-btn';
    viewBtn.title = 'View full screen';
    viewBtn.innerHTML = '&#128269;';
    viewBtn.addEventListener('click', e => { e.stopPropagation(); openLightboxPhoto(i); });

    const dlBtn = document.createElement('button');
    dlBtn.className = 'gallery-overlay-btn';
    dlBtn.title = 'Download';
    dlBtn.innerHTML = '&#11015;';
    dlBtn.addEventListener('click', e => { e.stopPropagation(); openDownloadModal(photo.src); });

    overlay.appendChild(viewBtn);
    overlay.appendChild(dlBtn);
    imgWrap.appendChild(img);
    imgWrap.appendChild(overlay);

    // Caption
    const caption = document.createElement('div');
    caption.className = 'gallery-caption';
    caption.textContent = photo.caption || photo.alt || '';

    card.appendChild(imgWrap);
    card.appendChild(caption);
    card.addEventListener('click', () => openLightboxPhoto(i));

    grid.appendChild(card);
  });

  requestAnimationFrame(() => initRedStringAnimations());
}

/* ================================================================
   RED STRING ANIMATION
================================================================ */
function initRedStringAnimations() {
  document.querySelectorAll('.gallery-card').forEach((card, idx) => {
    const isMobile = window.innerWidth < 600;
    if (isMobile && idx % 2 !== 0) return;
    addRedString(card);
  });
}

function addRedString(card) {
  const existing = card.querySelector('.photo-string-svg');
  if (existing) existing.remove();

  const imgWrap = card.querySelector('.gallery-card-img-wrap');
  if (!imgWrap) return;

  const w = imgWrap.offsetWidth;
  const h = imgWrap.offsetHeight;
  if (!w || !h) return;

  const dur = (4 + Math.random() * 2).toFixed(2);
  const uid = 'sp' + Math.random().toString(36).slice(2, 8);
  const perimeter = 2 * (w + h);
  const tailLen   = Math.min(perimeter * 0.48, 390);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'photo-string-svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');

  // (rectPath no longer needed — dot is JS-driven)

  // Tail
  const tail = document.createElementNS(svgNS, 'rect');
  tail.setAttribute('x', '3'); tail.setAttribute('y', '3');
  tail.setAttribute('width', String(w - 6));
  tail.setAttribute('height', String(h - 6));
  tail.setAttribute('rx', '8'); tail.setAttribute('ry', '8');
  tail.setAttribute('fill', 'none');
  tail.setAttribute('stroke', '#D32F2F');
  tail.setAttribute('stroke-width', '5');
  tail.setAttribute('stroke-linecap', 'round');
  tail.setAttribute('stroke-dasharray', `${tailLen} ${perimeter}`);
  tail.setAttribute('stroke-dashoffset', '0');

  const tailAnim = document.createElementNS(svgNS, 'animate');
  tailAnim.setAttribute('attributeName', 'stroke-dashoffset');
  tailAnim.setAttribute('from', '0');
  tailAnim.setAttribute('to', String(-perimeter));
  tailAnim.setAttribute('dur', `${dur}s`);
  tailAnim.setAttribute('repeatCount', 'indefinite');
  tailAnim.setAttribute('calcMode', 'linear');
  tail.appendChild(tailAnim);

  // Dot — JS-driven (requestAnimationFrame), reliable in all browsers
  // Clean up any previous animation registered for this card
  if (card._rsDot) {
    const idx = window._rsDots.indexOf(card._rsDot);
    if (idx !== -1) window._rsDots.splice(idx, 1);
  }

  const dot = document.createElementNS(svgNS, 'circle');
  dot.setAttribute('r', '5');
  dot.setAttribute('fill', '#D32F2F');
  dot.setAttribute('stroke', '#ffffff');   // white ring makes it pop against the tail
  dot.setAttribute('stroke-width', '1.5');
  dot.setAttribute('cx', String(3 + 8));   // initial position: start of top edge
  dot.setAttribute('cy', '3');

  // phase = tailLen/perimeter puts dot exactly at the leading edge (front of tail)
  const rsDot = {
    dot,
    t0:    performance.now(),
    dur:   parseFloat(dur),
    phase: tailLen / perimeter,
    ox: 3, oy: 3, rw: w - 6, rh: h - 6, r: 8
  };
  card._rsDot = rsDot;
  window._rsDots.push(rsDot);

  svg.appendChild(tail);
  svg.appendChild(dot);   // dot painted on top of the tail

  imgWrap.appendChild(svg);
}

/* ================================================================
   VIDEO SECTIONS
================================================================ */
function renderVideo(wrapId, videoData) {
  const wrap = document.getElementById(wrapId);
  if (!wrap || !videoData) return;
  const video = document.createElement('video');
  video.src = videoData.src;
  video.poster = videoData.thumbnail || '';
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.addEventListener('click', () => openLightboxVideo(videoData.src, videoData.thumbnail));
  wrap.appendChild(video);
}

/* ================================================================
   PERFORMANCES — with metadata
================================================================ */
const PLAY_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.35)"/><polygon points="9.5,7 18,12 9.5,17" fill="white"/></svg>`;
const ARROW_SVG = `<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`;

function renderPerformances(performances) {
  const grid = document.getElementById('performancesGrid');
  if (!grid) return;
  if (!performances || performances.length === 0) {
    grid.innerHTML = '<p style="color:var(--color-text-muted);font-size:var(--font-size-lg);">More clips coming soon.</p>';
    return;
  }

  performances.forEach((perf, i) => {
    const card = document.createElement('div');
    card.className = 'performance-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(i * 100));

    // Thumbnail
    const thumb = document.createElement('div');
    thumb.className = 'performance-thumb';
    const img = document.createElement('img');
    img.src = perf.thumbnail || '';
    img.alt = perf.title || '';
    img.loading = 'lazy';
    const playIcon = document.createElement('div');
    playIcon.className = 'performance-play-icon';
    playIcon.innerHTML = PLAY_SVG;
    thumb.appendChild(img);
    thumb.appendChild(playIcon);

    // Metadata
    const meta = document.createElement('div');
    meta.className = 'performance-meta';

    const metaTop = document.createElement('div');
    metaTop.className = 'performance-meta-top';
    metaTop.textContent = [perf.role, perf.year, perf.medium].filter(Boolean).join(' · ');

    const title = document.createElement('div');
    title.className = 'performance-meta-title';
    title.textContent = perf.title || '';

    const watchBtn = document.createElement('button');
    watchBtn.className = 'performance-watch-btn';
    watchBtn.innerHTML = `Watch Recording ${ARROW_SVG}`;

    meta.appendChild(metaTop);
    meta.appendChild(title);
    meta.appendChild(watchBtn);

    card.appendChild(thumb);
    card.appendChild(meta);

    card.addEventListener('click', () => openLightboxVideo(perf.src, perf.thumbnail));
    watchBtn.addEventListener('click', e => { e.stopPropagation(); openLightboxVideo(perf.src, perf.thumbnail); });

    grid.appendChild(card);
  });
}

/* ================================================================
   YOUTUBE
================================================================ */
function renderYouTube(links) {
  const grid = document.getElementById('youtubeGrid');
  if (!grid) return;
  if (!links || links.length === 0) {
    grid.innerHTML = '<p class="youtube-empty">YouTube videos coming soon.</p>';
    return;
  }
  links.forEach((item, i) => {
    const url   = typeof item === 'string' ? item : item.url;
    const title = typeof item === 'string' ? `Video ${i + 1}` : (item.title || `Video ${i + 1}`);
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    const card = document.createElement('div');
    card.className = 'youtube-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(Math.min(i * 50, 300)));

    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'youtube-thumb';
    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    img.alt = title; img.loading = 'lazy';
    const badge = document.createElement('div');
    badge.className = 'youtube-play-badge';
    badge.innerHTML = PLAY_SVG;
    thumbDiv.appendChild(img); thumbDiv.appendChild(badge);

    const info = document.createElement('div');
    info.className = 'youtube-info';
    const h3 = document.createElement('h3');
    h3.textContent = title;
    info.appendChild(h3);

    card.appendChild(thumbDiv); card.appendChild(info);
    card.addEventListener('click', () => openLightboxYouTube(`https://www.youtube.com/embed/${videoId}?autoplay=1`));
    grid.appendChild(card);
  });
}

function extractYouTubeId(url) {
  if (!url) return null;
  for (const p of [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^&]+)/, /youtube\.com\/embed\/([^?&]+)/]) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/* ================================================================
   CONTACT + NAVBAR ICONS
================================================================ */
function renderContact(contact) {
  if (!contact) return;
  const navContact = document.getElementById('navbarContact');
  const icons = [
    { href: `tel:${contact.phone}`, title: 'Phone', emoji: '📞' },
    { href: `https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`, title: 'WhatsApp', emoji: '💬' },
    { href: `https://instagram.com/${contact.instagram.replace('@','')}`, title: 'Instagram', emoji: '📸' },
    { href: `mailto:${contact.email}`, title: 'Email', emoji: '✉️' },
  ];
  if (navContact) {
    icons.forEach(({ href, title, emoji }) => {
      const a = document.createElement('a');
      a.href = href; a.title = title; a.className = 'nav-contact-icon';
      a.textContent = emoji; a.target = '_blank'; a.rel = 'noopener noreferrer';
      navContact.appendChild(a);
    });
  }

  const cardsEl = document.getElementById('contactCards');
  if (cardsEl) {
    const items = [
      { href: `tel:${contact.phone}`,     icon: '📞', label: 'Phone',     value: contact.phone },
      { href: `https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`, icon: '💬', label: 'WhatsApp', value: contact.whatsapp },
      { href: `https://instagram.com/${contact.instagram.replace('@','')}`, icon: '📸', label: 'Instagram', value: contact.instagram, ext: true },
      { href: `mailto:${contact.email}`,  icon: '✉️', label: 'Email',     value: contact.email },
    ];
    items.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href; a.className = 'contact-card';
      if (item.ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.innerHTML = `
        <span class="contact-card-icon">${item.icon}</span>
        <div>
          <span class="contact-card-label">${item.label}</span>
          <span class="contact-card-value">${item.value}</span>
        </div>`;
      cardsEl.appendChild(a);
    });
  }
}

/* ================================================================
   LIGHTBOX
================================================================ */
const lightbox        = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

function openLightboxPhoto(index) {
  currentLightboxIndex = index; lightboxType = 'photo';
  showLightboxPhoto();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function showLightboxPhoto() {
  const photo = galleryPhotos[currentLightboxIndex];
  if (!photo) return;
  lightboxContent.innerHTML = '';
  const img = document.createElement('img');
  img.src = photo.src; img.alt = photo.alt || '';
  lightboxContent.appendChild(img);
  updateLightboxNav();
}
function openLightboxVideo(src, poster) {
  lightboxType = 'video';
  lightboxContent.innerHTML = '';
  const video = document.createElement('video');
  video.src = src; video.poster = poster || '';
  video.controls = true; video.autoplay = true; video.playsInline = true;
  lightboxContent.appendChild(video);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  hideLightboxNav();
}
function openLightboxYouTube(embedUrl) {
  lightboxType = 'youtube';
  lightboxContent.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl; iframe.title = 'YouTube video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  lightboxContent.appendChild(iframe);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  hideLightboxNav();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxContent.innerHTML = '';
}
function updateLightboxNav() {
  if (lightboxType !== 'photo') { hideLightboxNav(); return; }
  lightboxPrev.classList.toggle('hidden', currentLightboxIndex <= 0);
  lightboxNext.classList.toggle('hidden', currentLightboxIndex >= galleryPhotos.length - 1);
}
function hideLightboxNav() {
  lightboxPrev.classList.add('hidden');
  lightboxNext.classList.add('hidden');
}
function navLightbox(dir) {
  const next = currentLightboxIndex + dir;
  if (next < 0 || next >= galleryPhotos.length) return;
  currentLightboxIndex = next; showLightboxPhoto();
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
lightboxPrev.addEventListener('click', () => navLightbox(-1));
lightboxNext.addEventListener('click', () => navLightbox(1));
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft'  && lightboxType === 'photo') navLightbox(-1);
  if (e.key === 'ArrowRight' && lightboxType === 'photo') navLightbox(1);
});

/* ================================================================
   DOWNLOAD MODAL
================================================================ */
const downloadOverlay    = document.getElementById('downloadOverlay');
const downloadModalClose = document.getElementById('downloadModalClose');
let pendingDownloadSrc   = '';

function openDownloadModal(src) {
  pendingDownloadSrc = src;
  downloadOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDownloadModal() {
  downloadOverlay.classList.remove('open');
  document.body.style.overflow = '';
  pendingDownloadSrc = '';
}
downloadModalClose.addEventListener('click', closeDownloadModal);
downloadOverlay.addEventListener('click', e => { if (e.target === downloadOverlay) closeDownloadModal(); });
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (pendingDownloadSrc) downloadImage(pendingDownloadSrc, btn.dataset.quality);
    closeDownloadModal();
  });
});

function downloadImage(src, quality) {
  const scale = quality === 'small' ? 0.35 : quality === 'medium' ? 0.65 : 1.0;
  const jpegQ = quality === 'small' ? 0.50 : quality === 'medium' ? 0.78 : 0.92;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(img.naturalWidth  * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) return;
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${src.split('/').pop().replace(/\.[^.]+$/, '')}-${quality}.jpg`;
      link.href = url; link.click();
      URL.revokeObjectURL(url);
    }, 'image/jpeg', jpegQ);
  };
  img.onerror = () => {
    const link = document.createElement('a');
    link.href = src; link.download = src.split('/').pop(); link.click();
  };
  img.src = src;
}

/* ================================================================
   NAVIGATION
================================================================ */
function initNavigation() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  const allLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));

  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));

  allLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();

  renderHero(data.hero);
  renderAbout(data.about);
  renderGallery(data.photos);
  renderVideo('introVideoWrap', data.introVideo);
  renderVideo('showreelWrap',   data.showreel);
  renderPerformances(data.performances);
  renderYouTube(data.youtube);
  renderContact(data.contact);
  initNavigation();

  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 80 });

  // Rebuild red string on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.photo-string-svg').forEach(s => s.remove());
      initRedStringAnimations();
    }, 300);
  });

  console.log('✓ Portfolio loaded');
});
