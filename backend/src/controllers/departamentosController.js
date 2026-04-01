const db = require("../config/db");

// GET /api/departamentos
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM departamento");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/departamentos/:id
exports.buscarPorId = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM departamento WHERE id = ?", [
      req.params.id,
    ]);

    if (!rows.length) return res.status(404).json({ erro: "Não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// POST /api/departamentos
exports.criar = async (req, res) => {
  try {
    const { nome, centro_custo } = req.body;

    const [result] = await db.query(
      "INSERT INTO departamento (nome, centro_custo) VALUES (?,?)",
      [nome, centro_custo],
    );

    res.status(201).json({ id: result.insertId, nome, centro_custo });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PUT /api/departamentos
exports.atualizar = async (req, res) => {
  try {
    const { nome, centro_custo } = req.body;
    await db.query(
      "UPDATE departamento SET nome=?, centro_custo=? WHERE id=?",
      [nome, centro_custo, req.params.id],
    );
    res.json({ mensagem: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// DELETE /api/departamentos/:id
exports.remover = async (req, res) => {
  try {
    await db.query("DELETE FROM departamento WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
