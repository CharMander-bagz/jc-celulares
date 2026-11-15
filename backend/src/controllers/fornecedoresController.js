const fornecedoresService = require('../services/fornecedoresService');

async function listarFornecedores(req, res) {
    try {
        const fornecedores = await fornecedoresService.listarFornecedores();

        res.status(200).json(fornecedores);
    } catch (erro) {
        console.error('Erro ao listar fornecedores:', erro);

        res.status(500).json({
            erro: 'Erro ao buscar fornecedores.'
        });
    }
}

async function criarFornecedor(req, res) {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({
                erro: 'O nome do fornecedor é obrigatório.'
            });
        }

        const fornecedor =
            await fornecedoresService.criarFornecedor(req.body);

        res.status(201).json(fornecedor);
    } catch (erro) {
        console.error('Erro ao criar fornecedor:', erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar fornecedor.'
        });
    }
}

module.exports = {
    listarFornecedores,
    criarFornecedor
};