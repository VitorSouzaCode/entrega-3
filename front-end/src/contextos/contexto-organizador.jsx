import { createContext, useState } from "react";

const ContextoOrganizador = createContext(); 
export default ContextoOrganizador; 

export function ProvedorOrganizador({ children }) { 
  
  const [competicaoConsultada, setCompeticaoConsultada] = useState({}); 
  return (
    <ContextoOrganizador.Provider 
      value={{ competicaoConsultada, setCompeticaoConsultada }} 
    >
      {children}
    </ContextoOrganizador.Provider>
  );
}