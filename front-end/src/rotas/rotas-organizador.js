import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ContextoUsuario from "../contextos/contexto-usuario";

export default function RotasOrganizador() {
  const { usuarioLogado } = useContext(ContextoUsuario);
  if (usuarioLogado.perfil === "organizador") return <Outlet />;
  else return <Navigate to="/" />;
}