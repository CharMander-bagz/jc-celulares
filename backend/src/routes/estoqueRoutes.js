const express = require('express');
const estoqueController = require('../controllers/estoqueController');

const router = express.Router();

router.get('/', estoqueController.listarEstoque);
router.get('/alertas', estoqueController.listarAlertasEstoque);
router.post('/saida', estoqueController.registrarSaida);

module.exports = router;