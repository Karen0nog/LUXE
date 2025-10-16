const URL_API = "http://localhost:3000/api/produtos";

function criarCardProduto(produto) {
  const imagem = produto.image || "./assets/img/relogio(1).jpg";
  const nome = produto.name || "Produto";
  const categoria = produto.category || "";
  const preco = formatarPreco(Number(produto.price || 0));
  const id = produto._id || "";

  return `
    <div class="col-6 col-md-4 col-lg-3 catalog-card" data-name="${nome}">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${imagem}" class="card-img-top" alt="${nome}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${nome}</h5>
          <p class="text-muted small mb-2">${categoria}</p>
        </div>
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

document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
});

// Alterar para modo escuro

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
 