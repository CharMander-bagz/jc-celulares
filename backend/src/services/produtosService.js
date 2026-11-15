const pool = require('../config/database');

async function listarProdutos() {
    const resultado = await pool.query(`
        SELECT
            id,
            codigo,
            nome,
            categoria,
            marca,
            modelo,
            preco_venda,
            preco_compra,
            estoque_atual,
            estoque_minimo,
            unidade,
            ativo
        FROM produtos
        WHERE ativo = TRUE
        ORDER BY nome;
    `);

    return resultado.rows;
}

async function criarProduto(dados) {
    const {
        codigo,
        nome,
        categoria,
        marca,
        modelo,
        preco_venda,
        preco_compra,
        estoque_minimo,
        unidade
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO produtos (
            codigo,
            nome,
            categoria,
            marca,
            modelo,
            preco_venda,
            preco_compra,
            estoque_atual,
            estoque_minimo,
            unidade
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9)
        RETURNING *;
        `,
        [
            codigo,
            nome,
            categoria,
            marca,
            modelo,
            preco_venda,
            preco_compra,
            estoque_minimo,
            unidade || 'unidade'
        ]
    );

    return resultado.rows[0];
}

async function buscarProdutoPorId(id) {
    const resultado = await pool.query(
        `
        SELECT
            id,
            codigo,
            nome,
            categoria,
            marca,
            modelo,
            preco_venda,
            preco_compra,
            estoque_atual,
            estoque_minimo,
            unidade,
            ativo
        FROM produtos
        WHERE id = $1
          AND ativo = TRUE;
        `,
        [id]
    );

    return resultado.rows[0];
}

module.exports = {
    listarProdutos,
    criarProduto,
    buscarProdutoPorId
};