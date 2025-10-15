require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
// --- Conexão com o MongoDB Atlas ---
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("Erro: A variável de ambiente DB_URI não está definida.");
  process.exit(1);
}

// --- Middleware ---
app.use(cors());
app.use(express.json());

// ---- Configuração do Express ---
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

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

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/api/produtos", async (req, res) => {
  try {
    const produtos = await Produto.find().lean();
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos no DB:", error);
    res.status(500).json({
      mensagem: "Erro interno do servidor ao carregar o catálogo.",
      error: error.message,
    });
  }
});

async function startServer() {
  try {
    // Conecta ao MongoDB usando a variável de ambiente DB_URI
    await mongoose.connect(DB_URI);
    console.log("Conectado ao MongoDB.");

    // --- Inserir dados de exemplo se a coleção estiver vazia (apenas para desenvolvimento) ---
    // Só roda o seed quando não for ambiente de produção
    if (process.env.NODE_ENV !== 'production') {
      const count = await Produto.countDocuments();
      if (count === 0) {
        
        const exemplos = [
          {
            name: "Relógio Conceito A",
            price: 1299.00,
            image: "/assets/img/relogio(1).jpg",
            category: "Clássico",
            dialColor: "Preto",
            material: "Aço inox",
            description: "Relógio conceito A — exemplar de design minimalista.",
            specifications: [{ label: "Resistência", value: "5 ATM" }]
          },
          {
            name: "Relógio Conceito B",
            price: 1899.00,
            image: "/assets/img/relogio(2).jpg",
            category: "Esportivo",
            dialColor: "Azul",
            material: "Titânio",
            description: "Relógio conceito B — robusto e elegante.",
            specifications: [{ label: "Movimento", value: "Automático" }]
          }
        ];

        try {
          await Produto.insertMany(exemplos);
          
        } catch (seedErr) {
          // Logamos o erro do seed, mas não abortamos o servidor para facilitar desenvolvimento.
          console.error('Erro ao inserir dados de exemplo:', seedErr);
        }
      }
    }
    // -------------------------------------------------------------------------------

    // Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
}

startServer();