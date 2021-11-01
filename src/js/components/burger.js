  const body = document.body;
  const burgerMenu = document.querySelector('.burger__menu');
  const burgerContain = document.querySelector('.burger__container');
  const menuList = document.querySelector('.menu__list');
  const menuTel = document.querySelector('.tel');

  burgerMenu.addEventListener('click', function () {
    [body, burgerContain, menuList, menuTel].forEach(function (el) {
      el.classList.toggle('open');
    });
  }, false);