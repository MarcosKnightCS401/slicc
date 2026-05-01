export default async function decorate(block) {
  const rows = [...block.children];
  const categories = [];
  let current = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCell = cells[0];
    const secondCell = cells[1];
    const h2 = firstCell?.querySelector('h2');

    if (h2) {
      // This is a category heading row: cell 0 = heading, cell 1 = description
      current = {
        heading: h2.textContent.trim(),
        description: secondCell ? secondCell.innerHTML : '',
        cards: [],
      };
      categories.push(current);
    } else if (current) {
      // This is a product card row: cell 0 = image, cell 1 = title+link
      const img = firstCell?.querySelector('img');
      const link = secondCell?.querySelector('a');
      const h3 = secondCell?.querySelector('h3');
      const hasImage = img && firstCell.innerHTML.trim().length > 0;
      current.cards.push({
        image: hasImage ? firstCell.innerHTML : '',
        title: h3 ? h3.textContent.trim() : '',
        href: link ? link.getAttribute('href') : '#',
      });
    }
  });

  block.innerHTML = '';

  categories.forEach((cat) => {
    const section = document.createElement('div');
    section.className = 'product-category';

    // Heading bar
    const headingBar = document.createElement('div');
    headingBar.className = 'category-heading';
    headingBar.innerHTML = `<h2>${cat.heading}</h2>`;
    section.appendChild(headingBar);

    // Description
    if (cat.description) {
      const desc = document.createElement('div');
      desc.className = 'category-description';
      desc.innerHTML = cat.description;
      section.appendChild(desc);
    }

    // Card grid
    if (cat.cards.length > 0) {
      const grid = document.createElement('div');
      grid.className = 'card-grid';
      cat.cards.forEach((card) => {
        const cardEl = document.createElement('a');
        cardEl.className = 'product-card';
        cardEl.href = card.href;
        if (card.image) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'card-image';
          imgWrap.innerHTML = card.image;
          cardEl.appendChild(imgWrap);
        }
        const titleEl = document.createElement('div');
        titleEl.className = 'card-title';
        titleEl.innerHTML = `<h3>${card.title}</h3>`;
        cardEl.appendChild(titleEl);
        grid.appendChild(cardEl);
      });
      section.appendChild(grid);
    }

    block.appendChild(section);
  });
}
