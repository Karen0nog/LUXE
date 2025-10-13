require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// --- Conexão com o MongoDB Atlas ---
const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Conectado com sucesso ao MongoDB");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB", error.message);
  });

// ---- Configuração do Express ---
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));
app.use(express.json());

// Rota Raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/api/produtos", async (req, res) => {
  console.log("Requisição recebida para /api/produtos");
  try {
    const produtos = await produtos.find();
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos no DB:", error);
    res.status(500).json({
      mensagem: "Erro interno do servidor ao carregar o catálogo.",
      error: error.message,
    });
  }

  const products = [
    {
      id: 1,
      name: "Chronograph Sapphire",
      price: 45000,
      // Usaremos 'image' para a lista de produtos.
      image:
        "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjAwOTUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjAwOTUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1729751150730-56897fcc4411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNofGVufDF8fHx8MTc2MDE2NjQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1580837428500-74aa7eefc672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2F0Y2h8ZW58MXx8fHwxNzYwMTQ2NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      category: "Pilotagem",
      dialColor: "Azul",
      material: "Aço Inoxidável",
      description:
        "O Chronograph Sapphire combina funcionalidade excepcional com design sofisticado...",
      specifications: [
        { label: "Movimento", value: "Automático Cronógrafo" },
        { label: "Caixa", value: "Aço Inoxidável 316L - 42mm" },
        { label: "Vidro", value: "Safira Anti-reflexo" },
        { label: "Pulseira", value: "Aço Inoxidável com Fecho Dobrável" },
        { label: "Resistência à Água", value: "100m (10 ATM)" },
        { label: "Reserva de Marcha", value: "48 horas" },
        { label: "Funções", value: "Horas, Minutos, Segundos, Cronógrafo" },
        { label: "Garantia", value: "2 anos internacional" },
      ],
      // NOVO: Adicione 'isFeatured' para a Home Page
      isFeatured: true,
      rating: 4.8, // Novo: Adicione um rating para simular
    },
    {
      id: 2,
      name: "Diver Professional",
      price: 38000,
      image:
        "https://images.unsplash.com/photo-1553926835-e75b15338ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxkaXZpbmclMjB3YXRjaHxlbnwxfHx8fDE3NjAxNjY2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1553926835-e75b15338ffb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxkaXZpbmclMjB3YXRjaHxlbnwxfHx8fDE3NjAxNjY2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        "https://images.unsplash.com/photo-1670177257750-9b47927f68eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsdXh1cnklMjB3YXRjaHxlbnwxfHx8fDE3NjAwOTUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      category: "Mergulho",
      dialColor: "Preto",
      material: "Titânio",
      description:
        "Desenvolvido para profissionais do mergulho, o Diver Professional oferece resistência até 300m de profundidade...",
      specifications: [
        { label: "Movimento", value: "Automático com Data" },
        { label: "Caixa", value: "Titânio Grau 5 - 44mm" },
        { label: "Vidro", value: "Safira com Tratamento AR" },
        { label: "Pulseira", value: "Borracha Natural com Fecho de Extensão" },
        { label: "Resistência à Água", value: "300m (30 ATM)" },
        { label: "Reserva de Marcha", value: "60 horas" },
        { label: "Funções", value: "Horas, Minutos, Segundos, Data, Luneta" },
        { label: "Garantia", value: "3 anos internacional" },
      ],
      isFeatured: true,
      rating: 5.0,
    },
    {
      id: 3,
      name: "Heritage Classic",
      price: 52000,
      image:
        "https://images.unsplash.com/photo-1580837428500-74aa7eefc672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2F0Y2h8ZW58MXx8fHwxNzYwMTQ2NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1580837428500-74aa7eefc672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd2F0Y2h8ZW58MXx8fHwxNzYwMTQ2NzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      category: "Clássico",
      dialColor: "Branco",
      material: "Ouro Rosa 18k",
      description:
        "Um tributo à tradição relojoeira, o Heritage Classic apresenta design minimalista...",
      specifications: [
        { label: "Movimento", value: "Manual de Manufatura" },
        { label: "Caixa", value: "Ouro Rosa 18k - 40mm" },
        { label: "Vidro", value: "Safira Dupla Face" },
        { label: "Pulseira", value: "Couro Italiano com Fecho em Ouro" },
        { label: "Resistência à Água", value: "30m (3 ATM)" },
        { label: "Reserva de Marcha", value: "72 horas" },
        { label: "Funções", value: "Horas, Minutos, Pequenos Segundos" },
        { label: "Garantia", value: "5 anos internacional" },
      ],
      isFeatured: true,
      rating: 4.5,
    },
    {
      id: 4,
      name: "Royal Gold Edition",
      price: 68000,
      image:
        "https://images.unsplash.com/photo-1613704193420-a53cab02d194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwd2F0Y2h8ZW58MXx8fHwxNzYwMjAxMjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1613704193420-a53cab02d194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxnb2xkJTIwd2F0Y2h8ZW58MXx8fHwxNzYwMjAxMjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      category: "Luxo",
      dialColor: "Dourado",
      material: "Ouro Amarelo 18k",
      description:
        "A definição de exclusividade. O Royal Gold Edition é produzido em série limitada...",
      specifications: [
        { label: "Movimento", value: "Tourbillon Automático" },
        { label: "Caixa", value: "Ouro Amarelo 18k - 43mm" },
        { label: "Vidro", value: "Safira com Fundo Transparente" },
        { label: "Pulseira", value: "Ouro Amarelo 18k Maciço" },
        { label: "Resistência à Água", value: "50m (5 ATM)" },
        { label: "Reserva de Marcha", value: "80 horas" },
        { label: "Funções", value: "Horas, Minutos, Tourbillon Visível" },
        { label: "Garantia", value: "5 anos internacional" },
      ],
      isFeatured: true, // Vamos destacar 4 na Home
      rating: 5.0,
    },
    {
      id: 5,
      name: "Aviator Precision",
      price: 42000,
      image:
        "https://images.unsplash.com/photo-1587914839172-657ff0b85b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwaWxvdCUyMHdhdGNofGVufDF8fHx8MTc2MDIwMTI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1587914839172-657ff0b85b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwaWxvdCUyMHdhdGNofGVufDF8fHx8MTc2MDIwMTI4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      category: "Pilotagem",
      dialColor: "Preto",
      material: "Aço Inoxidável",
      description:
        "Inspirado nos relógios de cabine, o Aviator Precision traz design robusto...",
      specifications: [
        { label: "Movimento", value: "Automático GMT" },
        { label: "Caixa", value: "Aço Inoxidável 316L - 45mm" },
        { label: "Vidro", value: "Safira Abaulada" },
        { label: "Pulseira", value: "Couro Aviador com Rebites" },
        { label: "Resistência à Água", value: "100m (10 ATM)" },
        { label: "Reserva de Marcha", value: "55 horas" },
        { label: "Funções", value: "Horas, Minutos, Segundos, GMT, Data" },
        { label: "Garantia", value: "2 anos internacional" },
      ],
      isFeatured: false,
      rating: 4.0,
    },
    {
      id: 6,
      name: "Sport Chronograph",
      price: 35000,
      image:
        "https://images.unsplash.com/photo-1729751150730-56897fcc4411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNofGVufDF8fHx8MTc2MDE2NjQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      images: [
        "https://images.unsplash.com/photo-1729751150730-56897fcc4411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjaHJvbm9ncmFwaCUyMHdhdGNofGVufDF8fHx8MTc2MDE2NjQwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      category: "Esportivo",
      dialColor: "Azul",
      material: "Cerâmica",
      description:
        "Design esportivo e moderno, o Sport Chronograph apresenta caixa em cerâmica...",
      specifications: [
        { label: "Movimento", value: "Automático Cronógrafo" },
        { label: "Caixa", value: "Cerâmica High-Tech - 42mm" },
        { label: "Vidro", value: "Safira Anti-reflexo" },
        {
          label: "Pulseira",
          value: "Borracha Premium com Detalhes em Cerâmica",
        },
        { label: "Resistência à Água", value: "200m (20 ATM)" },
        { label: "Reserva de Marcha", value: "50 horas" },
        {
          label: "Funções",
          value: "Horas, Minutos, Segundos, Cronógrafo, Data",
        },
        { label: "Garantia", value: "3 anos internacional" },
      ],
      isFeatured: false,
      rating: 4.7,
    },
  ];
  res.status(500).json({
    mensagem: "Erro ao carregar produtos do banco de dados.",
    produtos: products,
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
