import { getMetadata } from '../../scripts/aem.js';

const SOCIAL_LINKS = ['Facebook', 'LinkedIn', 'Instagram', 'X', 'Twitter', 'YouTube'];
const LEGAL_LINKS = ['Legal Notices', 'Privacy Notice', 'Cookie Notice', 'Consumer Health', 'Product Security', 'Site Map', 'Privacy Choices'];

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  const resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  // Get the two source divs
  const [primaryDiv, infoDiv] = [...tmp.children];
  const allLinks = primaryDiv ? [...primaryDiv.querySelectorAll('p')] : [];

  // Separate nav, social, and legal links
  const navLinks = [];
  const socialLinks = [];
  const legalLinks = [];

  allLinks.forEach((p) => {
    const text = p.textContent.trim();
    if (SOCIAL_LINKS.some((s) => text.includes(s))) {
      socialLinks.push(p);
    } else if (LEGAL_LINKS.some((s) => text.includes(s)) || !p.querySelector('a')) {
      legalLinks.push(p);
    } else {
      navLinks.push(p);
    }
  });

  // Build primary section
  const primary = document.createElement('div');
  primary.className = 'footer-primary';

  // Row 1: nav links + social links
  const row1 = document.createElement('div');
  row1.className = 'footer-row-main';

  const navCol = document.createElement('div');
  navCol.className = 'footer-nav-links';
  navLinks.forEach((p) => navCol.append(p));

  const socialCol = document.createElement('div');
  socialCol.className = 'footer-social-links';
  socialLinks.forEach((p) => socialCol.append(p));

  row1.append(navCol, socialCol);

  // Divider
  const hr = document.createElement('hr');

  // Row 2: legal links
  const row2 = document.createElement('div');
  row2.className = 'footer-legal-links';
  legalLinks.forEach((p) => row2.append(p));

  primary.append(row1, hr, row2);

  // Info section
  const info = document.createElement('div');
  info.className = 'footer-info';
  if (infoDiv) info.innerHTML = infoDiv.innerHTML;

  block.innerHTML = '';
  block.append(primary, info);
}
