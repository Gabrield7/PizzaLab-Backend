import { buscarClienteEUltimoEndereco } from '../utils/clienteUtils.js';

export class ClienteController {
  async buscarPorTelefone(req, res, next) {
    try {
      const { telefone } = req.query;

      if (!telefone) {
        return res.status(400).json({ 
          error: 'O parâmetro telefone é obrigatório para realizar a busca.' 
        });
      }

      // Sanitiza o telefone para garantir que apenas números sejam considerados na busca
      const telefoneLimpo = telefone.replace(/\D/g, '');

      // Busca o cliente pelo telefone e inclui os endereços ativos associados a ele
      const cliente = await prisma.cliente.findUnique({
        where: { telefone: telefoneLimpo },
        include: {
          endereco: {
            where: { ativo: true },
            select: {
              id: true,
              logradouro: true,
              numero: true,
              bairro: true,
              cidade: true,
              cep: true,
              complemento: true
            }
          }
        }
      });

      return res.status(200).json({ // Retorno dos dados para o cliente
        message: `Cliente encontrado com sucesso!`,
        cliente
      });
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  }

  async desativarEndereco(req, res, next) {
    try {
      const { id } = req.params;

      // Verifica se o endereço existe e está ativo
      const endereco = await prisma.endereco.findUnique({ where: { id } });

      if (!endereco || !endereco.ativo) {
        return res.status(404).json({ 
          message: `Endereço não encontrado ou inativo` 
        });
      }
      // Desativa o endereço no banco de dados
      await prisma.endereco.update({
        where: { id },
        data: { ativo: false }
      });

      return res.status(200).json({ 
        message: 'Endereço removido desativado com sucesso' 
      });
    } catch (error) {
      next(error); // Passa o erro para o middleware de tratamento de erros
    }
  }
}
