const db = require("../config/db");

// GET /api/cargos
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cargo");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/cargos/:id
exports.buscarPorId = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cargo WHERE id = ?", [
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
    const { titulo, salario_base } = req.body;

    const [result] = await db.query(
      "INSERT INTO cargo (titulo, salario_base) VALUES (?,?)",
      [titulo, salario_base],
    );

    res.status(201).json({
      id: result.insertId,
      titulo,
      salario_base,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PUT /api/cargos/:id
exports.atualizar = async (req, res) => {
  try {
    const { titulo, salario_base } = req.body;
    await db.query("UPDATE cargo SET titulo=?, salario_base=? WHERE id=?", [
      titulo,
      salario_base,
      req.params.id,
    ]);
    res.json({ mensagem: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// DELETE /api/cargos/:id
exports.remover = async (req, res) => {
  try {
    await db.query("DELETE FROM cargo WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
