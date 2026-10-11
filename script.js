const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
document.documentElement.classList.add('js');
const closeMenu = () => {
  links?.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
};
toggle?.addEventListener('click', () => {
  const open = links?.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(Boolean(open)));
});
links?.addEventListener('click', closeMenu);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && links?.classList.contains('open')) {
    closeMenu();
    toggle?.focus();
  }
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const index = document.querySelector('.guide-index details');
if (index && window.matchMedia('(max-width:700px)').matches) index.open = false;

const dialog = document.querySelector('#image-dialog');
const full = document.querySelector('#image-full');
const caption = document.querySelector('#image-caption');
const zoom = document.querySelector('#image-zoom');
let opener;
if (dialog?.showModal) {
  document.querySelectorAll('[data-enlarge]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      opener = link;
      full.src = link.href;
      full.alt = link.querySelector('img').alt;
      caption.textContent = full.alt;
      dialog.classList.remove('is-zoomed');
      zoom.textContent = 'Ampliar';
      dialog.showModal();
      document.querySelector('#image-close').focus();
      dialog.querySelector('.image-viewport').scrollTo(0, 0);
    });
  });
  document.querySelector('#image-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  zoom.addEventListener('click', () => {
    const expanded = dialog.classList.toggle('is-zoomed');
    zoom.textContent = expanded ? 'Ajustar' : 'Ampliar';
  });
}

const videos = [...document.querySelectorAll('.feature-video')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ratios = new Map();
const loadVideo = (video) => {
  if (video.getAttribute('src') || !video.dataset.src) return;
  video.src = video.dataset.src;
  video.load();
};
const pauseAll = () => videos.forEach((video) => {
  video.pause();
  video.classList.remove('is-active');
});
if ('IntersectionObserver' in window) {
  const loader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadVideo(entry.target);
      loader.unobserve(entry.target);
    });
  }, { rootMargin: '500px 0px' });
  const player = new IntersectionObserver((entries) => {
    entries.forEach((entry) => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
    if (reduceMotion.matches || document.hidden) return;
    const candidate = videos.filter((video) => (ratios.get(video) || 0) >= 0.6)
      .sort((a, b) => ratios.get(b) - ratios.get(a))[0];
    videos.forEach((video) => {
      if (video === candidate) {
        loadVideo(video);
        video.play().catch(() => {});
        video.classList.add('is-active');
      } else {
        video.pause();
        video.classList.remove('is-active');
      }
    });
  }, { threshold: [0, 0.6, 0.85] });
  videos.forEach((video) => { loader.observe(video); player.observe(video); });
} else {
  videos.forEach(loadVideo);
}
videos.forEach((video) => video.addEventListener('play', () => {
  videos.filter((other) => other !== video).forEach((other) => other.pause());
}));
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) pauseAll(); });
