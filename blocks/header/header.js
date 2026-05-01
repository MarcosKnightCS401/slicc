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

  // Icons for right utility links
  const UTILITY_ICONS = {
    'find a doctor': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8.96429 1.25C7.07343 1.25 5.53571 2.78771 5.53571 4.67857C5.53571 6.56943 7.07343 8.10714 8.96429 8.10714C10.8551 8.10714 12.3929 6.56943 12.3929 4.67857C12.3929 2.78771 10.8551 1.25 8.96429 1.25ZM14.1071 9.82143C11.7071 9.82143 9.82143 11.7071 9.82143 14.1071C9.82143 16.5071 11.7071 18.3929 14.1071 18.3929C14.9643 18.3929 15.8221 18.135 16.5078 17.7065L18.0497 19.25L19.25 18.0497L17.7065 16.5078C18.135 15.8221 18.3929 14.9643 18.3929 14.1071C18.3929 11.7071 16.5071 9.82143 14.1071 9.82143ZM8.96429 10.6786C6.272 10.6786 1.25 12.0037 1.25 14.5357V16.6786H8.69308C8.32194 15.8986 8.10714 15.0286 8.10714 14.1071C8.10714 12.8343 8.50649 11.6564 9.18192 10.6853C9.10992 10.6836 9.03371 10.6786 8.96429 10.6786ZM14.1071 11.5357C15.5643 11.5357 16.6786 12.65 16.6786 14.1071C16.6786 15.5643 15.5643 16.6786 14.1071 16.6786C12.65 16.6786 11.5357 15.5643 11.5357 14.1071C11.5357 12.65 12.65 11.5357 14.1071 11.5357Z"/></svg>',
    'find a rep': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M11.5 2.15625C7.93713 2.15625 5.03125 5.06213 5.03125 8.625C5.03125 9.63574 5.44116 10.7953 5.99707 12.0615C6.55298 13.3278 7.26892 14.6726 7.99609 15.9248C9.45044 18.432 10.916 20.5293 10.916 20.5293L11.5 21.3828L12.084 20.5293C12.084 20.5293 13.5496 18.432 15.0039 15.9248C15.7311 14.6726 16.447 13.3278 17.0029 12.0615C17.5588 10.7953 17.9688 9.63574 17.9688 8.625C17.9688 5.06213 15.0629 2.15625 11.5 2.15625ZM11.5 3.59375C14.288 3.59375 16.5312 5.83704 16.5312 8.625C16.5312 9.20056 16.2224 10.2899 15.7002 11.4775C15.178 12.6652 14.4564 13.9819 13.7461 15.2061C12.6174 17.1545 11.9155 18.1849 11.5 18.7998C11.0845 18.1849 10.3826 17.1545 9.25391 15.2061C8.54358 13.9819 7.82202 12.6652 7.2998 11.4775C6.77759 10.2899 6.46875 9.20056 6.46875 8.625C6.46875 5.83704 8.71204 3.59375 11.5 3.59375ZM11.5 7.1875C10.7054 7.1875 10.0625 7.83044 10.0625 8.625C10.0625 9.41956 10.7054 10.0625 11.5 10.0625C12.2946 10.0625 12.9375 9.41956 12.9375 8.625C12.9375 7.83044 12.2946 7.1875 11.5 7.1875Z"/></svg>',
  };

  // ── Utility bar (top row) ──
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';
  if (toolsDiv) {
    const uls = toolsDiv.querySelectorAll('ul');
    if (uls.length >= 2) {
      uls[0].className = 'nav-utility-left';
      uls[1].className = 'nav-utility-right';
      // Add icons to right utility links
      uls[1].querySelectorAll('a').forEach((a) => {
        const key = a.textContent.trim().toLowerCase();
        if (UTILITY_ICONS[key]) {
          a.innerHTML = `${UTILITY_ICONS[key]}<span>${a.textContent.trim()}</span>`;
        }
      });
      utilityBar.append(uls[0], uls[1]);
    } else if (uls.length === 1) {
      const allItems = [...uls[0].querySelectorAll('li')];
      const splitIdx = allItems.findIndex((li) => li.textContent.includes('Find a Doctor'));
      const leftUl = document.createElement('ul');
      const rightUl = document.createElement('ul');
      leftUl.className = 'nav-utility-left';
      rightUl.className = 'nav-utility-right';
      allItems.forEach((li, i) => (i < splitIdx ? leftUl : rightUl).append(li));
      rightUl.querySelectorAll('a').forEach((a) => {
        const key = a.textContent.trim().toLowerCase();
        if (UTILITY_ICONS[key]) {
          a.innerHTML = `${UTILITY_ICONS[key]}<span>${a.textContent.trim()}</span>`;
        }
      });
      utilityBar.append(leftUl, rightUl);
    } else {
      utilityBar.append(toolsDiv);
    }
  }

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
