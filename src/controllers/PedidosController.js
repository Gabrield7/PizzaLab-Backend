import { getPedido, processarItensPedido, salvarPedido } from '../models/pedidosModel.js';

class PedidosController {
  static listarPedidos(req, res) {
    const pedidos = getPedido();

    if (!pedidos) {
      return res.status(400).json({ error: "Pedido não encontrado!" });
    }

    return res.status(200).json(pedidos);
  }

  static listarPedido(req, res) {
    const id = parseInt(req.params.id);
    const pedidos = getPedido(id);

    if (!pedidos) {
      return res.status(400).json({ error: "Pedido não encontrado!" });
    }

    return res.status(200).json(pedidos);
  }

  static async criarPedido(req, res) {
    const { cliente, endereco, itens } = req.body;

    if(!cliente || !endereco || !itens) {
      return res.status(400).json({ error: "Dados do pedido incompletos!" });
    }

    try {
      const { itensProcessados, valorTotal } = processarItensPedido(itens);
  
      const novoPedido = {
        id: getPedido().length + 1 || 1,
        cliente,
        endereco,
        itens: itensProcessados,
        valorTotal,
        status: "recebido",
        pizzaioloId: 1,
        entregadorId: 1,
        dataPedido: new Date()
      };
  
      await salvarPedido(novoPedido);
      return res.status(201).json({novoPedido});
    } catch (erro) {
      res.status(404).json({ error: erro.message });
    }
  }

  // static processarItensPedido = (itens) => {
  //   let valorTotal = 0;

  //   const itensProcessados = itens.map(item => {
  //     let produto;

  //     if (item.tipo === "pizza") {
  //       produto = pizzas.find(p => p.id === item.produtoId);
  //     }

  //     if (item.tipo === "bebida") {
  //       produto = bebidas.find(b => b.id === item.produtoId);
  //     }

  //     if (!produto) {
  //       throw new Error("Produto não encontrado.");
  //     }

  //     const subtotal = produto.preco * item.quantidade;

  //     valorTotal += subtotal;

  //     return {
  //       produtoId: produto.id,
  //       nome: produto.nome,
  //       tipo: item.tipo,
  //       quantidade: item.quantidade,
  //       preco: produto.preco,
  //       subtotal
  //     };
  //   });

  //   return { itensProcessados, valorTotal };
  // }
}

export { PedidosController };

