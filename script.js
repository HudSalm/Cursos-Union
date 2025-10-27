const SUPABASE_URL = 'https://pzlgalsmyrldtreifcuv.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bGdhbHNteXJsZHRyZWlmY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzg3NjcsImV4cCI6MjA3NzE1NDc2N30.KspBFfMckMtmyhGhRm67sk0SlNE3YVm8LK_nMMxKK4g';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Script carregado. Cliente Supabase:', supabase);

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.getElementById('menu-nav');
  const selectEstado = document.getElementById('select-estado');
  const selectCidade = document.getElementById('select-cidade');

  const form = document.getElementById('formulario');
  const statusEl = document.getElementById('status');

  if (!form) {
    console.error('Erro: Formulário #formulario não encontrado');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault(); // impede a página de recarregar

    const submitButton = form.querySelector('button');
    submitButton.disabled = true;
    statusEl.className = 'show loading';
    statusEl.textContent = 'Enviando, por favor aguarde...';

    const nomeVal = document.getElementById('nome').value;
    const dddVal = document.getElementById('ddd').value;
    const telefoneVal = document.getElementById('telefone').value;
    const estadoVal = document.getElementById('select-estado').value;
    const cidadeVal = document.getElementById('select-cidade').value;
    const bairroVal = document.getElementById('bairro').value;
    const emailVal = document.getElementById('email').value;

    const { data, error } = await supabase.from('formulario_contato').insert([
      {
        nome: nomeVal,
        ddd: dddVal,
        numero: telefoneVal,
        estado: estadoVal,
        cidade: cidadeVal,
        bairro: bairroVal,
        email: emailVal,
      },
    ]);

    if (error) {
      console.error('Erro no Supabase', error.message);
      statusEl.className = 'show error';
      statusEl.textContent = 'Erro ao enviar' + error.message;
      submitButton.disabled = false;
    } else {
      console.log('Dados salvos', data);
      statusEl.className = 'show success';
      statusEl.textContent = 'Dados enviados com sucesso!';

      form.reset();

      setTimeout(() => {
        submitButton.disabled = false;
        statusEl.textContent = '';
      }, 5000);
    }
  });

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
