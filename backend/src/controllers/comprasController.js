const comprasService = require('../services/comprasService');

async function listarCompras(req, res) {
    try {
        const compras = await comprasService.listarCompras();

        res.status(200).json(compras);
    } catch (erro) {
        console.error('Erro ao listar compras:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar compras.'
        });
    }
}

async function buscarCompraPorId(req, res) {
    try {
        const { id } = req.params;

        const compra = await comprasService.buscarCompraPorId(id);

        if (!compra) {
            return res.status(404).json({
                erro: 'Compra não encontrada.'
            });
        }

        res.status(200).json(compra);
    } catch (erro) {
        console.error('Erro ao buscar compra:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar compra.'
        });
    }
}

async function criarCompra(req, res) {
    try {
        const {
            fornecedor_id,
            usuario_id,
            itens
        } = req.body;

        if (!fornecedor_id || !usuario_id) {
            return res.status(400).json({
                erro: 'Fornecedor e usuário são obrigatórios.'
            });
        }

        if (!Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({
                erro: 'A compra precisa ter pelo menos um item.'
            });
        }

        for (const item of itens) {
            if (
                !item.produto_id ||
                !Number.isInteger(item.quantidade) ||
                item.quantidade <= 0 ||
                item.valor_unitario === undefined ||
                Number(item.valor_unitario) < 0
            ) {
                return res.status(400).json({
                    erro: 'Todos os itens devem possuir produto, quantidade válida e valor unitário válido.'
                });
            }
        }

        const compra = await comprasService.criarCompra(req.body);

        res.status(201).json(compra);

    } catch (erro) {
        console.error('Erro ao criar compra:', erro);

        if (erro.code === '23503') {
            return res.status(400).json({
                erro: 'Fornecedor, usuário ou produto informado não existe.'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar compra.'
        });
    }
}

module.exports = {
    listarCompras,
    buscarCompraPorId,
    criarCompra
};