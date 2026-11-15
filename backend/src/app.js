require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const produtosRoutes = require('./routes/produtosRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');
const fornecedoresRoutes = require('./routes/fornecedoresRoutes');
const comprasRoutes = require('./routes/comprasRoutes');
const reaproveitamentoRoutes = require('./routes/reaproveitamentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/estoque', estoqueRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/reaproveitamento', reaproveitamentoRoutes);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API da JC Celulares funcionando!'
    });
});

app.get('/teste-banco', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');

        res.json({
            mensagem: 'Conexão com PostgreSQL funcionando!',
            horario: resultado.rows[0].now
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Não foi possível conectar ao banco de dados.'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});