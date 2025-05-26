import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoLogarUsuario } from "../../serviços/servicos-usuario";
import mostrarToast from "../../utilitários/mostrar-toast";
import { CPF_MASCARA } from "../../utilitários/máscaras";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  TAMANHOS,
  estilizarBotao,
  estilizarCard,
  estilizarDivCampo,
  estilizarFlex,
  estilizarInputMask,
  estilizarLabel,
  estilizarLink,
  estilizarLogo,
  estilizarPasswordInput,
  estilizarPasswordTextInputBorder,
  estilizarPaginaUnica,
} from "../../utilitários/estilos";

export default function LogarUsuario() {
  const referenciaToast = useRef(null);
  const { setUsuarioLogado } = useContext(ContextoUsuario);
  const [dados, setDados] = useState({ nome_login: "", senha: "" });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();

  function validarCampos() {
    const errosValidacao = validarCamposObrigatórios(dados);
    setErros(errosValidacao);
    return checarListaVazia(errosValidacao);
  }

  async function logarUsuario() {
    if (validarCampos()) {
      try {
        const response = await servicoLogarUsuario(dados);
        setUsuarioLogado({
          ...response.data?.usuarioLogado,
          cpf: dados.nome_login, // Mantido para consistência com o backend
          cadastrado: true, // Assumindo que o login bem-sucedido implica cadastro completo
        });
        navegar("/pagina-inicial");
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao tentar logar", "error");
      }
    }
  }

  function alterarEstado(event) {
    const { name, value } = event.target;
    setDados({ ...dados, [name]: value });
  }

  return (
    <div className={estilizarPaginaUnica()}>
      <Toast ref={referenciaToast} position="bottom-center" />
      <h1 className={estilizarLogo()}>Plataforma de Gestão de Competições de Jogos</h1>
      <Card title="Login" className={estilizarCard()}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Usuário</label>
          <InputMask
            name="nome_login"
            size={TAMANHOS.CPF}
            className={estilizarInputMask(erros.nome_login)}
            autoClear
            mask={CPF_MASCARA}
            value={dados.nome_login}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.nome_login} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Senha</label>
          <Password
            name="senha"
            inputClassName={estilizarPasswordTextInputBorder(erros.senha)}
            className={estilizarPasswordInput(erros.senha)}
            size={TAMANHOS.SENHA}
            value={dados.senha}
            feedback={false}
            toggleMask
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.senha} />
        </div>
        <div className={estilizarFlex("center")}>
          <Button
            className={estilizarBotao()}
            label="Login"
            onClick={logarUsuario}
          />
          <Link className={estilizarLink()} to="/recuperar-acesso">
            Recuperar Acesso
          </Link>
          <Link className={estilizarLink()} to="/criar-usuario">
            Cadastrar Usuário
          </Link>
        </div>
      </Card>
    </div>
  );
}