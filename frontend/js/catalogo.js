const URL_API = "/api/produtos";

function criarCardProduto(produto) {
  const imagem = produto.image || "./assets/img/relogio(1).jpg";
  const nome = produto.name || "Produto";
  const categoria = produto.category || "";
  const descricao = produto.description || "";
  const preco = formatarPreco(Number(produto.price || 0));
  const id = produto._id || "";

  return `
    <div class="col-6 col-md-4 col-lg-3 catalog-card" data-name="${nome}">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${imagem}" class="card-img-top" alt="${nome}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nome}</h5>
          <p class="text-muted small mb-2">${categoria}</p>
          <p class="card-text small mb-2">${descricao}</p> 
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="fw-bold fs-6">R$ ${preco}</span>
          </div>
        </div>
        <button class="btn btn-primary rounded-pill btn-sm mx-2 mb-2" style="width:90%;" data-product-id="${id}">
          <i class="fas fa-shopping-cart me-2"></i> Adicionar</button>
      </div>
    </div>
  `;
}

function formatarPreco(valor) {
  return valor
    .toFixed(2) 
    .replace(".", ",") 
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
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

//Produto indisponível
document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function(e) {
    if (e.target.matches('button[data-product-id]')) {
      if (e.target.classList.contains('btn-primary')) {
        e.target.classList.remove('btn-primary');
        e.target.classList.add('btn-danger');
        e.target.innerText = "Indisponível";
      } else {
        e.target.classList.remove('btn-danger');
        e.target.classList.add('btn-primary');
        e.target.innerHTML = '<i class="fas fa-shopping-cart me-2"></i> Adicionar';
      }
    }
  });});

document.addEventListener("DOMContentLoaded", function () {
  const switchInput = document.querySelector("#toggleDarkModeSwitch");
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document
      .querySelectorAll(".custom-navbar, .custom-footer, .card")
      .forEach((element) => {
        element.classList.add("dark-mode");
      });
    if (switchInput) switchInput.checked = true;
  }

  if (switchInput) {
    switchInput.addEventListener('change', function () {
      const isDark = switchInput.checked;
      document.body.classList.toggle('dark-mode', isDark);
      document.querySelectorAll('.custom-navbar, .custom-footer, .card').forEach(element => {
        element.classList.toggle('dark-mode', isDark);
      });
      localStorage.setItem('darkMode', isDark);
    });
  }
});
 