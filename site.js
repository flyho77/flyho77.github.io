// 테마 전환: 고른 값을 기억하고, 고른 적이 없으면 기기 설정을 따른다.
const root = document.documentElement;
const toggle = document.querySelector('#theme-toggle');

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function labelToggle() {
  if (!toggle) return;
  toggle.setAttribute('aria-label', currentTheme() === 'dark' ? '밝은 테마로 바꾸기' : '어두운 테마로 바꾸기');
}

if (toggle) {
  toggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* 저장이 막혀 있어도 전환은 된다 */ }
    labelToggle();
  });
  labelToggle();
}

// 지금 보고 있는 구역을 메뉴에 표시한다.
const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
    const active = sections.find((section) => visible.has(section));
    links.forEach((link) => {
      if (active && link.getAttribute('href') === `#${active.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => observer.observe(section));
}
