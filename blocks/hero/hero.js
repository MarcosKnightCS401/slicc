export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const row = rows[0];
  const cells = [...row.children];

  // First cell has the background image, second cell has text content
  if (cells.length >= 2) {
    const imgCell = cells[0];
    const textCell = cells[1];

    // Extract image from first cell and use as background
    const img = imgCell.querySelector('img');
    if (img) {
      block.style.backgroundImage = `url(${img.src})`;
      block.style.backgroundSize = 'contain';
      block.style.backgroundPosition = 'center right';
      block.style.backgroundRepeat = 'no-repeat';
    }

    // Hide the image cell
    imgCell.style.display = 'none';
  }
}
