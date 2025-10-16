const URL_API = "/api/produtos";

function criarCardProduto(produto) {
  const imagem = produto.image || "./assets/img/relogio(1).jpg";
  const nome = produto.name || "Produto";
  const categoria = produto.category || "";
  const descricao = produto.description || "Sem descrição.";
  const preco = Number(produto.price || 0).toFixed(2);
  const id = produto._id || "";

  return `
    <div class="col-6 col-md-4 col-lg-3 catalog-card" data-name="${nome}">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${imagem}" class="card-img-top" alt="${nome}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nome}</h5>
          <p class="text-muted small mb-2">${categoria}</p>
          <p class="card-text">${descricao}</p>
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

async function renderizarCatalogo() {
  const catalogoContainer = document.querySelector("#catalogProductsContainer");
  const loadingMessage = document.querySelector("#catalogLoadingMessage");

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

document.addEventListener("DOMContentLoaded", renderizarCatalogo);
