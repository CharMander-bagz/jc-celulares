import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [pagina, setPagina] = useState('dashboard');
  const [produtos, setProdutos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [erro, setErro] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
  codigo: '',
  nome: '',
  categoria: '',
  marca: '',
  modelo: '',
  preco_compra: '',
  preco_venda: '',
  estoque_minimo: '5'
});

  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);
  const [fornecedores, setFornecedores] = useState([]);
  const [compras, setCompras] = useState([]);
  const [mostrarCompra, setMostrarCompra] = useState(false);
  const [salvandoCompra, setSalvandoCompra] = useState(false);
  const [mensagemCompra, setMensagemCompra] = useState('');

  const [novaCompra, setNovaCompra] = useState({
  fornecedor_id: '',
  produto_id: '',
  quantidade: '',
  valor_unitario: ''
  });

 async function carregarDados() {
  try {
    const [produtosResponse, alertasResponse] = await Promise.all([
      axios.get(`${API_URL}/api/produtos`),
      axios.get(`${API_URL}/api/estoque/alertas`)
    ]);

    setProdutos(produtosResponse.data);
    setAlertas(alertasResponse.data);

    const [fornecedoresResponse, comprasResponse] = await Promise.all([
      axios.get(`${API_URL}/api/fornecedores`),
      axios.get(`${API_URL}/api/compras`)
    ]);

    setFornecedores(fornecedoresResponse.data);
    setCompras(comprasResponse.data);

    // NOVO: carregar os dados do estoque
    const estoqueResponse = await axios.get(
      `${API_URL}/api/estoque`
    );

    setEstoque(estoqueResponse.data);

    // Carregar os celulares doadores
    const celularesResponse = await axios.get(
      `${API_URL}/api/reaproveitamento/celulares`
    );
    
    // Carregar o histórico de peças reaproveitadas
    const respostaPecas = await axios.get(
      `${API_URL}/api/reaproveitamento/pecas`
    );

setPecasAproveitadas(respostaPecas.data);


setCelularesDoadores(celularesResponse.data);

  } catch (error) {
    console.error(error);
    setErro('Não foi possível carregar os dados.');
  }
}
  const totalEstoque = produtos.reduce(
    (total, produto) => total + Number(produto.estoque_atual),
    0
  );
  async function cadastrarProduto(evento) {
  evento.preventDefault();
  setMensagem('');

  try {
    await axios.post(`${API_URL}/api/produtos`, {
      ...novoProduto,
      preco_compra: Number(novoProduto.preco_compra),
      preco_venda: Number(novoProduto.preco_venda),
      estoque_minimo: Number(novoProduto.estoque_minimo)
    });

    await carregarDados();

    setMensagem('Produto cadastrado com sucesso!');
    setMostrarFormulario(false);

    setNovoProduto({
      codigo: '',
      nome: '',
      categoria: '',
      marca: '',
      modelo: '',
      preco_compra: '',
      preco_venda: '',
      estoque_minimo: '5'
    });
  } catch (error) {
    console.error(error);
    setMensagem(
      error.response?.data?.erro ||
      'Não foi possível cadastrar o produto.'
    );
  }
}

  async function registrarCompra(evento) {
  evento.preventDefault();
  setMensagemCompra('');

  const quantidade = Number(novaCompra.quantidade);
  const valorUnitario = Number(novaCompra.valor_unitario);

  if (
    !novaCompra.fornecedor_id ||
    !novaCompra.produto_id ||
    !Number.isInteger(quantidade) ||
    quantidade <= 0 ||
    !novaCompra.valor_unitario.trim() ||
    !Number.isFinite(valorUnitario) ||
    valorUnitario < 0
  ) {
    setMensagemCompra('Confira os dados da compra.');
    return;
  }

  setSalvandoCompra(true);

  try {
    await axios.post(`${API_URL}/api/compras`, {
      fornecedor_id: Number(novaCompra.fornecedor_id),
      usuario_id: 1,
      observacao: 'Compra cadastrada pelo sistema',
      itens: [
        {
          produto_id: Number(novaCompra.produto_id),
          quantidade,
          valor_unitario: valorUnitario
        }
      ]
    });

    await carregarDados();

    setNovaCompra({
      fornecedor_id: '',
      produto_id: '',
      quantidade: '',
      valor_unitario: ''
    });

    setMostrarCompra(false);
    setMensagemCompra('Compra registrada com sucesso!');
  } catch (error) {
    console.error(error);
    setMensagemCompra(
      error.response?.data?.erro ||
      'Não foi possível registrar a compra.'
    );
  } finally {
    setSalvandoCompra(false);
  }
}
  const [mostrarFornecedor, setMostrarFornecedor] = useState(false);
  const [mensagemFornecedor, setMensagemFornecedor] = useState('');
  const [salvandoFornecedor, setSalvandoFornecedor] = useState(false);

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: '',
    contato: '',
    telefone: '',
    email: '',
    endereco: '',
    observacao: ''
});

const [estoque, setEstoque] = useState([]);
const [mostrarSaida, setMostrarSaida] = useState(false);
const [salvandoSaida, setSalvandoSaida] = useState(false);
const [mensagemSaida, setMensagemSaida] = useState('');

const [novaSaida, setNovaSaida] = useState({
  produto_id: '',
  quantidade: '',
  motivo: ''
});

const [celularesDoadores, setCelularesDoadores] = useState([]);

const [pecasAproveitadas, setPecasAproveitadas] = useState([]);

const [mostrarCelularDoador, setMostrarCelularDoador] = useState(false);
const [salvandoCelularDoador, setSalvandoCelularDoador] = useState(false);
const [mensagemCelularDoador, setMensagemCelularDoador] = useState('');

const [mostrarPeca, setMostrarPeca] = useState(false);
const [salvandoPeca, setSalvandoPeca] = useState(false);
const [mensagemPeca, setMensagemPeca] = useState('');

const [novaPeca, setNovaPeca] = useState({
  celular_doador_id: '',
  produto_id: '',
  quantidade: '',
  valor_unitario: '',
  observacao: ''
});

const [novoCelularDoador, setNovoCelularDoador] = useState({
  modelo: '',
  imei: '',
  telefone_vendedor: '',
  defeito_informado: '',
  valor_pago: '',
  observacao: ''
});

  function Dashboard() {
    return (
      <>
        <div className="titulo-pagina">
          <h1>Dashboard</h1>
          <p>Visão geral do estoque da JC Celulares</p>
        </div>

        <section className="cards">
          <div className="card">
            <span>Produtos cadastrados</span>
            <strong>{produtos.length}</strong>
          </div>

          <div className="card">
            <span>Itens em estoque</span>
            <strong>{totalEstoque}</strong>
          </div>

          <div className="card">
            <span>Alertas de estoque</span>
            <strong>{alertas.length}</strong>
          </div>
        </section>

        <section className="painel">
          <h2>Alertas de estoque</h2>
          <p className="subtitulo">
            Produtos que precisam de atenção
          </p>

          {alertas.length === 0 ? (
            <div className="sem-alertas">
              Nenhum produto precisa de reposição.
            </div>
          ) : (
            <div className="alertas">
              {alertas.map((produto) => (
                <div
                     className={`alerta ${
                       Number(produto.estoque_atual) === 0 ? 'estoque-zerado' : ''    }`}
                       key={produto.id}>
                  <div>
                    <strong>{produto.nome}</strong>
                    <p>
                      {produto.marca} • {produto.modelo}
                    </p>
                  </div>

                  <div className="quantidades">
                    <span>Estoque: {produto.estoque_atual}</span>
                    <span>Mínimo: {produto.estoque_minimo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

function renderizarProdutos() {
  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setNovoProduto((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  return (
    <>
      <div className="titulo-pagina">
        <div>
          <h1>Produtos</h1>
          <p>Produtos cadastrados no sistema</p>
        </div>

        <button
          className="botao-principal"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? 'Cancelar' : '+ Novo produto'}
        </button>
      </div>

      {mensagem && <p>{mensagem}</p>}

      {mostrarFormulario && (
        <section className="painel">
          <h2>Cadastrar produto</h2>

          <form className="formulario" onSubmit={cadastrarProduto}>
            <label>
              Código *
              <input
                name="codigo"
                value={novoProduto.codigo}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Nome *
              <input
                name="nome"
                value={novoProduto.nome}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Categoria *
              <input
                name="categoria"
                value={novoProduto.categoria}
                onChange={atualizarCampo}
                required
              />
            </label>

            <label>
              Marca
              <input
                name="marca"
                value={novoProduto.marca}
                onChange={atualizarCampo}
              />
            </label>

            <label>
              Modelo
              <input
                name="modelo"
                value={novoProduto.modelo}
                onChange={atualizarCampo}
              />
            </label>

            <label>
              Preço de compra
              <input
                type="number"
                min="0"
                step="0.01"
                name="preco_compra"
                value={novoProduto.preco_compra}
                onChange={atualizarCampo}
              />
            </label>

            <label>
              Preço de venda
              <input
                type="number"
                min="0"
                step="0.01"
                name="preco_venda"
                value={novoProduto.preco_venda}
                onChange={atualizarCampo}
              />
            </label>

            <label>
              Estoque mínimo
              <input
                type="number"
                min="0"
                step="1"
                name="estoque_minimo"
                value={novoProduto.estoque_minimo}
                onChange={atualizarCampo}
              />
            </label>

            <button className="botao-principal" type="submit">
              Salvar produto
            </button>
          </form>
        </section>
      )}

      <section className="painel">
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Modelo</th>
                <th>Estoque</th>
                <th>Mínimo</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.codigo}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.modelo || '-'}</td>
                  <td>{produto.estoque_atual}</td>
                  <td>{produto.estoque_minimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

  function PaginaEmConstrucao({ titulo }) {
    return (
      <>
        <div className="titulo-pagina">
          <h1>{titulo}</h1>
        </div>

        <section className="painel construcao">
          <h2>{titulo}</h2>
          <p>Esta funcionalidade será adicionada na próxima etapa.</p>
        </section>
      </>
    );
  }

  function renderizarCompras() {
  function atualizarCompra(evento) {
    const { name, value } = evento.target;

    setNovaCompra((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  const total =
    Number(novaCompra.quantidade) *
    Number(novaCompra.valor_unitario);

  return (
    <>
      <div className="titulo-pagina">
        <div>
          <h1>Compras</h1>
          <p>Registro de mercadorias e entrada no estoque</p>
        </div>

        <button
          className="botao-principal"
          onClick={() => {
  setMostrarCompra((anterior) => !anterior);
  setMensagemCompra('');
}}
        >
          {mostrarCompra ? 'Cancelar' : '+ Nova compra'}
        </button>
      </div>

      {mensagemCompra && (
        <div className="painel">{mensagemCompra}</div>
      )}

      {mostrarCompra && (
        <section className="painel">
          <h2>Registrar compra</h2>

          <form
            className="formulario"
            onSubmit={registrarCompra}
          >
            <label>
              Fornecedor *
              <select
                name="fornecedor_id"
                value={novaCompra.fornecedor_id}
                onChange={atualizarCompra}
                required
              >
                <option value="">Selecione um fornecedor</option>

                {fornecedores.map((fornecedor) => (
                  <option
                    key={fornecedor.id}
                    value={fornecedor.id}
                  >
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Produto *
              <select
                name="produto_id"
                value={novaCompra.produto_id}
                onChange={atualizarCompra}
                required
              >
                <option value="">Selecione um produto</option>

                {produtos.map((produto) => (
                  <option
                    key={produto.id}
                    value={produto.id}
                  >
                    {produto.nome} — {produto.modelo}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade *
              <input
                type="number"
                min="1"
                step="1"
                name="quantidade"
                value={novaCompra.quantidade}
                onChange={atualizarCompra}
                required
              />
            </label>

            <label>
              Valor unitário (R$) *
              <input
                type="number"
                min="0"
                step="0.01"
                name="valor_unitario"
                value={novaCompra.valor_unitario}
                onChange={atualizarCompra}
                required
              />
            </label>

            <div className="total-compra">
              <span>Valor total</span>
              <strong>
                {total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </strong>
            </div>

            <button
              className="botao-principal"
              type="submit"
              disabled={salvandoCompra}
            >
              {salvandoCompra
                ? 'Salvando...'
                : 'Registrar compra'}
            </button>
          </form>
        </section>
      )}

      <section className="painel">
        <h2>Histórico de compras</h2>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Fornecedor</th>
                <th>Valor total</th>
              </tr>
            </thead>

            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>#{compra.id}</td>
                  <td>
                    {compra.fornecedor ||
                      fornecedores.find(
                        (f) => f.id === compra.fornecedor_id
                      )?.nome ||
                      'Fornecedor não identificado'}
                  </td>
                  <td>
                    {Number(compra.valor_total).toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL'
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {compras.length === 0 && (
          <p>Nenhuma compra cadastrada.</p>
        )}
      </section>
    </>
  );
}

async function cadastrarFornecedor(evento) {
  evento.preventDefault();

  if (!novoFornecedor.nome.trim()) {
    setMensagemFornecedor('Informe o nome do fornecedor.');
    return;
  }

  setSalvandoFornecedor(true);
  setMensagemFornecedor('');

  try {
    await axios.post(`${API_URL}/api/fornecedores`, novoFornecedor);

    await carregarDados();

    setNovoFornecedor({
      nome: '',
      contato: '',
      telefone: '',
      email: '',
      endereco: '',
      observacao: ''
    });

    setMostrarFornecedor(false);
    setMensagemFornecedor('Fornecedor cadastrado com sucesso!');
  } catch (error) {
    console.error(error);
    setMensagemFornecedor(
      error.response?.data?.erro ||
      'Não foi possível cadastrar o fornecedor.'
    );
  } finally {
    setSalvandoFornecedor(false);
  }
}

async function registrarSaida(evento) {
  evento.preventDefault();

  if (salvandoSaida) return;

  setSalvandoSaida(true);
  setMensagemSaida('');

  try {
    await axios.post(`${API_URL}/api/estoque/saida`, {
      produto_id: Number(novaSaida.produto_id),
      quantidade: Number(novaSaida.quantidade),
      motivo: novaSaida.motivo.trim(),
      usuario_id: 1
    });

    await carregarDados();

    setNovaSaida({
      produto_id: '',
      quantidade: '',
      motivo: ''
    });

    setMostrarSaida(false);
    setMensagemSaida('Saída registrada com sucesso!');
  } catch (error) {
    console.error(error);

    setMensagemSaida(
      error.response?.data?.erro ||
      'Não foi possível registrar a saída.'
    );
  } finally {
    setSalvandoSaida(false);
  }
}

function renderizarFornecedores() {
  function atualizarFornecedor(evento) {
    const { name, value } = evento.target;

    setNovoFornecedor((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  return (
    <>
      <div className="titulo-pagina">
        <div>
          <h1>Fornecedores</h1>
          <p>Cadastro e consulta de fornecedores</p>
        </div>

        <button
          className="botao-principal"
          onClick={() => {
            setMostrarFornecedor((anterior) => !anterior);
            setMensagemFornecedor('');
          }}
        >
          {mostrarFornecedor ? 'Cancelar' : '+ Novo fornecedor'}
        </button>
      </div>

      {mensagemFornecedor && (
        <div className="painel">{mensagemFornecedor}</div>
      )}

      {mostrarFornecedor && (
        <section className="painel">
          <h2>Cadastrar fornecedor</h2>

          <form
            className="formulario"
            onSubmit={cadastrarFornecedor}
          >
            <label>
              Nome *
              <input
                name="nome"
                value={novoFornecedor.nome}
                onChange={atualizarFornecedor}
                required
              />
            </label>

            <label>
              Pessoa de contato
              <input
                name="contato"
                value={novoFornecedor.contato}
                onChange={atualizarFornecedor}
              />
            </label>

            <label>
              Telefone
              <input
                name="telefone"
                value={novoFornecedor.telefone}
                onChange={atualizarFornecedor}
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                name="email"
                value={novoFornecedor.email}
                onChange={atualizarFornecedor}
              />
            </label>

            <label>
              Endereço
              <input
                name="endereco"
                value={novoFornecedor.endereco}
                onChange={atualizarFornecedor}
              />
            </label>

            <label>
              Observações
              <input
                name="observacao"
                value={novoFornecedor.observacao}
                onChange={atualizarFornecedor}
              />
            </label>

            <button
              className="botao-principal"
              type="submit"
              disabled={salvandoFornecedor}
            >
              {salvandoFornecedor
                ? 'Salvando...'
                : 'Salvar fornecedor'}
            </button>
          </form>
        </section>
      )}

      <section className="painel">
        <h2>Fornecedores cadastrados</h2>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Telefone</th>
                <th>E-mail</th>
              </tr>
            </thead>

            <tbody>
              {fornecedores.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td>{fornecedor.nome}</td>
                  <td>{fornecedor.contato || '-'}</td>
                  <td>{fornecedor.telefone || '-'}</td>
                  <td>{fornecedor.email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fornecedores.length === 0 && (
          <p>Nenhum fornecedor cadastrado.</p>
        )}
      </section>
    </>
  );
}

function renderizarEstoque() {
  function atualizarSaida(evento) {
    const { name, value } = evento.target;

    setNovaSaida((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  return (
    <>
      <div className="titulo-pagina">
        <div>
          <h1>Estoque</h1>
          <p>Consulta e movimentação de produtos</p>
        </div>

        <button
          className="botao-principal"
          onClick={() => {
            setMostrarSaida((anterior) => !anterior);
            setMensagemSaida('');
          }}
        >
          {mostrarSaida ? 'Cancelar' : '+ Registrar saída'}
        </button>
      </div>

      {mensagemSaida && (
        <div className="painel">{mensagemSaida}</div>
      )}

      {mostrarSaida && (
        <section className="painel">
          <h2>Registrar saída de estoque</h2>

          <form className="formulario" onSubmit={registrarSaida}>
            <label>
              Produto *
              <select
                name="produto_id"
                value={novaSaida.produto_id}
                onChange={atualizarSaida}
                required
              >
                <option value="">Selecione um produto</option>

                {estoque.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} — {produto.modelo}
                    {' '}({produto.estoque_atual} disponíveis)
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade *
              <input
                type="number"
                name="quantidade"
                min="1"
                step="1"
                value={novaSaida.quantidade}
                onChange={atualizarSaida}
                required
              />
            </label>

            <label>
              Motivo *
              <select
                name="motivo"
                value={novaSaida.motivo}
                onChange={atualizarSaida}
                required
              >
                <option value="">Selecione o motivo</option>
                <option value="Venda">Venda</option>
                <option value="Utilizado em conserto">
                  Utilizado em conserto
                </option>
                <option value="Produto danificado">
                  Produto danificado
                </option>
                <option value="Ajuste de estoque">
                  Ajuste de estoque
                </option>
              </select>
            </label>

            <button
              className="botao-principal"
              type="submit"
              disabled={salvandoSaida}
            >
              {salvandoSaida ? 'Registrando...' : 'Confirmar saída'}
            </button>
          </form>
        </section>
      )}

      <section className="painel">
        <h2>Produtos em estoque</h2>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Produto</th>
                <th>Modelo</th>
                <th>Quantidade</th>
                <th>Mínimo</th>
                <th>Situação</th>
              </tr>
            </thead>

            <tbody>
              {estoque.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.codigo}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.modelo || '-'}</td>
                  <td>{produto.estoque_atual}</td>
                  <td>{produto.estoque_minimo}</td>
                  <td>
                    {produto.status_estoque === 'normal'
                      ? 'Normal'
                      : produto.status_estoque === 'baixo'
                        ? 'Baixo'
                        : 'Zerado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function renderizarReaproveitamento() {

  async function cadastrarCelularDoador(evento) {
  evento.preventDefault();

  if (salvandoCelularDoador) return;

  const valorPago = Number(novoCelularDoador.valor_pago);

  if (
    !novoCelularDoador.modelo.trim() ||
    novoCelularDoador.valor_pago.trim() === '' ||
    !Number.isFinite(valorPago) ||
    valorPago < 0
  ) {
    setMensagemCelularDoador(
      'Informe o modelo e um valor pago válido.'
    );
    return;
  }

  setSalvandoCelularDoador(true);
  setMensagemCelularDoador('');

  try {
    await axios.post(
      `${API_URL}/api/reaproveitamento/celulares`,
      {
        ...novoCelularDoador,
        valor_pago: valorPago
      }
    );

    await carregarDados();

    setNovoCelularDoador({
      modelo: '',
      imei: '',
      telefone_vendedor: '',
      defeito_informado: '',
      valor_pago: '',
      observacao: ''
    });

    setMostrarCelularDoador(false);
    setMensagemCelularDoador(
      'Celular doador cadastrado com sucesso!'
    );

  } catch (error) {
    console.error(error);

    setMensagemCelularDoador(
      error.response?.data?.erro ||
      'Não foi possível cadastrar o celular doador.'
    );

  } finally {
    setSalvandoCelularDoador(false);
  }
}

async function registrarPecaAproveitada(evento) {
  evento.preventDefault();

  if (
    !novaPeca.celular_doador_id ||
    !novaPeca.produto_id ||
    !Number.isInteger(Number(novaPeca.quantidade)) ||
    Number(novaPeca.quantidade) <= 0
  ) {
    setMensagemPeca('Preencha o celular, o produto e uma quantidade válida.');
    return;
  }

  if (
    novaPeca.valor_unitario !== '' &&
    (
      !Number.isFinite(Number(novaPeca.valor_unitario)) ||
      Number(novaPeca.valor_unitario) < 0
    )
  ) {
    setMensagemPeca('Informe um valor unitário válido.');
    return;
  }

  try {
    setSalvandoPeca(true);
    setMensagemPeca('');

    await axios.post(
      `${API_URL}/api/reaproveitamento/pecas`,
      {
        celular_doador_id: Number(novaPeca.celular_doador_id),
        produto_id: Number(novaPeca.produto_id),
        quantidade: Number(novaPeca.quantidade),
        valor_unitario:
          novaPeca.valor_unitario === ''
            ? null
            : Number(novaPeca.valor_unitario),
        observacao: novaPeca.observacao,
        usuario_id: 1
      }
    );

    await carregarDados();

    setNovaPeca({
      celular_doador_id: '',
      produto_id: '',
      quantidade: '',
      valor_unitario: '',
      observacao: ''
    });

    setMostrarPeca(false);
    setMensagemPeca('Peça reaproveitada registrada com sucesso!');

  } catch (erro) {
    console.error('Erro ao registrar peça:', erro);

    setMensagemPeca(
      erro.response?.data?.erro ||
      'Não foi possível registrar a peça aproveitada.'
    );

  } finally {
    setSalvandoPeca(false);
  }
}

  return (
    <>
      <div className="titulo-pagina">
  <div>
    <h1>Reaproveitamento</h1>
    <p>Controle de celulares adquiridos para retirada de peças</p>
  </div>

  <div className="botoes-reaproveitamento">
    <button
      type="button"
      className="botao-principal"
      onClick={() => {
        setMostrarCelularDoador((anterior) => !anterior);
        setMensagemCelularDoador('');
      }}
    >
      {mostrarCelularDoador
        ? 'Cancelar'
        : '+ Cadastrar celular doador'}
    </button>

    <button
      type="button"
      className="botao-principal botao-reaproveitamento"
      onClick={() => {
        setMostrarPeca((anterior) => !anterior);
        setMensagemPeca('');
      }}
    >
      {mostrarPeca
        ? 'Cancelar registro'
        : '+ Registrar peça aproveitada'}
    </button>
  </div>
</div>

{mensagemPeca && (
  <p>{mensagemPeca}</p>
)}

{mostrarPeca && (
  <form
    className="formulario formulario-pecas"
    onSubmit={registrarPecaAproveitada}
  >
    <h3>Registrar peça aproveitada</h3>

    <label>Celular doador</label>
    <select
      required
      value={novaPeca.celular_doador_id}
      onChange={(e) =>
        setNovaPeca({
          ...novaPeca,
          celular_doador_id: e.target.value
        })
      }
    >
      <option value="">Selecione o celular</option>
      {celularesDoadores.map((celular) => (
        <option key={celular.id} value={celular.id}>
          {celular.modelo}
        </option>
      ))}
    </select>

    <label>Produto / Peça</label>
    <select
      required
      value={novaPeca.produto_id}
      onChange={(e) =>
        setNovaPeca({
          ...novaPeca,
          produto_id: e.target.value
        })
      }
    >
      <option value="">Selecione o produto</option>
      {produtos.map((produto) => (
        <option key={produto.id} value={produto.id}>
          {produto.nome} - {produto.codigo}
        </option>
      ))}
    </select>

    <label>Quantidade</label>
    <input
      type="number"
      min="1"
      step="1"
      required
      value={novaPeca.quantidade}
      onChange={(e) =>
        setNovaPeca({
          ...novaPeca,
          quantidade: e.target.value
        })
      }
    />

    <label>Valor unitário (opcional)</label>
    <input
      type="number"
      min="0"
      step="0.01"
      value={novaPeca.valor_unitario}
      onChange={(e) =>
        setNovaPeca({
          ...novaPeca,
          valor_unitario: e.target.value
        })
      }
    />

    <label>Observação</label>
    <textarea
      value={novaPeca.observacao}
      onChange={(e) =>
        setNovaPeca({
          ...novaPeca,
          observacao: e.target.value
        })
      }
    />

    <button
      type="submit"
      className="botao-principal"
      disabled={salvandoPeca}
    >
      {salvandoPeca ? 'Salvando...' : 'Salvar peça aproveitada'}
    </button>
  </form>
)}

{mensagemCelularDoador && (
  <div className="painel">{mensagemCelularDoador}</div>
)}

{mostrarCelularDoador && (
  <section className="painel">
    <h2>Cadastrar celular doador</h2>

    <form
      className="formulario"
      onSubmit={cadastrarCelularDoador}
    >
      <label>
        Modelo *
        <input
          name="modelo"
          value={novoCelularDoador.modelo}
          onChange={(e) =>
            setNovoCelularDoador({
              ...novoCelularDoador,
              modelo: e.target.value
            })
          }
          required
        />
      </label>

      <label>
        IMEI
        <input
          name="imei"
          value={novoCelularDoador.imei}
          onChange={(e) =>
            setNovoCelularDoador({
              ...novoCelularDoador,
              imei: e.target.value
            })
          }
        />
      </label>

      <label>
        Telefone do vendedor
        <input
          name="telefone_vendedor"
          value={novoCelularDoador.telefone_vendedor}
          onChange={(e) =>
            setNovoCelularDoador({
              ...novoCelularDoador,
              telefone_vendedor: e.target.value
            })
          }
        />
      </label>

      <label>
        Defeito informado
        <input
          name="defeito_informado"
          value={novoCelularDoador.defeito_informado}
          onChange={(e) =>
            setNovoCelularDoador({
              ...novoCelularDoador,
              defeito_informado: e.target.value
            })
          }
        />
      </label>

      <label>
        Valor pago (R$) *
        <input
          type="number"
          min="0"
          step="0.01"
          name="valor_pago"
          value={novoCelularDoador.valor_pago}
          onChange={(e) =>
            setNovoCelularDoador({
              ...novoCelularDoador,
              valor_pago: e.target.value
            })
          }
          required
        />
      </label>

      <label>
        Observações
        <textarea
          name="observacao"
          value={novoCelularDoador.observacao}
          onChange={(e) =>
            setNovoCelularDoador({
              ...novoCelularDoador,
              observacao: e.target.value
            })
          }
        />
      </label>

      <button
        className="botao-principal"
        type="submit"
        disabled={salvandoCelularDoador}
      >
        {salvandoCelularDoador
          ? 'Salvando...'
          : 'Salvar celular doador'}
      </button>
    </form>
  </section>
)}

      <section className="painel">
        <h2>Celulares doadores cadastrados</h2>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Defeito informado</th>
                <th>Valor pago</th>
                <th>Data da compra</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {celularesDoadores.map((celular) => (
                <tr key={celular.id}>
                  <td>{celular.modelo}</td>
                  <td>{celular.defeito_informado || '-'}</td>
                  <td>
                    {Number(celular.valor_pago).toLocaleString(
                      'pt-BR',
                      {
                        style: 'currency',
                        currency: 'BRL'
                      }
                    )}
                  </td>
                  <td>
                    {celular.data_compra
                      ? new Date(celular.data_compra).toLocaleDateString(
                          'pt-BR',
                          { timeZone: 'UTC' }
                        )
                      : '-'}
                  </td>
                  <td>{celular.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

               {celularesDoadores.length === 0 && (
          <p>Nenhum celular doador cadastrado.</p>
        )}
      </section>

      {/* HISTÓRICO DE PEÇAS REAPROVEITADAS */}

      <section className="painel">
        <h2>Histórico de peças reaproveitadas</h2>

        <p className="subtitulo">
          Peças retiradas de celulares doadores e adicionadas ao estoque
        </p>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Celular doador</th>
                <th>Produto / Peça</th>
                <th>Quantidade</th>
                <th>Valor unitário</th>
                <th>Observação</th>
              </tr>
            </thead>

            <tbody>
              {pecasAproveitadas.map((peca) => (
                <tr key={peca.id}>
                  <td>#{peca.id}</td>

                  <td>{peca.celular_doador}</td>

                  <td>
                    {peca.produto}
                    <div>
                      <small>{peca.codigo_produto}</small>
                    </div>
                  </td>

                  <td>{peca.quantidade}</td>

                  <td>
                    {peca.valor_unitario == null
                      ? '-'
                      : Number(peca.valor_unitario).toLocaleString(
                          'pt-BR',
                          {
                            style: 'currency',
                            currency: 'BRL'
                          }
                        )}
                  </td>

                  <td>{peca.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pecasAproveitadas.length === 0 && (
          <p>Nenhuma peça reaproveitada cadastrada.</p>
        )}
      </section>
    </>
  );
}

  function renderizarPagina() {
    switch (pagina) {
      case 'produtos':
        return renderizarProdutos();

      case 'estoque':
        return renderizarEstoque();

      case 'compras':
        return renderizarCompras();

      case 'fornecedores':
        return renderizarFornecedores();

      case 'reaproveitamento':
        return renderizarReaproveitamento();

      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
  <img
    src="/imagens/logo-jc.jpg"
    alt="Logo JC Celulares"
    className="logo-imagem"
  />

  <div className="logo-texto">
    <strong>JC Celulares</strong>
    <span>Controle de Estoque</span>
  </div>
</div>

        <nav>
          <button
            className={pagina === 'dashboard' ? 'ativo' : ''}
            onClick={() => setPagina('dashboard')}
          >
            Dashboard
          </button>

          <button
            className={pagina === 'produtos' ? 'ativo' : ''}
            onClick={() => setPagina('produtos')}
          >
            Produtos
          </button>

          <button
            className={pagina === 'estoque' ? 'ativo' : ''}
            onClick={() => setPagina('estoque')}
          >
            Estoque
          </button>

          <button
            className={pagina === 'compras' ? 'ativo' : ''}
            onClick={() => setPagina('compras')}
          >
            Compras
          </button>

          <button
            className={pagina === 'fornecedores' ? 'ativo' : ''}
            onClick={() => setPagina('fornecedores')}
          >
            Fornecedores
          </button>

          <button
            className={pagina === 'reaproveitamento' ? 'ativo' : ''}
            onClick={() => setPagina('reaproveitamento')}
          >
            Reaproveitamento
          </button>
        </nav>

        <div className="sidebar-rodape">
          Sistema JC Celulares
        </div>
      </aside>

      <main className="conteudo">
        {erro && <div className="erro">{erro}</div>}
        {renderizarPagina()}
      </main>
    </div>
  );
}

export default App;