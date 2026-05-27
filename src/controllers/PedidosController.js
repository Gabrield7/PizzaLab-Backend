import prisma from '../prismaClient.js';
import { nanoid } from 'nanoid';
import { calculaTotal, registraCliente, registraEndereco } from '../utils/PedidoUtils.js';

class PedidosController {
  static async createPedido(req, res) {
    try {
      const {
        telefone,
        nome,
        logradouro,
        numero,
        bairro,
        cidade,
        cep,
        complemento,
        observacoes,
        itens
      } = req.body;

      // Validação básica dos dados obrigatórios do checkout
      if (!telefone || !nome || !logradouro || !bairro || !numero || !itens || itens.length === 0) {
        return res.status(400).json({ error: "Dados obrigatórios do pedido estão ausentes." });
      }

      const telefoneLimpo = telefone.replace(/\D/g, '');
      
      // Cálculo de taxas e totais 
      const taxaEntrega = calculaTaxaEntrega(bairro);
      const { itensMapeados, totalGeral } = calculaTotal(itens, TAXA_ENTREGA, pedidoId);

      const novoPedido = await prisma.$transaction(async (tx) => {
        // Registro invisível do cliente e endereço
        const cliente = await registraCliente(tx, nome, telefoneLimpo);
        const endereco = await registraEndereco(tx, cliente.id, logradouro, numero, bairro, city = cidade, cep, complemento);

        // 2. Criação do Pedido (Snapshots + Valores calculados)
        const pedidoCriado = await tx.pedido.create({
          data: {
            id: nanoid(12),
            cliente_id: cliente.id,
            endereco_id: endereco.id,
            cliente_nome: nome,
            cliente_telefone: telefoneLimpo,

            entrega_logradouro: logradouro,
            entrega_numero: numero,
            entrega_bairro: bairro,
            entrega_cidade: cidade,
            entrega_cep: cep,
            entrega_complemento: complemento,

            status: "pendente",
            subtotal: subtotal,
            taxa_entrega: taxaEntrega,
            valor_total: total,
            observacoes
          }
        });

        // Grava os itens em lote no banco
        await tx.itemPedido.createMany({
          data: itensMapeados
        });

        return pedidoCriado;
      });

      return res.status(201).json({
        message: "Pedido gerado com sucesso no PizzaLab!",
        pedido: novoPedido
      });
    } catch (error) {
      console.error("Erro no createPedido:", error);
      return res.status(500).json({ error: "Erro interno ao criar pedido" });
    }
  }
}

export { PedidosController };

