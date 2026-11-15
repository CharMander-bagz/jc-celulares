const pool = require('../config/database');

async function listarEstoque() {
    const resultado = await pool.query(`
        SELECT
            id,
            codigo,
            nome,
            categoria,
            marca,
            modelo,
            estoque_atual,
            estoque_minimo,
            unidade,
            CASE
                WHEN estoque_atual = 0 THEN 'zerado'
                WHEN estoque_atual < estoque_minimo THEN 'baixo'
                ELSE 'normal'
            END AS status_estoque
        FROM produtos
        WHERE ativo = TRUE
        ORDER BY nome;
    `);

    return resultado.rows;
}

async function listarAlertasEstoque() {
    const resultado = await pool.query(`
        SELECT
            id,
            codigo,
            nome,
            categoria,
            marca,
            modelo,
            estoque_atual,
            estoque_minimo,
            (estoque_minimo - estoque_atual) AS quantidade_faltante,
            unidade
        FROM produtos
        WHERE ativo = TRUE
          AND estoque_atual < estoque_minimo
        ORDER BY estoque_atual ASC, nome ASC;
    `);

    return resultado.rows;
}

async function registrarSaida(produtoId, quantidade, motivo, usuarioId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const produtoResultado = await client.query(
      `SELECT id, nome, estoque_atual
       FROM produtos
       WHERE id = $1 AND ativo = TRUE
       FOR UPDATE`,
      [produtoId]
    );

    if (produtoResultado.rows.length === 0) {
      throw new Error('Produto não encontrado.');
    }

    const produto = produtoResultado.rows[0];

    if (Number(produto.estoque_atual) < quantidade) {
      throw new Error('Estoque insuficiente para esta saída.');
    }

    const estoqueResultado = await client.query(
      `UPDATE produtos
       SET estoque_atual = estoque_atual - $1
       WHERE id = $2
       RETURNING id, nome, estoque_atual`,
      [quantidade, produtoId]
    );

    await client.query(
      `INSERT INTO movimentacoes_estoque
         (produto_id, usuario_id, tipo, quantidade, motivo)
       VALUES ($1, $2, 'saida', $3, $4)`,
      [produtoId, usuarioId, quantidade, motivo]
    );

    await client.query('COMMIT');

    return estoqueResultado.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
    listarEstoque,
    listarAlertasEstoque,
    registrarSaida
};