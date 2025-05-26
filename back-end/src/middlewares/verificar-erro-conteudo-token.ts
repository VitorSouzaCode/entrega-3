import md5 from "md5";
import Usuário from "../entidades/usuario";
export default async function verificarErroConteúdoToken(
  request,
  response,
  next
) {
  console.log(`[verificarErroConteudoToken] CPF do parâmetro: ${request.params.cpf}`);

  const cpf_encriptado = md5(request.params.cpf || request.body.cpf);
  console.log(`[verificarErroConteudoToken] CPF encriptado: ${cpf_encriptado}`);

  const usuário_token = await Usuário.findOne({
    where: { email: request.email_token },
  });
  const usuario = await Usuário.findOne({ where: { cpf: cpf_encriptado } });
  console.log(`[verificarErroConteudoToken] Usuario do Token: ${JSON.stringify(usuário_token)}`);
console.log(`[verificarErroConteudoToken] Usuario do CPF: ${JSON.stringify(usuario)}`);

  if (usuário_token.email !== usuario.email)
    return response.status(401).json("Acesso não autorizado.");
  next();
}
