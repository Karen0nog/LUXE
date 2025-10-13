require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

// --- Conexão com o MongoDB Atlas ---
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("Erro: A variável de ambiente DB_URI não está definida.");
  process.exit(1);
}

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Conectado com sucesso ao MongoDB");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB", error.message);
  });

  mongoose.connection.on("connected", () => {
  console.log("Mongoose: conexão estabelecida.");
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose: erro de conexão:", err);
});
mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose: desconectado.");
});

// Schema para especificações
const SpecificationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

// Schema Principal do Produto
const ProdutoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    dialColor: { type: String },
    material: { type: String },
    description: { type: String, default: "Sem descrição." },
    specifications: [SpecificationSchema],
  },
  { timestamps: true }
);

const Produto = mongoose.model("Produto", ProdutoSchema);

// ---- Configuração do Express ---
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// Rota Raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/api/produtos", async (req, res) => {
  console.log("Requisição recebida para /api/produtos");
  try {
    const produtos = await Produto.find();
    if (produtos.length === 0) {
      console.warn("Nenhum produto encontrado no banco de dados.");
    }
    console.log("Produtos encontrados:", produtos);
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos no DB:", error);
    res.status(500).json({
      mensagem: "Erro interno do servidor ao carregar o catálogo.",
      error: error.message,
    });
  }

});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
