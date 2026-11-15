const express = require('express');
const reaproveitamentoController = require('../controllers/reaproveitamentoController');

const router = express.Router();

router.get(
  '/celulares',
  reaproveitamentoController.listarCelularesDoadores
);

router.post(
  '/celulares',
  reaproveitamentoController.cadastrarCelularDoador
);

router.post(
  '/pecas',
  reaproveitamentoController.registrarPecaAproveitada
);

router.get(
  '/pecas',
  reaproveitamentoController.listarPecasAproveitadas
);

module.exports = router;