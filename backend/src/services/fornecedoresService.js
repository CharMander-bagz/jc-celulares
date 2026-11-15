const pool = require('../config/database');

async function listarFornecedores() {
    const resultado = await pool.query(`
        SELECT
            id,
            nome,
            contato,
            telefone,
            email,
            endereco,
            observacao
        FROM fornecedores
        ORDER BY nome;
    `);

    return resultado.rows;
}

async function criarFornecedor(dados) {
    const {
        nome,
        contato,
        telefone,
        email,
        endereco,
        observacao
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO fornecedores (
            nome,
            contato,
            telefone,
            email,
            endereco,
            observacao
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,
        [
            nome,
            contato || null,
            telefone || null,
            email || null,
            endereco || null,
            observacao || null
        ]
    );

    return resultado.rows[0];
}

module.exports = {
    listarFornecedores,
    criarFornecedor
};