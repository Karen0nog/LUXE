const URL_API = "http://localhost:3000/api/produtos";

function criarCardProduto(produto) {
  return `
    <div class="col-6 col-md-4 col-lg-3 catalog-card" data-name="${produto.name}">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${produto.image}" class="card-img-top" alt="${produto.name}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${produto.name}</h5>
          <p class="text-muted small mb-2">${produto.category}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold fs-5">R$ ${produto.price.toFixed(2)}</span>
            <div class="text-warning">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
              <i class="far fa-star"></i>
            </div>
          </div>
        </div>
        <button class="btn btn-primary mt-3 w-100 rounded-pill" data-product-id="${produto._id}">
          <i class="fas fa-shopping-cart me-2"></i> Adicionar
        </button>
      </div>
    </div>
  `;
}

async function renderizarCatalogo() {
  const catalogoContainer = document.querySelector("#catalogProductsContainer");
  const loadingMessage = document.querySelector("#catalogoLoadingMessage");

  if (!catalogoContainer) {
    console.error("Elemento do catálogo não encontrado");
    return;
  }

  try {
    const resposta = await fetch(URL_API);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const produtos = await resposta.json();

    if (produtos.length === 0) {
      catalogoContainer.innerHTML =
        '<div class="col-12 text-center text-muted">Nenhum produto encontrado.</div>';
      return;
    }
    let html = "";
    produtos.forEach((produto) => {
      html += criarCardProduto(produto);
    });
    catalogoContainer.innerHTML = html;
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    catalogoContainer.innerHTML = `<div class="col-12 text-center text-danger">Erro ao carregar produtos: ${erro.message}</div>`;
  } finally {
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }
}

document.addEventListener('DOMContentLoaded', renderizarCatalogo);
