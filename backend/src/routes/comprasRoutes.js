const express = require('express');
const comprasController = require('../controllers/comprasController');

const router = express.Router();

router.get('/', comprasController.listarCompras);
router.get('/:id', comprasController.buscarCompraPorId);
router.post('/', comprasController.criarCompra);

module.exports = router;