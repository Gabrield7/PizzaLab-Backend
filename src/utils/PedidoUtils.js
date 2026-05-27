import { nanoid } from 'nanoid';

export async function registraCliente(tx, nome, telefone) {
  let cliente = await tx.cliente.findUnique({
    where: { telefone: telefone }
  });

  if (!cliente) {
    cliente = await tx.cliente.create({
      data: {
        id: nanoid(12),
        nome,
        telefone: telefone
      }
    });
  }

  return cliente;
}

export async function registraEndereco(tx, clienteId, logradouro, numero, bairro, cidade, cep, complemento) {
  let endereco = await tx.endereco.findFirst({
    where: {
      cliente_id: clienteId,
      logradouro,
      numero,
      ativo: true
    }
  });
  
  if (!endereco) {
    endereco = await tx.endereco.create({
      data: {
        id: nanoid(12),
        cliente_id: clienteId,
        logradouro,
        numero,
        bairro,
        cidade,
        cep,
        complemento
      }
    });
  }

  return endereco;
}

export function calculaTotal(itens, taxa = 0) {
  // Calcula o somatório dos produtos de forma segura
  const subtotal = itens.reduce((acumulado, item) => {
    return acumulado + (item.quantidade * item.preco_unitario);
  }, 0);

  return {
    subtotal,
    total: subtotal + taxa
  };
}

export function calculaTotal(itens, taxa = 0, pedidoId) {
  // Mapeia os itens calculando o subtotal de cada um
  const itensCalculados = itens.map((item) => {
    const subtotalItem = item.quantidade * item.preco_unitario;
    
    return {
      id: nanoid(12),
      pedido_id: pedidoId,
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      preco_historico: item.preco_unitario,
      subtotal: subtotalItem
    };
  });

  // Soma o subtotal de todos os itens para gerar o total geral
  const valorProdutos = itensCalculados.reduce((acumulado, item) => {
    return acumulado + item.subtotal;
  }, 0);

  return {
    itensMapeados: itensCalculados,
    totalGeral: valorProdutos + taxa
  };
}

export function calculaTaxaEntregaPorBairro(bairro) {
  const taxaBase = 5.00; // Taxa base para bairros não listados
  if (!bairro) return taxaBase;
  
  // Remove acentos, espaços e converte para minúsculas
  const bairroFormatado = bairro 
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const tabelaPrecos = {
    "santo antonio": 0.00,
    "nova betania": 3.00,
    "centro": 4.00,
    "lto do vale": 6.00,
    "maria auxiliadora": 5.50,
    "padre jose cruza": 6.50,
    "boa vista": 7.00,
    "presidente costa silva": 8.00,
    "zona rural": 15.00
  };

  return tabelaPrecos[bairroFormatado] || taxaBase;
}