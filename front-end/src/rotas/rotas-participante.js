import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ContextoUsuario from "../contextos/contexto-usuario";

export default function RotasParticipante() {
  const { usuarioLogado } = useContext(ContextoUsuario);
  if (usuarioLogado.perfil === "participante") return <Outlet />;
  else return <Navigate to="/" />;
}