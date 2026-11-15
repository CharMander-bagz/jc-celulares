const pool = require('../config/database');

async function listarCompras() {
    const resultado = await pool.query(`
        SELECT
            c.id,
            c.data_compra,
            c.valor_total,
            c.observacao,
            f.id AS fornecedor_id,
            f.nome AS fornecedor,
            u.id AS usuario_id,
            u.nome AS usuario
        FROM compras c
        INNER JOIN fornecedores f
            ON f.id = c.fornecedor_id
        INNER JOIN usuarios u
            ON u.id = c.usuario_id
        ORDER BY c.data_compra DESC, c.id DESC;
    `);

    return resultado.rows;
}

async function buscarCompraPorId(id) {
    const compraResult = await pool.query(
        `
        SELECT
            c.id,
            c.data_compra,
            c.valor_total,
            c.observacao,
            f.id AS fornecedor_id,
            f.nome AS fornecedor,
            u.id AS usuario_id,
            u.nome AS usuario
        FROM compras c
        INNER JOIN fornecedores f
            ON f.id = c.fornecedor_id
        INNER JOIN usuarios u
            ON u.id = c.usuario_id
        WHERE c.id = $1;
        `,
        [id]
    );

    if (compraResult.rows.length === 0) {
        return null;
    }

    const itensResult = await pool.query(
        `
        SELECT
            ic.id,
            ic.produto_id,
            p.codigo,
            p.nome AS produto,
            p.categoria,
            ic.quantidade,
            ic.valor_unitario,
            ic.valor_total
        FROM itens_compra ic
        INNER JOIN produtos p
            ON p.id = ic.produto_id
        WHERE ic.compra_id = $1
        ORDER BY ic.id;
        `,
        [id]
    );

    return {
        ...compraResult.rows[0],
        itens: itensResult.rows
    };
}

async function criarCompra(dados) {
    const {
        fornecedor_id,
        usuario_id,
        data_compra,
        observacao,
        itens
    } = dados;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const compraResult = await client.query(
            `
            INSERT INTO compras (
                fornecedor_id,
                usuario_id,
                data_compra,
                observacao
            )
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4)
            RETURNING id, fornecedor_id, usuario_id, data_compra, valor_total, observacao;
            `,
            [
                fornecedor_id,
                usuario_id,
                data_compra || null,
                observacao || null
            ]
        );

        const compra = compraResult.rows[0];

        for (const item of itens) {
            await client.query(
                `
                INSERT INTO itens_compra (
                    compra_id,
                    produto_id,
                    quantidade,
                    valor_unitario
                )
                VALUES ($1, $2, $3, $4);
                `,
                [
                    compra.id,
                    item.produto_id,
                    item.quantidade,
                    item.valor_unitario
                ]
            );
        }

        await client.query('COMMIT');

        return await buscarCompraPorId(compra.id);

    } catch (erro) {
        await client.query('ROLLBACK');
        throw erro;
    } finally {
        client.release();
    }
}

module.exports = {
    listarCompras,
    buscarCompraPorId,
    criarCompra
};