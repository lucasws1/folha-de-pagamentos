const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/funcionariosController");

router.get("/", ctrl.listar); // GET /api/funcionarios
router.get("/:id", ctrl.buscarPorId); // GET /api/funcionarios/:id
router.post("/", ctrl.criar); // POST /api/funcionarios
router.put("/:id", ctrl.atualizar); // PUT /api/funcionarios/:id
router.delete("/:id", ctrl.remover); // DELETE /api/funcionarios/:id

module.exports = router;
