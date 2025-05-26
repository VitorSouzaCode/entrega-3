import { createContext, useState } from "react";

const ContextoUsuario = createContext(); 
export default ContextoUsuario;

export function ProvedorUsuario({ children }) { 
  const [usuarioLogado, setUsuarioLogado] = useState(null); 
  const [confirmacaoUsuario, setConfirmacaoUsuario] = useState(null); 
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [cpfVerificado, setCpfVerificado] = useState(null);
  const [novaSenha, setNovaSenha] = useState({});
  const [tokenRecuperacao, setTokenRecuperacao] = useState(null); 

  return (
    <ContextoUsuario.Provider 
      value={{
        setUsuarioLogado, 
        confirmacaoUsuario, 
        setConfirmacaoUsuario, 
        mostrarModalConfirmacao,
        setMostrarModalConfirmacao,
        cpfVerificado,
        setCpfVerificado,
        novaSenha,
        setNovaSenha,
        tokenRecuperacao, 
        setTokenRecuperacao, 
        usuarioLogado, 
      }}
    >
      {children}
    </ContextoUsuario.Provider>
  );
}