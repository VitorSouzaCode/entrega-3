import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import ServicosParticipante from "../serviços/servicos-participante"; // Serviço adaptado
import verificarPerfilParticipante from "../middlewares/verificar-perfil-participante"; // Middleware adaptado

const RotasParticipante = Router(); // Variável renomeada
export default RotasParticipante;

// Rotas para Participante (anteriormente GerenteEmpresaTurismo)
RotasParticipante.post(
  "/",
  ServicosParticipante.cadastrarParticipante // Método adaptado
);
RotasParticipante.patch(
  "/",
  verificarToken,
  verificarPerfilParticipante, // Middleware adaptado
  ServicosParticipante.atualizarParticipante // Método adaptado
);
RotasParticipante.get(
  "/:cpf",
  verificarToken,
  verificarPerfilParticipante, // Middleware adaptado
  ServicosParticipante.buscarParticipante // Método adaptado
);

// Rotas para Inscrição (anteriormente Visitação)
RotasParticipante.post(
  "/inscricoes", // Endpoint adaptado para 'inscricoes' com acento
  verificarToken,
  verificarPerfilParticipante, // Middleware adaptado
  ServicosParticipante.cadastrarInscricao // Método adaptado com acento
);
RotasParticipante.delete(
  "/inscricoes/:id", // Endpoint adaptado
  verificarToken,
  verificarPerfilParticipante, // Middleware adaptado
  ServicosParticipante.removerInscricao // Método adaptado com acento
);
RotasParticipante.get(
  "/inscricoes/participante/:cpf", // Endpoint e parâmetro adaptados
  verificarToken,
  verificarPerfilParticipante, // Middleware adaptado
  ServicosParticipante.buscarInscricoesDoParticipante // Método adaptado com acento
);
RotasParticipante.get(
  "/competicoes/disponiveis", // Endpoint adaptado de 'visitacoes/sitios-arqueologicos'
  verificarToken,
  verificarPerfilParticipante, // Middleware adaptado
  ServicosParticipante.buscarCompeticoesDisponiveis // Método adaptado (nome sugere buscar competições abertas para inscrição)
);