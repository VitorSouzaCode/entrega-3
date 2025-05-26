import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ModalConfirmacaoUsuario from "../../componentes/modais/modal-confirmacao-usuario";
import mostrarToast from "../../utilitários/mostrar-toast";
import { CPF_MASCARA } from "../../utilitários/máscaras";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCampoEmail,
  validarCamposObrigatórios,
  validarConfirmacaoSenha,
  validarConfirmacaoSenhaOpcional,
  validarRecuperacaoAcessoOpcional,
} from "../../utilitários/validações";
import {
  TAMANHOS,
  TEMA_PADRAO,
  estilizarBotao,
  estilizarBotaoRemover,
  estilizarCard,
  estilizarDialog,
  estilizarDivBotoesAcao,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarFooterDialog,
  estilizarInputMask,
  estilizarInputText,
  estilizarLabel,
  estilizarLink,
  estilizarPasswordInput,
  estilizarPasswordTextInputBorder,
  estilizarSubtitulo,
  opcoesCores,
} from "../../utilitários/estilos";
import { servicoVerificarCpfExistente  } from "../../serviços/servicos-usuario";

export default function CadastrarUsuario() {
  const referenciaToast = useRef(null);
  const navegar = useNavigate();
  const {
    usuarioLogado,
    setUsuarioLogado,
    mostrarModalConfirmacao,
    setMostrarModalConfirmacao,
    setConfirmacaoUsuario,
  } = useContext(ContextoUsuario);

  const ehAtualizacao = !!usuarioLogado?.cpf;

  const [dados, setDados] = useState({
    cpf: usuarioLogado?.cpf || "",
    nome: usuarioLogado?.nome || "",
    perfil: usuarioLogado?.perfil || "", // Mantido 'perfil'
    email: usuarioLogado?.email || "",
    senha: "",
    confirmacao: "",
    questão: usuarioLogado?.questão || "", // Mantido 'questão'
    resposta: "", // Mantido 'resposta'
    cor_tema: usuarioLogado?.cor_tema || TEMA_PADRAO,
  });
  const [erros, setErros] = useState({});

  const opcoesPerfis = [
    { label: "Organizador", value: "organizador" },
    { label: "Participante", value: "participante" },
  ];

  useEffect(() => {
    if (ehAtualizacao && usuarioLogado) {
      setDados({
        cpf: usuarioLogado.cpf,
        nome: usuarioLogado.nome,
        perfil: usuarioLogado.perfil,
        email: usuarioLogado.email,
        senha: "",
        confirmacao: "",
        questão: usuarioLogado.questão,
        resposta: "",
        cor_tema: usuarioLogado.cor_tema || TEMA_PADRAO,
      });
    }
  }, [usuarioLogado, ehAtualizacao]);


  function alterarEstado(event) {
    const { name, value } = event.target;
    setDados((prevDados) => ({ ...prevDados, [name]: value }));
  }

  function validarCampos() {
    let todosErros = {};
    if (ehAtualizacao) {
      const { email, senha, confirmacao, questão, resposta } = dados;
      todosErros = {
        ...validarCamposObrigatórios ({ email }), 
        ...validarCampoEmail(email),
        ...validarConfirmacaoSenhaOpcional(senha, confirmacao),
        ...validarRecuperacaoAcessoOpcional(questão, resposta),
      };
    } else {
      const { perfil, cpf, nome, questão, resposta, senha, confirmacao, email } = dados;
      todosErros = {
        ...validarCamposObrigatórios({ perfil, cpf, nome, questão, resposta, senha, confirmacao, email,}),
        ...validarCampoEmail(email),
        ...validarConfirmacaoSenha(senha, confirmacao),
      };
    }
    setErros(todosErros);
    return checarListaVazia(todosErros);
  }

  function tituloFormulario() {
    return ehAtualizacao ? "Atualizar Dados Pessoais" : "Cadastrar Novo Usuário";
  }

  function textoRetorno() {
    return ehAtualizacao ? "Retornar para Página Inicial" : "Retornar para Login";
  }

  function linkRetorno() {
    return ehAtualizacao ? "/pagina-inicial" : "/";
  }

  function limparOcultarModal() {
    setConfirmacaoUsuario(null);
    setMostrarModalConfirmacao(false);
  }

  async function submeterFormulario(operacao) {
    if (validarCampos()) {
      if (operacao === "salvar" && !ehAtualizacao) {
        try {
          await servicoVerificarCpfExistente(dados.cpf);
          // Se não houver erro, o CPF não existe, então podemos mostrar o modal de confirmação
          setConfirmacaoUsuario({ ...dados, operacao });
          setMostrarModalConfirmacao(true);
        } catch (error) {
          mostrarToast(referenciaToast, error.response?.data?.erro || "CPF já cadastrado.", "erro");
        }
      } else { // Para 'alterar' ou 'remover'
        setConfirmacaoUsuario({ ...dados, operacao });
        setMostrarModalConfirmacao(true);
      }
    }
  }

  function ComandosConfirmacao() {
    if (ehAtualizacao) {
      return (
        <div className={estilizarDivBotoesAcao()}>
          <Button
            className={estilizarBotao(dados.cor_tema)}
            label="Alterar"
            onClick={() => submeterFormulario("alterar")}
          />
          <Button
            className={estilizarBotaoRemover(dados.cor_tema)}
            label="Remover"
            onClick={() => submeterFormulario("remover")}
          />
        </div>
      );
    } else {
      return (
        <Button
          className={estilizarBotao(dados.cor_tema)}
          label="Cadastrar"
          onClick={() => submeterFormulario("salvar")}
        />
      );
    }
  }

  return (
    <div className={estilizarFlex(ehAtualizacao ? "start" : "center")}>
      <Toast ref={referenciaToast} position="bottom-center" />
      <Dialog
        visible={mostrarModalConfirmacao}
        className={estilizarDialog()}
        header="Confirme seus dados"
        onHide={limparOcultarModal}
        closable={!ehAtualizacao} // Não pode fechar se for novo cadastro antes de confirmar
        footer={<div className={estilizarFooterDialog()}></div>}
      >
        <ModalConfirmacaoUsuario />
      </Dialog>
      <Card
        title={tituloFormulario()}
        className={estilizarCard(dados.cor_tema)}
      >
        {!ehAtualizacao && (
          <>
            <div className={estilizarDivCampo()}>
              <label className={estilizarLabel(dados.cor_tema)}>
                Tipo de Perfil*:
              </label>
              <Dropdown
                name="perfil"
                className={estilizarDropdown(erros.perfil, dados.cor_tema)}
                value={dados.perfil}
                options={opcoesPerfis}
                onChange={alterarEstado}
                placeholder="-- Selecione --"
              />
              <MostrarMensagemErro mensagem={erros.perfil} />
            </div>
            <Divider className={estilizarDivider(dados.cor_tema)} />
          </>
        )}

        <h2 className={estilizarSubtitulo(dados.cor_tema)}>Dados Pessoais</h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>CPF*:</label>
          <InputMask
            name="cpf"
            autoClear
            className={estilizarInputMask(erros.cpf, dados.cor_tema)}
            mask={CPF_MASCARA}
            size={TAMANHOS.CPF}
            value={dados.cpf}
            onChange={alterarEstado}
            disabled={ehAtualizacao}
          />
          <MostrarMensagemErro mensagem={erros.cpf} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Nome Completo*:
          </label>
          <InputText
            name="nome"
            className={estilizarInputText(erros.nome, "input400", dados.cor_tema)}
            value={dados.nome}
            onChange={alterarEstado}
            disabled={ehAtualizacao}
          />
          <MostrarMensagemErro mensagem={erros.nome} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>Email*:</label>
          <InputText
            name="email"
            className={estilizarInputText(erros.email, "input400", dados.cor_tema)}
            value={dados.email}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.email} />
        </div>

        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtitulo(dados.cor_tema)}>Dados de Login</h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            {ehAtualizacao ? "Nova Senha (opcional):" : "Senha*:"}
          </label>
          <Password
            name="senha"
            inputClassName={estilizarPasswordTextInputBorder(erros.senha, dados.cor_tema)}
            className={estilizarPasswordInput(erros.senha)}
            toggleMask
            value={dados.senha}
            onChange={alterarEstado}
            size={TAMANHOS.SENHA}
            promptLabel={ehAtualizacao ? "Digite a nova senha se desejar alterar" : "Digite uma senha"}
            weakLabel="Fraca" mediumLabel="Média" strongLabel="Forte"
            feedback={!ehAtualizacao}
            tooltip={ehAtualizacao ? "Será alterada somente se a senha e a confirmação forem informadas." : undefined}
          />
          <MostrarMensagemErro mensagem={erros.senha} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
             {ehAtualizacao ? "Confirmar Nova Senha:" : "Confirmar Senha*:"}
          </label>
          <Password
            name="confirmacao"
            className={estilizarPasswordInput(erros.confirmacao || erros.confirmacao_senha)}
            inputClassName={estilizarPasswordTextInputBorder(erros.confirmacao || erros.confirmacao_senha, dados.cor_tema)}
            toggleMask
            feedback={false}
            value={dados.confirmacao}
            onChange={alterarEstado}
            size={TAMANHOS.SENHA}
          />
          <MostrarMensagemErro mensagem={erros.confirmacao || erros.confirmacao_senha} />
        </div>

        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtitulo(dados.cor_tema)}>
          Recuperação da Conta
        </h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Questão de Segurança*:
          </label>
          <InputText
            name="questão"
            className={estilizarInputText(erros.questão, "input400", dados.cor_tema)}
            placeholder="Ex: Qual era o nome do seu primeiro pet?"
            value={dados.questão}
            onChange={alterarEstado}
            tooltip={ehAtualizacao ? "Se a resposta não for informada, a questão de segurança não será alterada." : undefined}
            tooltipOptions={{ position: "top" }}
          />
          <MostrarMensagemErro mensagem={erros.questão} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>Resposta*:</label>
          <InputText
            name="resposta"
            className={estilizarInputText(erros.resposta, "input400", dados.cor_tema)}
            value={dados.resposta}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.resposta} />
        </div>

        <Divider className={estilizarDivider(dados.cor_tema)} />
        <h2 className={estilizarSubtitulo(dados.cor_tema)}>Configurações</h2>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(dados.cor_tema)}>
            Cor do Tema*:
          </label>
          <Dropdown
            name="cor_tema"
            className={estilizarDropdown(erros.cor_tema, dados.cor_tema)}
            value={dados.cor_tema}
            options={opcoesCores}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.cor_tema} />
        </div>

        <ComandosConfirmacao />
        <div className={estilizarFlex("center")}>
          <Link to={linkRetorno()} className={estilizarLink(dados.cor_tema)}>
            {textoRetorno()}
          </Link>
        </div>
      </Card>
    </div>
  );
}