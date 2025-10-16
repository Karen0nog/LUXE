const URL_API = "http://localhost:3000/api/produtos";

function criarCardProduto(produto) {
  const imagem = produto.image || "./assets/img/relogio(1).jpg";
  const nome = produto.name || "Produto";
  const categoria = produto.category || "";
  const preco = Number(produto.price || 0).toFixed(2);
  const id = produto._id || "";

  return `
    <div class="col-6 col-md-4 col-lg-3 catalog-card" data-name="${nome}">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${imagem}" class="card-img-top" alt="${nome}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nome}</h5>
          <p class="text-muted small mb-2">${categoria}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold fs-5">R$ ${preco}</span>
            <div class="text-warning">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
              <i class="far fa-star"></i>
            </div>
          </div>
        </div>
        <button class="btn btn-primary mt-3 w-100 rounded-pill" data-product-id="${id}">
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
