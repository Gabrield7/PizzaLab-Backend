import prisma from "../config/database.js";
import { nanoid } from "nanoid";

class ProdutoController {
  static async getProdutos(req, res) {
    try {
      const { categoria } = req.query; // Obter o parâmetro de categoria da query string

      const queryConfig = { where: {} }; // Configuração base da consulta

      if (categoria) { // Filtro Categoria
        queryConfig.where.categoria = categoria;
      }

      // Listar os produtos no banco de dados
      const produtos = await prisma.produto.findMany(queryConfig);

      if (produtos.length === 0) { // Erro caso não haja produtos cadastrados
        return res.status(404).json({ message: "Nenhum produto cadastrado no momento." });
      }

      // Retorno dos dados para o cliente
      return res.status(200).json(produtos);
    } catch (error) {
      console.error("Erro no getProdutos:", error);
      return res.status(500).json({ error: "Erro ao listar produtos" });
    }
  }

  static async getProdutosById(req, res) {
    try {
      const { id } = req.params; // Obter o ID do produto a partir dos parâmetros da rota

      // Buscar o produto no banco de dados pelo ID
      const produto = await prisma.produto.findUnique({ 
        where: { id: id }
      });

      if (!produto) { // Erro caso o produto não seja encontrado
        return res.status(404).json({ message: `Produto com ID ${id} não cadastrado` });
      }

      // Retorno dos dados para o cliente
      return res.status(200).json(produto);
    } catch (error) {
      console.error("Erro no getProdutosById:", error);
      return res.status(500).json({ error: "Erro interno ao buscar o produto" });
    }
  }

  static async createProduto(req, res) {
    try {
      const { nome, preco, descricao, categoria, imagem } = req.body;

      if (!nome || !preco || !descricao || !categoria) { // Verificação de campos obrigatórios
        return res.status(400).json({ error: "Campos obrigatórios ausentes." });
      }

      // Criação do novo produto no banco de dados
      const novoProduto = await prisma.produto.create({
        data: {
          id: nanoid(12),
          nome,
          preco_unitario: preco,
          descricao,
          categoria,
          imagem_url: imagem || null
        }
      });

      return res.status(201).json({
        message: "Produto criado com sucesso!",
        produto: novoProduto
      });
    } catch (error) {
      console.error("Erro no createProduto:", error);
      return res.status(500).json({ error: "Erro interno ao criar o produto" });
    }
  }

  static async updateProduto(req, res) {
    try {
      const { id } = req.params;
      const { nome, preco, descricao, categoria, imagem } = req.body;

      // Verificar se o produto existe
      const produtoExistente = await prisma.produto.findUnique({ where: { id } });

      if (!produtoExistente) {
        return res.status(404).json({ message: `Produto com ID ${id} não encontrado` });
      }

      // Atualizar o produto no banco de dados
      const dadosParaAtualizar = {};

      if (nome !== undefined) dadosParaAtualizar.nome = nome;
      if (preco !== undefined) dadosParaAtualizar.preco_unitario = preco;
      if (descricao !== undefined) dadosParaAtualizar.descricao = descricao;
      if (categoria !== undefined) dadosParaAtualizar.categoria = categoria;
      if (imagem !== undefined) dadosParaAtualizar.imagem_url = imagem || null;

      // Atualizar o produto com os dados filtrados
      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: dadosParaAtualizar
      });

      return res.status(200).json({ 
        message: `Produto ${id} atualizado com sucesso!`, 
        produto: produtoAtualizado 
      });
    } catch (error) {
      console.error("Erro no updateProduto:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar o produto" });
    }
  }

  static async deleteProduto(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o produto existe
      const produtoExistente = await prisma.produto.findUnique({ where: { id } });

      if (!produtoExistente) {
        return res.status(404).json({ message: `Produto com ID ${id} não encontrado` });
      }

      // Deletar o produto do banco de dados
      await prisma.produto.delete({ where: { id } });

      return res.status(200).json({ 
        message: `Produto ${id} deletado com sucesso!`, 
        produto: produtoExistente 
      });
    } catch (error) {
      console.error("Erro no deleteProduto:", error);
      return res.status(500).json({ error: "Erro interno ao deletar o produto" });
    }
  }
}
  
export { ProdutoController };
