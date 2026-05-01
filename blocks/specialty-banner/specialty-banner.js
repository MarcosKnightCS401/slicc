export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const row = rows[0];
  const cells = [...row.children];

  // Cell 0: background image, Cell 1: text content
  const imageCell = cells[0];
  const textCell = cells[1];

  // Set up background image from cell 0
  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      imageCell.className = 'bg-image';
      imageCell.innerHTML = '';
      imageCell.append(picture);
    }
  }

  // Set up content from cell 1
  if (textCell) {
    textCell.className = 'content';
  }

  // Flatten: move cells directly under block
  block.innerHTML = '';
  if (imageCell) block.append(imageCell);
  if (textCell) block.append(textCell);
}
