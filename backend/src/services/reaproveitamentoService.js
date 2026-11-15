const pool = require('../config/database');

async function listarCelularesDoadores() {
  const resultado = await pool.query(`
    SELECT
      id,
      modelo,
      defeito_informado,
      valor_pago,
      data_compra,
      status,
      observacao
    FROM celulares_doadores
    ORDER BY id DESC
  `);

  return resultado.rows;
}

async function cadastrarCelularDoador(dados) {
  const {
    modelo,
    imei,
    telefone_vendedor,
    defeito_informado,
    valor_pago,
    observacao
  } = dados;

  const resultado = await pool.query(
    `
    INSERT INTO celulares_doadores (
      modelo,
      imei,
      telefone_vendedor,
      defeito_informado,
      valor_pago,
      observacao
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      modelo,
      defeito_informado,
      valor_pago,
      data_compra,
      status,
      observacao
    `,
    [
      modelo.trim(),
      imei || null,
      telefone_vendedor || null,
      defeito_informado || null,
      valor_pago,
      observacao || null
    ]
  );

  return resultado.rows[0];
}

async function registrarPecaAproveitada(dados) {
  const {
    celular_doador_id,
    produto_id,
    quantidade,
    valor_unitario,
    observacao,
    usuario_id
  } = dados;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verificar se o celular doador existe
    const celular = await client.query(
      'SELECT id FROM celulares_doadores WHERE id = $1',
      [celular_doador_id]
    );

    if (celular.rows.length === 0) {
      throw new Error('Celular doador não encontrado.');
    }

    // Verificar se o produto existe e está ativo
    const produto = await client.query(
      'SELECT id FROM produtos WHERE id = $1 AND ativo = TRUE FOR UPDATE',
      [produto_id]
    );

    if (produto.rows.length === 0) {
      throw new Error('Produto não encontrado ou inativo.');
    }

    // Registrar a peça aproveitada
    const resultado = await client.query(
      `INSERT INTO pecas_aproveitadas
        (celular_doador_id, produto_id, quantidade, valor_unitario, observacao)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        celular_doador_id,
        produto_id,
        quantidade,
        valor_unitario,
        observacao || null
      ]
    );

    // Aumentar o estoque
    await client.query(
      `UPDATE produtos
       SET estoque_atual = estoque_atual + $1
       WHERE id = $2`,
      [quantidade, produto_id]
    );

    // Registrar a entrada no histórico
    await client.query(
      `INSERT INTO movimentacoes_estoque
        (produto_id, usuario_id, tipo, quantidade, motivo, observacao)
       VALUES ($1, $2, 'entrada', $3, $4, $5)`,
      [
        produto_id,
        usuario_id,
        quantidade,
        'Peça reaproveitada de celular doador',
        `Celular doador ID: ${celular_doador_id}`
      ]
    );

    await client.query('COMMIT');

    return resultado.rows[0];

  } catch (erro) {
    await client.query('ROLLBACK');
    throw erro;

  } finally {
    client.release();
  }
}

async function listarPecasAproveitadas() {
  const resultado = await pool.query(`
    SELECT
      pa.id,
      pa.celular_doador_id,
      cd.modelo AS celular_doador,
      pa.produto_id,
      p.nome AS produto,
      p.codigo AS codigo_produto,
      pa.quantidade,
      pa.valor_unitario,
      pa.observacao
    FROM pecas_aproveitadas pa
    INNER JOIN celulares_doadores cd
      ON cd.id = pa.celular_doador_id
    INNER JOIN produtos p
      ON p.id = pa.produto_id
    ORDER BY pa.id DESC
  `);

  return resultado.rows;
}

module.exports = {
  listarCelularesDoadores,
  cadastrarCelularDoador,
  registrarPecaAproveitada,
  listarPecasAproveitadas
};