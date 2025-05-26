import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuarioLogado from "./rotas-usuario-logado";
import LogarUsuario from "../páginas/usuário/logar-usuario";
import CadastrarUsuario from "../páginas/usuário/cadastrar-usuario";
import PaginaInicial from "../páginas/usuário/página-inicial";
import CadastrarOrganizador from "../páginas/organizador/cadastrar-organizador";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarParticipante from "../páginas/participante/cadastrar-participante";
import { ProvedorOrganizador } from "../contextos/contexto-organizador";
import { ProvedorParticipante } from "../contextos/contexto-participante";
import RotasOrganizador from "./rotas-organizador";
import RotasParticipante from "./rotas-participante";
import AdministrarCompeticoes from "../páginas/organizador/administrar-competicoes";
import CadastrarCompeticao from "../páginas/organizador/cadastrar-competicao";
import AdministrarInscricoes from "../páginas/participante/administrar-inscricoes";
import CadastrarInscricao from "../páginas/participante/cadastrar-inscricao";
import PesquisarCompeticoes from "../páginas/participante/pesquisar-competicoes";
import ConsultarCompeticao from "../páginas/participante/consultar-competicao";

export default function RotasAplicacao() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuario />} path="/" />
        <Route element={<CadastrarUsuario />} path="criar-usuario" />
        <Route element={<RecuperarAcesso />} path="recuperar-acesso" />
        <Route element={<RotasUsuarioLogado />}>
          <Route element={<PaginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuario />} path="atualizar-usuario" />

          <Route
            element={
              <ProvedorOrganizador>
                <RotasOrganizador />
              </ProvedorOrganizador>
            }
          >
            <Route
              element={<CadastrarOrganizador />}
              path="cadastrar-organizador"
            />
            <Route
              element={<AdministrarCompeticoes />}
              path="administrar-competicoes"
            />
            <Route
              element={<CadastrarCompeticao />}
              path="cadastrar-competicao"
            />
          </Route>
          <Route
            element={
              <ProvedorParticipante>
                <RotasParticipante />
              </ProvedorParticipante>
            }
          >
            <Route
              element={<CadastrarParticipante />}
              path="cadastrar-participante"
            />
            <Route
              element={<AdministrarInscricoes />}
              path="administrar-inscricoes"
            />
            <Route
              element={<CadastrarInscricao />}
              path="cadastrar-inscricao"
            />
            <Route
              element={<PesquisarCompeticoes />}
              path="pesquisar-competicoes"
            />
            <Route
              element={<ConsultarCompeticao />}
              path="consultar-competicao"
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}