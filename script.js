document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.getElementById('menu-nav');
  const selectEstado = document.getElementById('select-estado');
  const selectCidade = document.getElementById('select-cidade');

  async function carregarEstados() {
    const response = await fetch(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
    );
    const estados = await response.json();

    estados.sort((a, b) => a.nome.localeCompare(b.nome));

    selectEstado.innerHTML = '<option value="">UF</option>';

    estados.forEach(estado => {
      const option = document.createElement('option');
      option.value = estado.sigla;
      option.textContent = estado.nome;
      selectEstado.appendChild(option);
    });
  }

  async function carregarCidades(uf) {
    if (!uf) {
      selectCidade.innerHTML =
        '<option value="">Escolha um estado primeiro</option>';
      selectCidade.disabled = true;
      return;
    }

    selectCidade.disabled = true; // Desabilita enquanto carrega
    selectCidade.innerHTML = '<option value="">Carregando cidades...</option>';

    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );
    const cidades = await response.json();

    selectCidade.innerHTML = '<option value="">Selecione uma cidade</option>';

    cidades.forEach(cidade => {
      const option = document.createElement('option');
      option.value = cidade.nome;
      option.textContent = cidade.nome;
      selectCidade.appendChild(option);
    });

    selectCidade.disabled = false; // Habilita o select de cidades
  }

  carregarEstados();

  selectEstado.addEventListener('change', event => {
    const ufSelecionada = event.target.value;
    carregarCidades(ufSelecionada);
  });

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
