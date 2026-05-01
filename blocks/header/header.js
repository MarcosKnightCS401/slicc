export default async function decorate(block) {
  const nav = document.createElement('nav');
  nav.id = 'nav';

  const children = [...block.children];
  // Expected structure: [brand-div, sections-div, tools-div]
  const classes = ['brand', 'sections', 'tools'];
  children.forEach((child, i) => {
    if (i < classes.length) {
      child.classList.add(`nav-${classes[i]}`);
    }
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
          if (window.innerWidth >= 900) {
            item.classList.remove('nav-drop-open');
          }
        });
      }
    });
  }

  // Set desktop expanded
  const mql = window.matchMedia('(min-width: 900px)');
  function handleMedia(e) {
    nav.setAttribute('aria-expanded', e.matches);
    if (e.matches) document.body.style.overflow = '';
  }
  mql.addEventListener('change', handleMedia);
  handleMedia(mql);

  block.innerHTML = '';
  block.append(nav);
}
