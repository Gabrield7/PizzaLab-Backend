import { nanoid } from 'nanoid';

// Função para registrar ou recuperar um cliente com base no telefone
export async function registraCliente(tx, nome, telefone) {
  return await tx.cliente.upsert({
    where: { telefone },
    update: { nome }, // Se existir, atualiza o nome caso tenha mudado
    create: { id: nanoid(12), nome, telefone }
  });
}

// Função para registrar ou recuperar um endereço com base nos dados fornecidos
export async function registraEndereco(tx, clienteId, logradouro, numero, bairro, cidade, cep, complemento) {
  const existente = await tx.endereco.findFirst({
    where: { cliente_id: clienteId, logradouro, numero, ativo: true }
  });

  if (existente) return existente;
  
  return tx.endereco.create({
    data: { id: nanoid(12), cliente_id: clienteId, logradouro, numero, bairro, cidade, cep, complemento }
  });
}

// Função para calcular o total do pedido com base nos itens e taxa de entrega
export function calculaTotal(itens, taxa = 5, pedidoId) {
  const itensMapeados = itens.map(item => ({
    id: nanoid(12),
    pedido_id: pedidoId,
    produto_id: item.produto_id,
    quantidade: item.quantidade,
    preco_historico: item.preco_unitario,
    subtotal: item.quantidade * item.preco_unitario
  }));
 
  const totalGeral = itensMapeados.reduce((acc, item) => acc + item.subtotal, 0) + taxa;
 
  return { itensMapeados, totalGeral };
}

// Função para calcular a taxa de entrega com base no bairro do cliente
export function calculaTaxaEntrega(bairro) {
  const taxaBase = 5.00; // Taxa base para bairros não listados
  if (!bairro) return taxaBase;
 
  const bairroFormatado = bairro
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
 
  const tabela = {
    "santo antonio":          0.00,
    "nova betania":           3.00,
    "centro":                 4.00,
    "lto do vale":            6.00,
    "maria auxiliadora":      5.50,
    "padre jose cruza":       6.50,
    "boa vista":              7.00,
    "presidente costa silva": 8.00,
    "zona rural":            15.00
  };
 
  return tabela[bairroFormatado] ?? taxaBase;
}

// Fluxo de status do pedido
export const fluxoStatus = {
  pendente:   ["em_preparo", "cancelado"],
  em_preparo: ["pronto",    "cancelado"],
  pronto:     ["em_rota"],
  em_rota:    ["entregue"],
  entregue:   [],
  cancelado:  []
};

// Cargos autorizados para cada transição de status
export const cargosPorTransicao = {
  em_preparo: ["pizzaiolo", "gestor"],
  pronto:     ["pizzaiolo", "gestor"],
  em_rota:    ["entregador", "gestor"],
  entregue:   ["entregador", "gestor"],
  cancelado:  ["gestor"]
};

// Função para validar se a transição de status é permitida
export function validarTransicaoStatus(statusAtual, novoStatus) {
  const permitidos = fluxoStatus[statusAtual];

  if (!permitidos) {
    const erro = new Error(`Status atual '${statusAtual}' não reconhecido`);
    erro.status = 400;
    throw erro;
  }

  if (!permitidos.includes(novoStatus)) {
    const erro = new Error(`Transição inválida: pedido com status '${statusAtual}' não pode ir para '${novoStatus}'`);
    erro.status = 400;
    throw erro;
  }
}

// Função para validar se o usuário tem permissão para realizar a transição de status
export function validarPermissaoTransicao(novoStatus, cargo) {
  const autorizados = cargosPorTransicao[novoStatus];

  if (!autorizados) {
    const erro = new Error(`Status destino '${novoStatus}' não possui regra de permissão definida`);
    erro.status = 400;
    throw erro;
  }

  if (!autorizados.includes(cargo)) {
    const erro = new Error(`Você não tem permissão para atualizar o status do pedido para '${novoStatus}'`);
    erro.status = 403;
    throw erro;
  }
}