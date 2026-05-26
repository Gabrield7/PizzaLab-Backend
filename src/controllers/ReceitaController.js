import prisma from "../config/database.js";
import { nanoid } from "nanoid";

export class ReceitaController {
  static async createReceita(req, res) {
    try {
      const { produto_id } = req.params;
      const { ingredientes } = req.body;
      
      // Verificar se o produto existe
      const produto = await prisma.produto.findUnique({ where: { id: produto_id } });
      if (!produto) {
        return res.status(404).json({ error: `Produto com ID ${produto_id} não encontrado` });
      }

      // Validação do array de ingredientes
      if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
        return res.status(400).json({ error: "O corpo da requisição deve conter um array de ingredientes." });
      }

    } catch (error) {
      console.error("Erro ao criar receita:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}