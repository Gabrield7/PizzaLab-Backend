export function gerenciadorErros(error, req, res, next) {
  // Tratamento de erros customizados com status HTTP
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  // Tratamento geral de erros de validação do Prisma (Ex: violação de chave estrangeira, dados inconsistentes etc.)
  if (error.code && error.code.startsWith("P2")) {
    console.error(" [Erro de Banco/Prisma]:", error.meta || error.message);
    return res.status(400).json({ error: "Erro de consistência de dados no banco." });
  }

  // Tratamento de erros inesperados ou não tratados
  console.error("Erro Não Tratado:", error);
  return res.status(500).json({ 
    error: "Erro interno no servidor. Por favor, tente novamente mais tarde" 
  });
}