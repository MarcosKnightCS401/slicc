import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';

  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  // Expected: 3 top-level divs — brand, sections, tools
  const [brandDiv, sectionsDiv, toolsDiv] = [...tmp.children];

  // ── Utility bar (top row) ──
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';
  if (toolsDiv) utilityBar.append(toolsDiv);

  // ── Main nav row (bottom row) ──
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'true');

  // Brand
  if (brandDiv) {
    brandDiv.classList.add('nav-brand');
    nav.append(brandDiv);
  }

  // Sections
  if (sectionsDiv) {
    sectionsDiv.classList.add('nav-sections');

    // Unwrap <p><a> in nav sections so dropdowns work
    sectionsDiv.querySelectorAll('li > p > a').forEach((a) => {
      a.parentElement.replaceWith(a);
    });

    // Dropdown handling
    const items = sectionsDiv.querySelectorAll(':scope > ul > li');
    items.forEach((item) => {
      if (item.querySelector('ul')) {
        item.classList.add('nav-drop');
        const link = item.querySelector(':scope > a');
        if (link) {
          link.addEventListener('mouseenter', () => {
            items.forEach((i) => i.classList.remove('nav-drop-open'));
            item.classList.add('nav-drop-open');
          });
          link.addEventListener('click', (e) => {
            if (window.innerWidth < 900) {
              e.preventDefault();
              item.classList.toggle('nav-drop-open');
            }
          });
        }
        item.addEventListener('mouseleave', () => {
          item.classList.remove('nav-drop-open');
        });
      }
    });

    nav.append(sectionsDiv);
  }

  // Search box
  const searchForm = document.createElement('form');
  searchForm.className = 'nav-search';
  searchForm.setAttribute('action', '/en/search-results.html');
  searchForm.setAttribute('method', 'get');
  searchForm.innerHTML = `<input type="search" name="q" placeholder="What can we help you find?" aria-label="Search"><button type="submit" aria-label="Search"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>`;
  nav.append(searchForm);

  // Hamburger
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
    document.body.style.overflow = expanded ? '' : 'hidden';
  });
  nav.prepend(hamburger);

  block.innerHTML = '';
  block.append(utilityBar, nav);
}
