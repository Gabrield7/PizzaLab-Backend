import pedidos from '../data/pedidos.json' with { type: 'json' };
import pizzas from "../data/pizzas.json" with { type: "json" };
import bebidas from "../data/bebidas.json" with { type: "json" };
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const getPedido = (id) => {
  return id ? pedidos.find((pedido) => pedido.id === id) : pedidos;
}

export const processarItensPedido = (itens) => {
  let valorTotal = 0;

  const itensProcessados = itens.map(item => {
    let produto;

    if (item.tipo === "pizza") {
      produto = pizzas.find(p => p.id === item.produtoId);
    }

    if (item.tipo === "bebida") {
      produto = bebidas.find(b => b.id === item.produtoId);
    }

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    const subtotal = produto.preco * item.quantidade;

    valorTotal += subtotal;

    return {
      produtoId: produto.id,
      nome: produto.nome,
      tipo: item.tipo,
      quantidade: item.quantidade,
      preco: produto.preco,
      subtotal
    };
  });

  return { itensProcessados, valorTotal };
}

// Solução temporária para salvar pedidos em um arquivo JSON
export const salvarPedido = async (novoPedido) => { 
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const caminhoArquivo = path.join(__dirname, '..', 'data', 'pedidos.json');

  try {
    const data = await fs.readFile(caminhoArquivo, 'utf8');
    const pedidos = JSON.parse(data);

    pedidos.push(novoPedido);

    await fs.writeFile(caminhoArquivo, JSON.stringify(pedidos, null, 2));
    
    return novoPedido;
  } catch (err) {
    throw new Error(`Erro ao salvar o arquivo: ${err.message}`);
  }
};
