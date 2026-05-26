// Função para calcular o status do estoque com base na quantidade atual e mínima
export function calcularStatusEstoque(atual, minimo) {
  const qtdAtual = Number(atual || 0);
  const qtdMinima = Number(minimo || 0);

  if (qtdMinima <= 0) return "normal";
  if (qtdAtual <= (qtdMinima * 0.5)) return "critico";
  if (qtdAtual < qtdMinima) return "baixo";

  return "normal";
}

// Função para filtrar ingredientes por status
export function filtrarPorStatus(ingredientes, statusDesejado) {
  if (!statusDesejado) return ingredientes; // Se não passou status na URL, não filtra nada
  
  return ingredientes.filter(
    ing => ing.status === statusDesejado.toLowerCase()
  );
}

// Função para ordenar ingredientes
export function ordenarIngredientes(ingredientes, coluna, ordem) {
  const listaOrdenada = [...ingredientes]; // Cria uma cópia para não alterar o original

  listaOrdenada.sort((a, b) => {
    // Se for ordenar por nome (texto)
    if (coluna === 'nome') {
      return ordem === 'desc' 
        ? b.nome.localeCompare(a.nome) 
        : a.nome.localeCompare(b.nome);
    }

    // Se for ordenar por qualquer coluna numérica (estoque, preço, etc)
    const valA = Number(a[coluna] || 0);
    const valB = Number(b[coluna] || 0);

    return ordem === 'desc' ? valB - valA : valA - valB;
  });

  return listaOrdenada;
}