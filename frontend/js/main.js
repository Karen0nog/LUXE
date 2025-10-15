const URL_API = "http://localhost:3000/api/produtos";

function criarCardProduto(produto) {
  return `
    <div class="col-6 col-md-4 col-lg-3 catalog-card" data-name="${
      produto.name
    }">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${produto.image}" class="card-img-top" alt="${
    produto.name
  }" loading="lazy">
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
        <button class="btn btn-primary mt-3 w-100 rounded-pill" data-product-id="${
          produto._id
        }">
          <i class="fas fa-shopping-cart me-2"></i> Adicionar
        </button>
      </div>
    </div>
  `;
}

function renderFeaturedProducts(produtos) {
  const container = document.querySelector("#featuredProductsContainer");
  if (!container) {
    console.error("Elemento de produtos em destaque não encontrado.");
    return;
  }

  const featured = produtos.slice(0, 4);
  if (featured.length === 0) {
    container.innerHTML =
      '<div class="col-12 text-center text-muted">Nenhum produto em destaque.</div>';
    return;
  }
  // Gera o HTML dos produtos em destaque e insere no container
  let html = "";
  for (let i = 0; i < featured.length; i++) {
    html += criarCardProduto(featured[i]);
  }
  container.innerHTML = html;
}

async function fetchProducts() {
  try {
    const resposta = await fetch(URL_API);
    if (!resposta.ok) {
      throw new Error("Erro ao buscar produtos da API.");
    }
    const produtos = await resposta.json();
    renderFeaturedProducts(produtos);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error.message);
  }
}

// Aguarda o carregamento da página para iniciar
document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
});
