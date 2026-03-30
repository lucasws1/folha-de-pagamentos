const db = require("../config/db");

// GET /api/funcionarios
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM funcionario");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/funcionarios/:id
exports.buscarPorId = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM funcionario WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ erro: "Não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// POST /api/funcionarios
exports.criar = async (req, res) => {
  try {
    const { nome, cpf, data_admissao, cargo_id, departamento_id } = req.body;
    const [result] = await db.query(
      "INSERT INTO funcionario (nome, cpf, data_admissao, cargo_id, departamento_id) VALUES (?,?,?,?,?)",
      [nome, cpf, data_admissao, cargo_id, departamento_id],
    );
    res.status(201).json({
      id: result.insertId,
      nome,
      cpf,
      data_admissao,
      cargo_id,
      departamento_id,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PUT /api/funcionarios/:id
exports.atualizar = async (req, res) => {
  try {
    const { nome, cpf, data_admissao, cargo_id, departamento_id } = req.body;
    await db.query(
      "UPDATE funcionario SET nome=?, cpf=?, data_admissao=?, cargo_id=?, departamento_id=? WHERE id=?",
      [nome, cpf, data_admissao, cargo_id, departamento_id, req.params.id],
    );
    res.json({ mensagem: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// DELETE /api/funcionarios/:id
exports.remover = async (req, res) => {
  try {
    await db.query("DELETE FROM funcionario WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
