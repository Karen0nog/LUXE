// ...existing code...
const URL_API = 'http://localhost:3000/api/produtos';

/**
 * Gera o HTML de um card de produto.
 */
function criarCardProduto(produto) {
    const imagem = produto?.image || './assets/img/relogio(1).jpg';
    const nome = produto?.name || 'Produto';
    const categoria = produto?.category || '';
    const preco = Number(produto?.price || 0).toFixed(2);
    const id = produto?._id || '';

    return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${imagem}" class="card-img-top" alt="${nome}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nome}</h5>
          <p class="text-muted small mb-2">${categoria}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold fs-5">R$ ${preco}</span>
          </div>
          <button class="btn btn-primary mt-3 w-100 rounded-pill" data-product-id="${id}">
            <i class="fas fa-shopping-cart me-2"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
    `;
}

function renderFeaturedProducts(produtos = []) {
  const container = document.querySelector('#featuredProductsContainer');
  if (!container) return;

  const featured = produtos.slice(0, 4);
  if (featured.length === 0) {
    container.innerHTML = '<div class="col-12 text-center text-muted">Nenhum produto em destaque.</div>';
    return;
  }

  container.innerHTML = featured.map(p => criarCardProduto(p)).join('');
}

async function renderizarCatalogo() {
    const catalogoContainer = document.querySelector('#catalogProductsContainer');
    const loadingMessage = document.querySelector('#catalogLoadingMessage');

    if (!catalogoContainer) {
        console.error('Elemento do catálogo não encontrado (#catalogProductsContainer).');
        return;
    }

    if (loadingMessage) {
        loadingMessage.textContent = 'Carregando produtos...';
    }

  try {
    console.debug('[catalog] Fetching:', URL_API);
    const resposta = await fetch(URL_API);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const json = await resposta.json();
    console.debug('[catalog] JSON recebido:', json);

    // Suporta formatos comuns: array direto, { data: [...] }, { produtos: [...] }
    let produtos = [];
    if (Array.isArray(json)) {
      produtos = json;
    } else if (Array.isArray(json?.data)) {
      produtos = json.data;
    } else if (Array.isArray(json?.produtos)) {
      produtos = json.produtos;
    } else {
      // tenta encontrar o primeiro array dentro do objeto
      const firstArray = Object.values(json).find(v => Array.isArray(v));
      if (Array.isArray(firstArray)) produtos = firstArray;
    }

    // Se a resposta não for um array ou estiver vazia, avisa o usuário
    if (!Array.isArray(produtos) || produtos.length === 0) {
      catalogoContainer.innerHTML = '<div class="col-12 text-center text-muted">Nenhum produto encontrado.</div>';
      loadingMessage?.remove();
      return;
    }

    // Mapear os produtos para HTML e inserir no container
    const htmlProdutos = produtos.map(p => criarCardProduto(p)).join('');
    catalogoContainer.innerHTML = htmlProdutos;

    // Renderiza produtos em destaque na landing (Mais Vendidos)
    renderFeaturedProducts(produtos);

    // Desoculta a seção do catálogo caso esteja oculta (d-none)
    const catalogSection = document.querySelector('#catalogPageContent');
    if (catalogSection?.classList.contains('d-none')) {
      catalogSection.classList.remove('d-none');
      console.debug('[catalog] catalogPageContent desocultado');
    }

  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    catalogoContainer.innerHTML = `<div class="col-12 text-center text-danger">Erro ao carregar produtos: ${erro.message}</div>`;
  } finally {
    loadingMessage?.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
});
// ...existing code...