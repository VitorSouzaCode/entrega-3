import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ModalRecuperarAcesso from "../../componentes/modais/modal-recuperar-acesso";
import mostrarToast from "../../utilitários/mostrar-toast";
import { CPF_MASCARA } from "../../utilitários/máscaras";
import {
  servicoBuscarQuestaoSeguranca,
  servicoVerificarRespostaCorreta,
} from "../../serviços/servicos-usuario";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
  validarCpf,
} from "../../utilitários/validações";
import {
  TAMANHOS,
  estilizarBotao,
  estilizarCard,
  estilizarDialog,
  estilizarDivCampo,
  estilizarFlex,
  estilizarFooterDialog,
  estilizarInputMask,
  estilizarInputText,
  estilizarLabel,
  estilizarLink,
  estilizarParagrafo, // Renomeado para estilizarParagrafo
} from "../../utilitários/estilos";

export default function RecuperarAcesso() {
  const referenciaToast = useRef(null);
  const { setCpfVerificado, setNovaSenha, setTokenRecuperacao } =
    useContext(ContextoUsuario);
  const [dados, setDados] = useState({
    cpf: "",
    questão: "", // Mantido como 'questão'
    resposta: "", // Mantido como 'resposta'
    token: "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [desabilitar, setDesabilitar] = useState(true);
  const [timer, setTimer] = useState(null);
  const [erros, setErros] = useState({});

  function alterarEstado(event) {
    const { name, value } = event.target;
    setDados((prevDados) => ({ ...prevDados, [name]: value }));
  }

  function validarCamposResposta() {
    let errosCamposObrigatorios = validarCamposObrigatórios({
      resposta: dados.resposta,
    });
    setErros(errosCamposObrigatorios);
    return checarListaVazia(errosCamposObrigatorios);
  }

  function esconderModal() {
    setNovaSenha({}); // Limpar dados de nova senha ao fechar
    setMostrarModal(false);
  }

  async function buscarQuestaoDeSeguranca(event) { // Nome da função com acento
    const cpf = event.target.value;
    setDados({ ...dados, cpf, questão: "", resposta: "" }); // Limpar questão e resposta antigas
    setDesabilitar(true); // Desabilitar campos de resposta e botão confirmar
    clearTimeout(timer);

    if (validarCpf(cpf)) { // Validar CPF antes de prosseguir
      const novoTimer = setTimeout(async () => {
        try {
          const response = await servicoBuscarQuestaoSeguranca(cpf);
          setDesabilitar(false);
          setDados((prevDados) => ({ ...prevDados, questão: response.data.questão }));
        } catch (error) {
          mostrarToast(referenciaToast, error.response?.data?.mensagem || "Erro ao buscar questão.", "erro");
          setDados((prevDados) => ({ ...prevDados, questão: "" }));
        }
      }, 1500);
      setTimer(novoTimer);
    } else if (cpf.replace(/[^\d]/g, "").length === 11) { // Se o CPF está completo mas inválido
        mostrarToast(referenciaToast, "CPF inválido.", "erro");
    }
  }

  async function verificarResposta() { // Nome da função com acento
    try {
      const { cpf, resposta } = dados;
      const response = await servicoVerificarRespostaCorreta({
        cpf,
        resposta,
      });
      setCpfVerificado(cpf);
      setTokenRecuperacao(response.data.token);
      setMostrarModal(true);
    } catch (error) {
      mostrarToast(referenciaToast, error.response?.data?.mensagem || "Erro ao verificar resposta.", "erro");
    }
  }

  async function validarConfirmarRecuperacaoAcesso() {
    if (validarCamposResposta()) {
      await verificarResposta();
    }
  }

  return (
    <div className={estilizarFlex("center")}>
      <Toast ref={referenciaToast} position="bottom-center" />
      <Dialog
        visible={mostrarModal}
        className={estilizarDialog()}
        header="Digite sua nova senha e confirme"
        onHide={esconderModal}
        footer={<div className={estilizarFooterDialog()}></div>}
      >
        <ModalRecuperarAcesso />
      </Dialog>
      <Card title="Recuperar Acesso de Usuário" className={estilizarCard()}>
        <p className={estilizarParagrafo()}>
          Para recuperar o acesso à sua conta, forneça as informações abaixo:
        </p>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>CPF*:</label>
          <InputMask
            name="cpf"
            className={estilizarInputMask(erros.cpf)}
            size={TAMANHOS.CPF}
            mask={CPF_MASCARA}
            autoClear
            value={dados.cpf}
            onChange={buscarQuestaoDeSeguranca}
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Questão de Segurança*:</label>
          <InputText
            name="questão"
            className={estilizarInputText(erros.questão, "input400")}
            value={dados.questão}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel()}>Resposta*:</label>
          <InputText
            name="resposta"
            className={estilizarInputText(erros.resposta, "input300")} // Ajustado para input300 conforme global.css
            disabled={desabilitar}
            value={dados.resposta}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.resposta} />
        </div>
        <div className={estilizarFlex("center")}>
          <Button
            className={estilizarBotao()}
            label="Confirmar"
            disabled={desabilitar}
            onClick={validarConfirmarRecuperacaoAcesso}
          />
          <Link to="/" className={estilizarLink()}>
            Voltar ao Login
          </Link>
        </div>
      </Card>
    </div>
  );
}