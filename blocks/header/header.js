import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Fetch nav fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  block.innerHTML = '';
  block.append(...tmp.children);

  const nav = document.createElement('nav');
  nav.id = 'nav';

  const children = [...block.children];
  const classes = ['brand', 'sections', 'tools'];
  children.forEach((child, i) => {
    if (i < classes.length) child.classList.add(`nav-${classes[i]}`);
    nav.append(child);
  });

  // Hamburger button
  const hamburger = document.createElement('button');
  hamburger.classList.add('nav-hamburger');
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', !expanded);
    document.body.style.overflow = expanded ? '' : 'hidden';
  });
  nav.prepend(hamburger);

  // Dropdown handling
  const sections = nav.querySelector('.nav-sections');
  if (sections) {
    const items = sections.querySelectorAll(':scope > ul > li');
    items.forEach((item) => {
      if (item.querySelector('ul')) {
        item.classList.add('nav-drop');
        const link = item.querySelector(':scope > a');
        if (link) {
          link.addEventListener('click', (e) => {
            if (window.innerWidth < 900) {
              e.preventDefault();
              item.classList.toggle('nav-drop-open');
            }
          });
          link.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 900) {
              items.forEach((i) => i.classList.remove('nav-drop-open'));
              item.classList.add('nav-drop-open');
            }
          });
        }
        item.addEventListener('mouseleave', () => {
          if (window.innerWidth >= 900) item.classList.remove('nav-drop-open');
        });
      }
    });
  }

  const mql = window.matchMedia('(min-width: 900px)');
  function handleMedia(e) {
    nav.setAttribute('aria-expanded', e.matches ? 'true' : 'false');
  }
  mql.addEventListener('change', handleMedia);
  handleMedia(mql);

  block.innerHTML = '';
  block.append(nav);
  block.classList.add('nav-wrapper');

  // Add nav padding to main
  document.querySelector('main').style.marginTop = 'var(--nav-height, 125px)';
}
