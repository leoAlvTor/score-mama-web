const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

links?.addEventListener('click', () => {
  links.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
});

document.querySelector('#year').textContent = new Date().getFullYear();

const featureVideos = [...document.querySelectorAll('.feature-video')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const loadVideo = (video) => {
  if (video.src || !video.dataset.src) return;
  video.src = video.dataset.src;
  video.load();
};

const loader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    loadVideo(entry.target);
    loader.unobserve(entry.target);
  });
}, { rootMargin: '500px 0px' });

const player = new IntersectionObserver((entries) => {
  if (reduceMotion) return;
  const candidate = entries
    .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!candidate) {
    entries.filter((entry) => !entry.isIntersecting).forEach((entry) => {
      entry.target.pause();
      entry.target.classList.remove('is-active');
    });
    return;
  }

  featureVideos.forEach((video) => {
    if (video === candidate.target) {
      loadVideo(video);
      video.play().catch(() => {});
      video.classList.add('is-active');
    } else {
      video.pause();
      video.classList.remove('is-active');
    }
  });
}, { threshold: [0, 0.6, 0.85] });

featureVideos.forEach((video) => {
  loader.observe(video);
  player.observe(video);
});
