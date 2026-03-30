require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Middlewares globais
app.use(cors());
app.use(express.json()); // lê json no body das requisições
app.use(express.urlencoded({ extended: true })); // lê form data

// Rotas
app.use("/api/funcionarios", require("./src/routes/funcionarios"));
app.use("/api/cargos", require("./src/routes/cargos"));
app.use("/api/departamentos", require("./src/routes/departamentos"));
app.use("/api/folhas", require("./src/routes/folhas"));
app.use("/api/lancamentos", require("./src/routes/lancamentos"));

// Iniciar servidor
app.get("/", (req, res) => {
  res.json({ mensagem: "hello, world" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
