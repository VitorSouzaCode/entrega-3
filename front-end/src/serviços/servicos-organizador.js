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
  return servidor.post("/organizadores/competições", competicao); 
}
export function servicoAlterarCompeticao(competicao) { 
  return servidor.patch("/organizadores/competições", competicao); 
}
export function servicoRemoverCompeticao(id) { // Adaptado
  return servidor.delete(`/organizadores/competições/${id}`); 
}
export function servicoBuscarCompeticoesDoOrganizador(cpf) { 
  return servidor.get(`/organizadores/competições/organizador/${cpf}`); 
}
export function servicoBuscarAreasDasCompeticoes() { 
  return servidor.get("/organizadores/competições/areas"); 
}