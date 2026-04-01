const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/folhasDePagamentoController");

router.get("/", ctrl.listar); // GET /api/folhas
router.get("/:id", ctrl.buscarPorId); // GET /api/folhas/:id
router.post("/", ctrl.criar); // POST /api/folhas
router.put("/:id", ctrl.atualizar); // PUT /api/folhas/:id
router.delete("/:id", ctrl.remover); // DELETE /api/folhas/:id

module.exports = router;
