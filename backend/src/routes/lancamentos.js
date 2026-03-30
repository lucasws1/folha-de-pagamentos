const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/lancamentosController");

router.get("/", ctrl.listar); // GET /api/lancamentos (aceita ?folha_id=1 para filtrar por folha)
router.get("/:id", ctrl.buscarPorId); // GET /api/lancamentos/:id
router.post("/", ctrl.criar); // POST /api/lancamentos
router.put("/:id", ctrl.atualizar); // PUT /api/lancamentos/:id
router.delete("/:id", ctrl.remover); // DELETE /api/lancamentos/:id

module.exports = router;
