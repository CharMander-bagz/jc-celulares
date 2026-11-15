const express = require('express');
const fornecedoresController = require('../controllers/fornecedoresController');

const router = express.Router();

router.get('/', fornecedoresController.listarFornecedores);
router.post('/', fornecedoresController.criarFornecedor);

module.exports = router;