const express = require('express');
const produtosController = require('../controllers/produtosController');

const router = express.Router();

router.get('/', produtosController.listarProdutos);
router.get('/:id', produtosController.buscarProdutoPorId);
router.post('/', produtosController.criarProduto);

module.exports = router;