export default async function decorate(block) {
  // In EDS, footer.js decorates the <footer> element.
  // Load footer CSS explicitly since the fragment pipeline doesn't auto-load it.
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/blocks/footer/footer.css';
  document.head.append(link);
}
