import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import ServicosParticipante from "../serviços/servicos-participante";
import verificarPerfilParticipante from "../middlewares/verificar-perfil-participante";

const RotasParticipante = Router();
export default RotasParticipante;

RotasParticipante.post(
  "/",
  ServicosParticipante.cadastrarParticipante
);
RotasParticipante.patch(
  "/",
  verificarToken,
  verificarPerfilParticipante,
  ServicosParticipante.atualizarParticipante
);
RotasParticipante.get(
  "/:cpf",
  verificarToken,
  verificarPerfilParticipante,
  ServicosParticipante.buscarParticipante
);

RotasParticipante.post(
  "/inscricoes",
  verificarToken,
  verificarPerfilParticipante,
  ServicosParticipante.cadastrarInscricao
);
RotasParticipante.delete(
  "/inscricoes/:id",
  verificarToken,
  verificarPerfilParticipante,
  ServicosParticipante.removerInscricao
);
RotasParticipante.get(
  "/inscricoes/participante/:cpf",
  verificarToken,
  verificarPerfilParticipante,
  ServicosParticipante.buscarInscricoesDoParticipante
);
RotasParticipante.get(
  "/competicoes/disponiveis",
  verificarToken,
  verificarPerfilParticipante,
  ServicosParticipante.buscarCompeticoesDisponiveis
);