import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
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

  // Fix logo img src — resolve relative media_ URLs to absolute nav path
  const logoImg = nav.querySelector('.nav-brand img');
  if (logoImg) {
    ['src', ...logoImg.getAttributeNames().filter((a) => a.startsWith('srcset'))]
      .forEach((attr) => {
        const val = logoImg.getAttribute(attr);
        if (val && val.startsWith('./media_')) {
          logoImg.setAttribute(attr, val.replace('./', `${navPath.replace('/nav', '')}/`));
        }
      });
    [...nav.querySelectorAll('.nav-brand source')].forEach((s) => {
      const val = s.getAttribute('srcset');
      if (val && val.startsWith('./media_')) {
        s.setAttribute('srcset', val.replace('./', `${navPath.replace('/nav', '')}/`));
      }
    });
  }

  // Unwrap <p><a> in nav sections so dropdowns work correctly
  nav.querySelectorAll('.nav-sections li > p > a').forEach((a) => {
    const p = a.parentElement;
    p.replaceWith(a);
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

  // Inject search box into nav row
  const searchForm = document.createElement('form');
  searchForm.className = 'nav-search';
  searchForm.setAttribute('action', '/en/search-results.html');
  searchForm.setAttribute('method', 'get');
  searchForm.innerHTML = `
    <input type="search" name="q" placeholder="What can we help you find?" aria-label="Search">
    <button type="submit" aria-label="Submit search">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </button>`;
  nav.append(searchForm);

  block.innerHTML = '';
  block.append(nav);
  block.classList.add('nav-wrapper');
}
