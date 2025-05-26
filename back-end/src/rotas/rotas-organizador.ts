import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilOrganizador from "../middlewares/verificar-perfil-organizador"; // Middleware adaptado
import ServicosOrganizador from "../serviços/servicos-organizador"; // Serviço adaptado
import verificarErroConteudoToken from "../middlewares/verificar-erro-conteudo-token";

const RotasOrganizador = Router(); // Variável renomeada
export default RotasOrganizador;

// Rotas para Organizador (anteriormente Arqueólogo)
RotasOrganizador.post("/", ServicosOrganizador.cadastrarOrganizador); // Serviço e método adaptados
RotasOrganizador.get(
  "/:cpf",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.buscarOrganizador // Serviço e método adaptados
);
RotasOrganizador.patch(
  "/",
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.atualizarOrganizador // Serviço e método adaptados
);

// Rotas para Competição (anteriormente SitioArqueologico)
RotasOrganizador.post(
  "/competições", // Endpoint adaptado para 'competições' com acento
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.cadastrarCompetição // Método adaptado com acento
);
RotasOrganizador.patch(
  "/competições", // Endpoint adaptado
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.alterarCompetição // Método adaptado com acento
);
RotasOrganizador.delete(
  "/competições/:id", // Endpoint adaptado
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.removerCompetição // Método adaptado com acento
);
RotasOrganizador.get(
  "/competições/organizador/:cpf", // Endpoint e parâmetro adaptados
  verificarToken,
  verificarPerfilOrganizador,
  verificarErroConteudoToken, // Mantido, verifica consistência do token com o CPF
  ServicosOrganizador.buscarCompetiçõesDoOrganizador // Método adaptado com acento
);
RotasOrganizador.get(
  "/competições/areas", // Endpoint adaptado de 'tipo-arte' para 'areas'
  verificarToken,
  verificarPerfilOrganizador,
  ServicosOrganizador.buscarAreasDasCompetições // Método adaptado
);