require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// --- Conexão com o MongoDB Atlas ---
const DB_URI = process.env.DB_URI;
const API_URL = "http://localhost:3000/api/produtos"; 

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

app.get("/catalogo", (req, res) => {
  res.sendFile(path.join(frontendPath, "catalogo.html"));
});

app.get("/api/produtos", (req, res) => {
  res.json([
    {
      _id: "1",
      name: "Relógio Clássico",
      category: "Luxo",
      price: 1999.99,
      image: "./assets/img/relogio1.jpg",
    },
    {
      _id: "2",
      name: "Relógio Moderno",
      category: "Casual",
      price: 1299.99,
      image: "./assets/img/relogio2.jpg",
    },
  ]);
});

async function startServer() {
  try {
    // Conecta ao MongoDB usando a variável de ambiente DB_URI
    await mongoose.connect(DB_URI);
    console.log("Conectado ao MongoDB.");

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
