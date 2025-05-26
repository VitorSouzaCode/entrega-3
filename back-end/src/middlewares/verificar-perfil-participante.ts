import { Perfil } from "../entidades/usuario"; 

export default function verificarPerfilParticipante( 
  request,
  response,
  next
) {
  if (request.perfil === Perfil.PARTICIPANTE) return next(); 
  else return response.status(401).json({ erro: "Acesso não autorizado." });
}