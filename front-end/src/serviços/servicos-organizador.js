import servidor from "./servidor";

export function servicoCadastrarOrganizador(organizador) { 
  return servidor.post("/organizadores", organizador); 
}
export function servicoBuscarOrganizador(cpf) { 
  return servidor.get(`/organizadores/${cpf}`); 
}

export function servicoAtualizarOrganizador(organizador) { 
  return servidor.patch("/organizadores", organizador); 
}

export function servicoCadastrarCompeticao(competicao) { 
  return servidor.post("/organizadores/competicoes", competicao); 
}
export function servicoAlterarCompeticao(competicao) { 
  return servidor.patch("/organizadores/competicoes", competicao); 
}
export function servicoRemoverCompeticao(id) { // Adaptado
  return servidor.delete(`/organizadores/competicoes/${id}`); 
}
export async function servicoBuscarCompeticoesDoOrganizador(cpf) {
  try {
    const resposta = await servidor.get(`/organizadores/competicoes/organizador/${cpf}`);
    return resposta;
  } catch (erro) {
    if (erro.response && erro.response.status === 404) {
      return { data: [], erro: "Nenhuma competição encontrada para este organizador." };
    }
    return { data: [], erro: "Erro ao buscar competições do organizador." };
  }
}
export function servicoBuscarAreasDasCompeticoes() { 
  return servidor.get("/organizadores/competicoes/areas"); 
}