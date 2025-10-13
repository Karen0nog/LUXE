const URL_API = 'http://localhost:3000/api/produtos';

async function renderizarCatalogo() {
const catalogoContainer = document.querySelector('#catalogProductsContainer');
const loadingMessage = document.querySelector('#catalogLoadingMessage');

if(!catalogoContainer) {
    console.error('Elemento do catálogo não encontrado');
    return;
}
try{
    const resposta = await fetch(URL_API);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const produtosDoServidor = await resposta.json();

     if (!Array.isArray(produtosDoServidor) || produtosDoServidor.length === 0) {
            catalogoContainer.innerHTML = '<div class="col-12 text-center text-muted">Nenhum produto encontrado.</div>';
            loadingMessage?.remove();
            return;
        }

        if (typeof criarCardProduto !== 'function') {
            console.error('Função criarCardProduto() não encontrada.');
            catalogoContainer.innerHTML = '<div class="col-12 text-center text-danger">Erro interno: função de renderização ausente.</div>';
            loadingMessage?.remove();
            return;
        }

        const htmlProdutos = produtosDoServidor.map(produto => criarCardProduto(produto)).join('');
        catalogoContainer.innerHTML = htmlProdutos;

    } catch(erro) {
        // Handle error here
        console.error(erro);
        loadingMessage?.remove();
        catalogoContainer.innerHTML = `<div class="col-12 text-center text-danger">Erro ao carregar produtos: ${erro.message}</div>`;
    }
}
    
renderizarCatalogo();


function criarCardProduto(produto) {
    return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${produto.image || './assets/img/relogio(1).jpg'}" class="card-img-top" alt="${produto.name || 'Produto'}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${produto.name || ''}</h5>
          <p class="text-muted small mb-2">${produto.category || ''}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold fs-5">R$ ${Number(produto.price || 0).toFixed(2)}</span>
          </div>
          <button class="btn btn-primary mt-3 w-100 rounded-pill" data-product-id="${produto._id || ''}">
            <i class="fas fa-shopping-cart me-2"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
    `;
}

