/* ./pitpar/js/menu.js */
export function setupMenu() {
  const navLinks = document.getElementById('nav-links');
  const menuToggle = document.getElementById('menu-toggle');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  document.querySelectorAll('#nav-links button').forEach(btn => {
    btn.addEventListener('click', () => {
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}
