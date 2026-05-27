import prisma from '../prismaClient.js';
import { nanoid } from 'nanoid';
import { calculaTotal, registraCliente, registraEndereco } from '../utils/PedidoUtils.js';

class PedidosController {
  async getPedidosParaPainel(req, res, next) { // Listar pedidos no painel, com filtros baseados no cargo do usuário logado
    try {
      // Extração segura do ID e cargo do usuário logado a partir do token JWT
      const { id: usuarioId, cargo: usuarioCargo } = req.usuarioLogado;

      const queryConfig = { // Configuração base da consulta, sem filtros iniciais
        where: {},
        include: {
          itens_pedido: { include: { produto: true } }
        },
        orderBy: { data_pedido: "asc" } 
      };

      // Aplicação de filtros com base no cargo do usuário para limitar os pedidos visíveis
      switch (usuarioCargo) {
        case "gestor":
          queryConfig.orderBy = { data_pedido: "desc" };
          break;

        case "pizzaiolo":
          queryConfig.where.status = { in: ["pendente", "em_preparo", "pronto"] };
          break;

        case "entregador":
          queryConfig.where.status = { in: ["pronto", "em_rota", "entregue"] };
          break;

        default:
          return res.status(403).json({ error: "Cargo não reconhecido pelo painel." });
      }

      const pedidos = await prisma.pedido.findMany(queryConfig);

      if (pedidos.length === 0) {
        return res.status(404).json({ message: "Nenhum pedido encontrado" });
      }

      return res.status(200).json({pedidos});

    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  }
  
  static async createPedido(req, res, next) {
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
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  }

  static async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { novo_status } = req.body;
      const { cargo } = req.usuarioLogado;
 
      const pedido = await prisma.pedido.findUnique({ where: { id } });
 
      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }
 
      // Lança erro com status HTTP se a transição ou permissão for inválida
      validarTransicaoStatus(pedido.status, novo_status);
      validarPermissaoTransicao(novo_status, cargo);
 
      const pedidoAtualizado = await prisma.pedido.update({
        where: { id },
        data: { status: novo_status }
      });
 
      return res.status(200).json({
        message: `Status do pedido atualizado para '${novo_status}' com sucesso!`,
        pedido: pedidoAtualizado
      });
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  }
}

export { PedidosController };

