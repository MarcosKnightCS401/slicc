import { loadBlocks, loadHeader, loadFooter } from './aem.js';

async function loadPage() {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  await Promise.all([
    loadHeader(header),
    loadBlocks(main),
    loadFooter(footer),
  ]);
  document.body.classList.add('appear');
}

loadPage();
