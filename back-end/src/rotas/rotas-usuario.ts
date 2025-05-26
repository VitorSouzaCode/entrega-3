import { Router } from "express";
import ServicosUsuario from "../serviços/servicos-usuario"; // Nome da classe de serviço adaptado
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteudo-token";

const RotasUsuario = Router(); // Mantido como RotasUsuario para consistência com o original
export default RotasUsuario;

RotasUsuario.post("/login", ServicosUsuario.logarUsuario);
RotasUsuario.post("/verificar-cpf/:cpf", ServicosUsuario.verificarCpfExistente);
RotasUsuario.patch(
  "/alterar-usuario",
  verificarToken,
  ServicosUsuario.alterarUsuario
);
RotasUsuario.delete(
  "/:cpf",
  verificarToken,
  verificarErroConteúdoToken,
  ServicosUsuario.removerUsuario
);
// Os atributos 'questão' e 'resposta' foram mantidos na entidade Usuario,
// então os endpoints e chamadas de serviço para eles permanecem os mesmos.
RotasUsuario.get("/questao/:cpf", ServicosUsuario.buscarQuestaoSeguranca);
RotasUsuario.post(
  "/verificar-resposta",
  ServicosUsuario.verificarRespostaCorreta
);