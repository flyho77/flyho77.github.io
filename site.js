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

// 프로젝트 메뉴: 왼쪽 목록에서 고른 프로젝트만 보여 준다. 스크립트가 꺼져 있으면 전부 이어서 보인다.
const projectLayout = document.querySelector('#pj-layout');
const projectTabs = projectLayout ? [...projectLayout.querySelectorAll('.pj-tab')] : [];

if (projectTabs.length) {
  const panelOf = (tab) => document.getElementById(tab.dataset.panel);
  const menu = projectLayout.querySelector('#pj-menu');
  menu.setAttribute('role', 'tablist');
  menu.setAttribute('aria-orientation', matchMedia('(max-width: 1000px)').matches ? 'horizontal' : 'vertical');
  projectTabs.forEach((tab) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.dataset.panel);
    tab.id = `tab-${tab.dataset.panel}`;
    panelOf(tab).setAttribute('role', 'tabpanel');
    panelOf(tab).setAttribute('aria-labelledby', tab.id);
  });
  projectLayout.classList.add('tabs-ready');

  function showProject(tab, { focus = false, remember = true } = {}) {
    projectTabs.forEach((other) => {
      const on = other === tab;
      other.setAttribute('aria-selected', String(on));
      other.tabIndex = on ? 0 : -1;
      panelOf(other).hidden = !on;
    });
    if (focus) tab.focus();
    if (remember) {
      // 직접 고른 경우에만 살짝 나타나는 효과를 준다.
      const panel = panelOf(tab);
      panel.classList.remove('pj-enter');
      void panel.offsetWidth;
      panel.classList.add('pj-enter');
    }
    if (remember) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (remember) history.replaceState(null, '', `#${tab.dataset.panel}`);
    // 긴 패널을 아래까지 읽다가 바꾸면 새 패널의 첫머리가 보이도록 올려 준다.
    if (remember && panelOf(tab).getBoundingClientRect().top < 0) projectLayout.scrollIntoView();
  }

  projectTabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      showProject(tab);
    });
    tab.addEventListener('keydown', (event) => {
      const last = projectTabs.length - 1;
      const next = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: last }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      showProject(projectTabs[(next + projectTabs.length) % projectTabs.length], { focus: true });
    });
  });

  // 주소 끝에 #pj-gates 처럼 붙어 있으면 그 프로젝트를 먼저 연다.
  const linked = projectTabs.find((tab) => `#${tab.dataset.panel}` === location.hash);
  showProject(linked || projectTabs[0], { remember: false });
  if (linked) document.querySelector('#projects').scrollIntoView({ behavior: 'instant' });
}
