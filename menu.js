const button = document.querySelector('.button');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu-link');

if (button && menu) {
  button.addEventListener('click', () => {
    const isActive = button.classList.toggle('active');

    button.setAttribute('aria-expanded', String(isActive));
    menu.setAttribute('aria-hidden', String(!isActive));

    menuLinks.forEach(link => {
      link.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  });
}