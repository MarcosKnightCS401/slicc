/* AEM EDS aem.js stub for local preview */
async function loadBlock(block) {
  const blockName = block.classList[0];
  try {
    const mod = await import(`/blocks/${blockName}/${blockName}.js`);
    if (mod.default) await mod.default(block);
  } catch (e) {
    // block JS optional
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/blocks/${blockName}/${blockName}.css`;
  document.head.append(link);
  block.dataset.blockStatus = 'loaded';
}

async function loadBlocks(main) {
  const blocks = [...main.querySelectorAll('div[class]')].filter(b => !b.dataset.blockStatus);
  await Promise.all(blocks.map(loadBlock));
}

async function loadFragment(path) {
  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

async function loadHeader(header) {
  const meta = document.querySelector('meta[name="nav"]');
  if (!meta) return;
  const frag = await loadFragment(meta.content);
  if (frag) {
    header.classList.add('header', 'block');
    header.dataset.blockName = 'header';
    header.append(...frag.children);
    try {
      const mod = await import('/blocks/header/header.js');
      if (mod.default) await mod.default(header);
    } catch (e) { /* header JS optional */ }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/blocks/header/header.css';
    document.head.append(link);
    header.dataset.blockStatus = 'loaded';
  }
}

async function loadFooter(footer) {
  const meta = document.querySelector('meta[name="footer"]');
  if (!meta) return;
  const frag = await loadFragment(meta.content);
  if (frag) {
    footer.append(...frag.children);
    await loadBlocks(footer);
  }
}

export { loadBlock, loadBlocks, loadFragment, loadHeader, loadFooter };
