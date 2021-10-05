'use strict';

(function () {
  const header = document.querySelector('.header');
  const headerToggle = header.querySelector('.header__toggle')
  const headerLinkDescription = header.querySelectorAll('.header__text')
  const projectNavigationList = header.querySelector('.project-navigation__list')
  const mainNavigationInbox = header.querySelector('.main-navigation__inbox')

  header.classList.add('header--close');
  projectNavigationList.classList.add('project-navigation__list--close');
  mainNavigationInbox.classList.add('main-navigation__inbox--close');
  headerLinkDescription.forEach((link) => link.classList.add('header__text--close'));

  headerToggle.addEventListener('click', () => {
    if (headerToggle) {
      header.classList.toggle('header--close');
      projectNavigationList.classList.toggle('project-navigation__list--close');
      headerLinkDescription.forEach((link) => link.classList.toggle('header__text--close'));
      mainNavigationInbox.classList.toggle('main-navigation__inbox--close');
    }
  });
})();

