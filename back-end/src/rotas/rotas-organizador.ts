import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilOrganizador from "../middlewares/verificar-perfil-organizador";
import ServicosOrganizador from "../serviços/servicos-organizador";
import verificarErroConteudoToken from "../middlewares/verificar-erro-conteudo-token";


const RotasOrganizador = Router();
export default RotasOrganizador;

RotasOrganizador.post(
  "/",
  ServicosOrganizador.cadastrarOrganizador
);

RotasOrganizador.patch(
  "/",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.atualizarOrganizador
);

RotasOrganizador.get(
  "/:cpf",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.buscarOrganizador
);


RotasOrganizador.post(
  "/competicoes",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.cadastrarCompetição
);

RotasOrganizador.patch(
  "/competicoes",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.alterarCompetição
);

RotasOrganizador.delete(
  "/competicoes/:id",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.removerCompetição
);

RotasOrganizador.get(
  "/competicoes/organizador/:cpf", 
  verificarToken, 
  verificarPerfilOrganizador,
  ServicosOrganizador.buscarCompetiçõesDoOrganizador
);

RotasOrganizador.get(
  "/competicoes/areas",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.buscarAreasDasCompetições
);