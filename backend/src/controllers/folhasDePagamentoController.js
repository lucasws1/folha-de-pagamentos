const db = require("../config/db");

// GET /api/folhas
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM folha_de_pagamento");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/folhas/:id
exports.buscarPorId = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM folha_de_pagamento WHERE id = ?",
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ erro: "Não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// POST /api/folhas
exports.criar = async (req, res) => {
  try {
    const { mes, ano, status } = req.body;
    const [result] = await db.query(
      "INSERT INTO folha_de_pagamento (mes, ano, status) VALUES (?,?,?)",
      [mes, ano, status],
    );
    res.status(201).json({ id: result.insertId, mes, ano, status });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PUT /api/folhas/:id
exports.atualizar = async (req, res) => {
  try {
    const { mes, ano, status } = req.body;
    await db.query(
      "UPDATE folha_de_pagamento SET mes=?, ano=?, status=? WHERE id=?",
      [mes, ano, status, req.params.id],
    );
    res.json({ mensagem: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// DELETE /api/folhas/:id
exports.remover = async (req, res) => {
  try {
    await db.query("DELETE FROM folha_de_pagamento WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ mensagem: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
