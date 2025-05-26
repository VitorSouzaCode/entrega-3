import servidor from "./servidor";

export function servicoCadastrarParticipante(participante) { 
  return servidor.post("/participantes", participante); 
}
export function servicoAtualizarParticipante(participante) { 
  return servidor.patch("/participantes", participante); 
}
export function servicoBuscarParticipante(cpf) {
  return servidor.get(`/participantes/${cpf}`); 
}

export function servicoCadastrarInscricao(inscricao) { 
  return servidor.post("/participantes/inscricoes", inscricao); 
}
export function servicoRemoverInscricao(id) { 
  return servidor.delete(`/participantes/inscricoes/${id}`); 
}
export function servicoBuscarInscricoesDoParticipante(cpf) { 
  return servidor.get(`/participantes/inscricoes/participante/${cpf}`); 
}
export function servicoBuscarCompeticoesDisponiveis() { 
  return servidor.get("/participantes/competicoes/disponiveis"); 
}