import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import {
  estilizarBotao,
  estilizarBotaoRemover,
  estilizarDivCampo,
  estilizarInlineFlex,
  estilizarLabel,
  estilizarModal,
} from "../../utilitários/estilos";
import {
  servicoAlterarUsuario,
  servicoRemoverUsuario,
} from "../../serviços/servicos-usuario";
import mostrarToast from "../../utilitários/mostrar-toast";
import formatarPerfil from "../../utilitários/formatar-perfil";


export default function ModalConfirmacaoUsuario() {
  const referenciaToast = useRef(null);
  const {
    setUsuarioLogado,
    confirmacaoUsuario,
    setConfirmacaoUsuario,
    setMostrarModalConfirmacao,
    usuarioLogado,
  } = useContext(ContextoUsuario);

  const dados = {
    cpf: confirmacaoUsuario?.cpf,
    perfil: confirmacaoUsuario?.perfil,
    nome: confirmacaoUsuario?.nome,
    senha: confirmacaoUsuario?.senha,
    email: confirmacaoUsuario?.email,
    questão: confirmacaoUsuario?.questão,
    resposta: confirmacaoUsuario?.resposta,
    cor_tema: confirmacaoUsuario?.cor_tema,
  };
  const [redirecionar, setRedirecionar] = useState(false);

  const navegar = useNavigate();

  function labelOperacao() {
    switch (confirmacaoUsuario?.operacao) {
      case "salvar":
        return "Salvar";
      case "alterar":
        return "Alterar";
      case "remover":
        return "Remover";
      default:
        return "";
    }
  }

  function fecharToast() {
    if (redirecionar) {
      setMostrarModalConfirmacao(false);
      setConfirmacaoUsuario({});
      if (confirmacaoUsuario?.operacao === "remover") { // Apenas remover zera o usuário logado
        setUsuarioLogado(null);
        navegar("/"); // Para remover, volta ao login
      } else {
         navegar("/pagina-inicial"); // Para salvar ou alterar, vai para a página inicial
      }
    }
  }

  function finalizarCadastro() {
    if (dados.perfil === "organizador") {
      setUsuarioLogado({ ...dados, cadastrado: false });
      setMostrarModalConfirmacao(false);
      navegar("/cadastrar-organizador");
    } else if (dados.perfil === "participante") {
      setUsuarioLogado({ ...dados, cadastrado: false });
      setMostrarModalConfirmacao(false);
      navegar("/cadastrar-participante");
    }
  }

  async function alterarUsuarioConfirmado(dadosAlterados) {
    try {
      const response = await servicoAlterarUsuario({
        ...dadosAlterados,
        cpf: usuarioLogado.cpf,
      });
      setUsuarioLogado({ ...usuarioLogado, ...response.data });
      setRedirecionar(true);
      mostrarToast(
        referenciaToast,
        "Dados alterados com sucesso! Redirecionando...",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referenciaToast, error.response.data.erro, "erro");
    }
  }

  async function removerUsuarioConfirmado() {
    try {
      await servicoRemoverUsuario(usuarioLogado.cpf);
      setRedirecionar(true);
      mostrarToast(
        referenciaToast,
        "Usuário removido com sucesso! Redirecionando ao Login.",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referenciaToast, error.response.data.erro, "erro");
    }
  }

  function executarOperacao() {
    switch (confirmacaoUsuario.operacao) {
      case "salvar":
        finalizarCadastro();
        break;
      case "alterar":
        alterarUsuarioConfirmado({
          email: dados.email,
          senha: dados.senha,
          questão: dados.questão,
          resposta: dados.resposta,
          cor_tema: dados.cor_tema,
        });
        break;
      case "remover":
        removerUsuarioConfirmado();
        break;
      default:
        break;
    }
  }

  function ocultar() {
    if (!redirecionar) {
      setConfirmacaoUsuario({});
      setMostrarModalConfirmacao(false);
    }
  }

  return (
    <div className={estilizarModal()}>
      <Toast
        ref={referenciaToast}
        onHide={fecharToast}
        position="bottom-center"
      />
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Tipo de Perfil:
        </label>
        <label>{formatarPerfil(dados.perfil)}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          CPF (Nome de Usuário):
        </label>
        <label>{dados.cpf}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Nome Completo:
        </label>
        <label>{dados.nome}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Email:
        </label>
        <label>{dados.email}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Questão de Segurança:
        </label>
        <label>{dados.questão}</label>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
          Resposta:
        </label>
        <label>{dados.resposta}</label>
      </div>
      <div className={estilizarInlineFlex()}>
        <Button
          label={labelOperacao()}
          onClick={executarOperacao}
          className={estilizarBotao(confirmacaoUsuario?.cor_tema)}
        />
        <Button
          label="Corrigir"
          onClick={ocultar}
          className={estilizarBotaoRemover(confirmacaoUsuario?.cor_tema)}
        />
      </div>
    </div>
  );
}