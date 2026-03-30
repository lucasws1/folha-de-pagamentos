const db = require("../config/db");

// GET /api/lancamentos
exports.listar = async (req, res) => {
  try {
    const { folha_id } = req.query;

    let sql = `SELECT l.*, f.nome AS funcionario_nome 
               FROM lancamento l 
               JOIN funcionario f ON l.funcionario_id = f.id`;
    const params = [];

    if (folha_id) {
      sql += " WHERE l.folha_id = ?";
      params.push(folha_id);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// GET /api/lancamentos/:id
exports.buscarPorId = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT l.*, f.nome AS funcionario_nome FROM lancamento l JOIN funcionario f ON l.funcionario_id = f.id WHERE l.id = ?",
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ erro: "Não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// POST /api/lancamentos
exports.criar = async (req, res) => {
  try {
    const {
      salario_bruto,
      funcionario_id,
      folha_id,
      horas_extras = 0,
      desconto = 0,
      beneficio = 0,
      tipo = "salario",
    } = req.body;

    const [result] = await db.query(
      "INSERT INTO lancamento (salario_bruto, horas_extras, desconto, beneficio, tipo, funcionario_id, folha_id) VALUES (?,?,?,?,?,?,?)",
      [
        salario_bruto,
        horas_extras,
        desconto,
        beneficio,
        tipo,
        funcionario_id,
        folha_id,
      ],
    );
    res.status(201).json({
      id: result.insertId,
      salario_bruto,
      horas_extras,
      desconto,
      beneficio,
      tipo,
      funcionario_id,
      folha_id,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// PUT /api/lancamentos/:id
exports.atualizar = async (req, res) => {
  try {
    const {
      salario_bruto,
      funcionario_id,
      folha_id,
      horas_extras = 0,
      desconto = 0,
      beneficio = 0,
      tipo = "salario",
    } = req.body;

    await db.query(
      "UPDATE lancamento SET salario_bruto=?, horas_extras=?, desconto=?, beneficio=?, tipo=?, funcionario_id=?, folha_id=? WHERE id=?",
      [
        salario_bruto,
        horas_extras,
        desconto,
        beneficio,
        tipo,
        funcionario_id,
        folha_id,
        req.params.id,
      ],
    );
    res.json({ mensagem: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// DELETE /api/lancamentos/:id
exports.remover = async (req, res) => {
  try {
    await db.query("DELETE FROM lancamento WHERE id = ?", [req.params.id]);
    res.json({ mensagem: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
