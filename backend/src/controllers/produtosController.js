const produtosService = require('../services/produtosService');

async function listarProdutos(req, res) {
    try {
        const produtos = await produtosService.listarProdutos();

        res.status(200).json(produtos);
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar produtos.'
        });
    }
}

async function criarProduto(req, res) {
    try {
        const {
            codigo,
            nome,
            categoria,
            estoque_minimo
        } = req.body;

        if (!codigo || !nome || !categoria) {
            return res.status(400).json({
                erro: 'Código, nome e categoria são obrigatórios.'
            });
        }

        if (estoque_minimo !== undefined && estoque_minimo < 0) {
            return res.status(400).json({
                erro: 'O estoque mínimo não pode ser negativo.'
            });
        }

        const produto = await produtosService.criarProduto(req.body);

        res.status(201).json(produto);
    } catch (erro) {
        console.error('Erro ao criar produto:', erro);

        if (erro.code === '23505') {
            return res.status(409).json({
                erro: 'Já existe um produto com esse código.'
            });
        }

        res.status(500).json({
            erro: 'Erro ao cadastrar produto.'
        });
    }
}

async function buscarProdutoPorId(req, res) {
    try {
        const { id } = req.params;

        const produto = await produtosService.buscarProdutoPorId(id);

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        res.status(200).json(produto);
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar produto.'
        });
    }
}

module.exports = {
    listarProdutos,
    criarProduto,
    buscarProdutoPorId
};