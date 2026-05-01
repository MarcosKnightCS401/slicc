export default async function decorate(block) {
  // Structure: single row with text cell + image cell
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      cells[0].classList.add('cta-banner-text');
      cells[1].classList.add('cta-banner-image');
    }
  });

  // Ensure CTA links get button class (EDS decorateButtons may not run in all stubs)
  block.querySelectorAll('.cta-banner-text p > a:only-child').forEach((a) => {
    a.classList.add('button');
    a.parentElement.classList.add('button-container');
  });
}
