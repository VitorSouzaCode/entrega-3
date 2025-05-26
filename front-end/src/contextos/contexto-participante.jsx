import { createContext, useState } from "react";

const ContextoParticipante = createContext();
export default ContextoParticipante;

export function ProvedorParticipante({ children }) {
  const [inscricaoConsultada, setInscricaoConsultada] = useState({});
  const [competicaoConsultadaParaInscricao, setCompeticaoConsultadaParaInscricao] = useState({});
  const [competicaoSelecionadaParaInscricao, setCompeticaoSelecionadaParaInscricao] = useState({});
  const [competicaoDaInscricaoConsultada, setCompeticaoDaInscricaoConsultada] = useState({});

  return (
    <ContextoParticipante.Provider
      value={{
        inscricaoConsultada,
        setInscricaoConsultada,
        competicaoConsultadaParaInscricao,
        setCompeticaoConsultadaParaInscricao,
        competicaoSelecionadaParaInscricao,
        setCompeticaoSelecionadaParaInscricao,
        competicaoDaInscricaoConsultada,
        setCompeticaoDaInscricaoConsultada,
      }}
    >
      {children}
    </ContextoParticipante.Provider>
  );
}