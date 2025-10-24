document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.getElementById('menu-nav');

  menuToggle.addEventListener('click', function () {
    menuToggle.classList.toggle('aberto');
    menuNav.classList.toggle('aberto');
  });

  if (document.querySelector('.formacoes')) {
    const swiper = new Swiper('.formacoes', {
      loop: true,
      // Configuração padrão (Mobile)
      slidesPerView: 1,
      spaceBetween: 10,

      // Paginação (bolinhas)
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      // Navegação (setas)
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // Breakpoints para Desktop (como você pediu)
      breakpoints: {
        // Quando a tela for 768px ou maior
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }
});
