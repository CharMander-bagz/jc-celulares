const estoqueService = require('../services/estoqueService');

async function listarEstoque(req, res) {
    try {
        const estoque = await estoqueService.listarEstoque();

        res.status(200).json(estoque);
    } catch (erro) {
        console.error('Erro ao listar estoque:', erro);

        res.status(500).json({
            erro: 'Erro ao consultar o estoque.'
        });
    }
}

async function listarAlertasEstoque(req, res) {
    try {
        const alertas = await estoqueService.listarAlertasEstoque();

        res.status(200).json(alertas);
    } catch (erro) {
        console.error('Erro ao listar alertas:', erro);

        res.status(500).json({
            erro: 'Erro ao consultar alertas de estoque.'
        });
    }
}

async function registrarSaida(req, res) {
  try {
    const { produto_id, quantidade, motivo, usuario_id } = req.body;

    const produtoId = Number(produto_id);
    const quantidadeNumero = Number(quantidade);
    const usuarioId = Number(usuario_id);

    if (
      !Number.isInteger(produtoId) ||
      produtoId <= 0 ||
      !Number.isInteger(quantidadeNumero) ||
      quantidadeNumero <= 0 ||
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0 ||
      typeof motivo !== 'string' ||
      !motivo.trim()
    ) {
      return res.status(400).json({
        erro: 'Informe produto, quantidade, usuário e motivo válidos.'
      });
    }

    const produto = await estoqueService.registrarSaida(
      produtoId,
      quantidadeNumero,
      motivo.trim(),
      usuarioId
    );

    return res.status(201).json({
      mensagem: 'Saída registrada com sucesso.',
      produto
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === 'Produto não encontrado.' ||
      error.message === 'Estoque insuficiente para esta saída.'
    ) {
      return res.status(400).json({ erro: error.message });
    }

    return res.status(500).json({
      erro: 'Não foi possível registrar a saída.'
    });
  }
}

module.exports = {
    listarEstoque,
    listarAlertasEstoque,
    registrarSaida
};