import prisma from "../config/database.js";
import { nanoid } from "nanoid";

export class UsuarioController {
  async getUsuarios(req, res) {
    try {
      const { cargo, ordem, campo } = req.query;

      const queryConfig = {
        where: { ativo: true },
        orderBy: {}
      };
 
      if (cargo) {
        queryConfig.where.cargo = cargo;
      }
 
      const camposPermitidos = ["nome", "data_criacao"];
      const campoOrdenacao = camposPermitidos.includes(campo) ? campo : "nome";
      const direcaoOrdenacao = ordem === "desc" ? "desc" : "asc";
 
      queryConfig.orderBy[campoOrdenacao] = direcaoOrdenacao;
 
      const usuarios = await prisma.usuario.findMany(queryConfig);
 
      if (usuarios.length === 0) {
        return res.status(404).json({ message: "Nenhum usuário cadastrado no momento" });
      }
 
      return res.status(200).json({ 
        message: "Usuários listados com sucesso!",
        usuarios 
      });
    } catch (error) {
      console.error("Erro no getUsuarios:", error);
      return res.status(500).json({ error: "Erro interno ao listar usuários" });
    }
  }

  async getUsuarioById(req, res) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id: id }
      });

      if (!usuario) {
        return res.status(404).json({ message: `Usuário com ID ${id} não encontrado` });
      }

      return res.status(200).json({ 
        message: `Usuário encontrado com sucesso!`, 
        usuario
      });
    } catch (error) {
      console.error("Erro no getUsuarioById:", error);
      return res.status(500).json({ error: "Erro interno ao buscar o usuário" });
    }
  }
  
  async createUsuario(req, res, next) {
    try {
      const { nome, email, telefone, cargo } = req.body;

      if (!nome || !email || !cargo) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios ausentes' 
        });
      }

      // Sanitiza o telefone se ele tiver sido enviado
      const telefoneLimpo = telefone ? telefone.replace(/\D/g, '') : null;

      const novoUsuario = await prisma.usuario.create({
        data: {
          id: nanoid(12),
          nome,
          email,
          senha: nanoid(8),
          telefone: telefoneLimpo,
          cargo
        }
      });

      return res.status(201).json(novoUsuario);
    } catch (error) {
      console.error("Erro no createUsuario:", error);
      return res.status(500).json({ error: "Erro interno ao criar usuário" });

    }
  }

  async updateUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, cargo, ativo } = req.body;

      // Verificar se o usuário existe
      const usuario = await prisma.usuario.findUnique({ where: { id } });

      if (!usuario) {
        return res.status(404).json({ message: `Usuário com ID ${id} não encontrado` });
      }

      // Atualizar o produto no banco de dados
      const dadosParaAtualizar = {};

      if (nome !== undefined) dadosParaAtualizar.nome = nome;
      if (email !== undefined) dadosParaAtualizar.email = email;
      if (telefone !== undefined) dadosParaAtualizar.telefone = telefone;
      if (cargo !== undefined) dadosParaAtualizar.cargo = cargo;
      if (ativo !== undefined) dadosParaAtualizar.ativo = ativo;

      // Salva os dados atualizados do usuário no banco de dados
      const usuarioAtualizado = await prisma.usuario.update({
        where: { id },
        data: dadosParaAtualizar
      });

      return res.status(200).json({ // Retorno dos dados para o cliente
        message: `Usuário ${id} atualizado com sucesso!`, 
        usuario: usuarioAtualizado 
      });
    } catch (error) {
      console.error("Erro no updateUsuario:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar usuário" });
    }
  }

  async deleteUsuario(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o usuário existe
      const usuario = await prisma.usuario.findUnique({ where: { id } });

      if (!usuario) {
        return res.status(404).json({ message: `Usuário com ID ${id} não encontrado` });
      }

      await prisma.usuario.update({ // Desativa o usuário no banco de dados
        where: { id },
        data: { ativo: false }
      });

      return res.status(200).json({ // Retorno dos dados para o cliente
        message: `Usuário ${usuario.nome} desativado com sucesso!`, 
      });
    } catch (error) {
      console.error("Erro no deleteUsuario:", error);
      return res.status(500).json({ error: "Erro interno ao deletar usuário" });
    }
  }

  async updateSenha(req, res) {
    try {
      const { id } = req.params;
      const { senha_atual, nova_senha } = req.body;

      if (!senha_atual || !nova_senha) { // Validação simples para garantir que ambos os campos sejam enviados
        return res.status(400).json({ error: "Informe a senha atual e a nova senha" });
      }
      
      // Busca o usuário para validar a senha atual
      const usuario = await prisma.usuario.findUnique({ where: { id } });

      if (!usuario || !usuario.ativo) {
        return res.status(404).json({ message: "Usuário não encontrado ou inativo" });
      }

      // Valida se a senha atual digitada bate com a do banco
      if (usuario.senha !== senha_atual) {
        return res.status(401).json({ error: "A senha atual digitada está incorreta" });
      }

      await prisma.usuario.update({ // Atualiza para a nova senha
        where: { id },
        data: { senha: nova_senha }
      });

      return res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      console.error("Erro no updateSenha:", error);
      return res.status(500).json({ error: "Erro interno ao alterar a senha" });
    }
  }
}
