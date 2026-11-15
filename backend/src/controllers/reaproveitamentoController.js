const reaproveitamentoService = require('../services/reaproveitamentoService');

async function listarCelularesDoadores(req, res) {
  try {
    const celulares =
      await reaproveitamentoService.listarCelularesDoadores();

    return res.status(200).json(celulares);

  } catch (erro) {
    console.error('Erro ao listar celulares doadores:', erro);

    return res.status(500).json({
      erro: 'Não foi possível consultar os celulares doadores.'
    });
  }
}

async function cadastrarCelularDoador(req, res) {
  try {
    const {
      modelo,
      imei,
      telefone_vendedor,
      defeito_informado,
      valor_pago,
      observacao
    } = req.body;

    const valorPago = Number(valor_pago);

    if (
      typeof modelo !== 'string' ||
      !modelo.trim() ||
      valor_pago === undefined ||
      valor_pago === null ||
      valor_pago === '' ||
      !Number.isFinite(valorPago) ||
      valorPago < 0
    ) {
      return res.status(400).json({
        erro: 'Informe um modelo e um valor pago válido.'
      });
    }

    const celular = await reaproveitamentoService.cadastrarCelularDoador({
      modelo: modelo.trim(),
      imei: typeof imei === 'string' ? imei.trim() : null,
      telefone_vendedor:
        typeof telefone_vendedor === 'string'
          ? telefone_vendedor.trim()
          : null,
      defeito_informado:
        typeof defeito_informado === 'string'
          ? defeito_informado.trim()
          : null,
      valor_pago: valorPago,
      observacao:
        typeof observacao === 'string'
          ? observacao.trim()
          : null
    });

    return res.status(201).json({
      mensagem: 'Celular doador cadastrado com sucesso!',
      celular
    });

  } catch (erro) {
    console.error('Erro ao cadastrar celular doador:', erro);

    return res.status(500).json({
      erro: 'Não foi possível cadastrar o celular doador.'
    });
  }
}

async function registrarPecaAproveitada(req, res) {
  try {
    const {
      celular_doador_id,
      produto_id,
      quantidade,
      valor_unitario,
      observacao,
      usuario_id
    } = req.body;

    const celularId = Number(celular_doador_id);
    const produtoId = Number(produto_id);
    const quantidadeNumero = Number(quantidade);
    const usuarioId = Number(usuario_id);

    const valorUnitario =
      valor_unitario === undefined ||
      valor_unitario === null ||
      valor_unitario === ''
        ? null
        : Number(valor_unitario);

    if (
      !Number.isInteger(celularId) ||
      celularId <= 0 ||
      !Number.isInteger(produtoId) ||
      produtoId <= 0 ||
      !Number.isInteger(quantidadeNumero) ||
      quantidadeNumero <= 0 ||
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0 ||
      (valorUnitario !== null &&
        (!Number.isFinite(valorUnitario) || valorUnitario < 0))
    ) {
      return res.status(400).json({
        erro: 'Confira os dados da peça aproveitada.'
      });
    }

    const peca = await reaproveitamentoService.registrarPecaAproveitada({
      celular_doador_id: celularId,
      produto_id: produtoId,
      quantidade: quantidadeNumero,
      valor_unitario: valorUnitario,
      observacao:
        typeof observacao === 'string'
          ? observacao.trim()
          : null,
      usuario_id: usuarioId
    });

    return res.status(201).json({
      mensagem: 'Peça aproveitada registrada com sucesso!',
      peca
    });

  } catch (erro) {
    console.error('Erro ao registrar peça aproveitada:', erro);

    if (
      erro.message === 'Celular doador não encontrado.' ||
      erro.message === 'Produto não encontrado ou inativo.'
    ) {
      return res.status(400).json({
        erro: erro.message
      });
    }

    return res.status(500).json({
      erro: 'Não foi possível registrar a peça aproveitada.'
    });
  }
}

async function listarPecasAproveitadas(req, res) {
  try {
    const pecas =
      await reaproveitamentoService.listarPecasAproveitadas();

    return res.status(200).json(pecas);

  } catch (erro) {
    console.error(
      'Erro ao listar peças reaproveitadas:',
      erro
    );

    return res.status(500).json({
      erro: 'Não foi possível consultar as peças reaproveitadas.'
    });
  }
}

module.exports = {
  listarCelularesDoadores,
  cadastrarCelularDoador,
  registrarPecaAproveitada,
  listarPecasAproveitadas
};