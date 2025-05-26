import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoParticipante from "../../contextos/contexto-participante";
import {
  servicoCadastrarInscricao,
  servicoRemoverInscricao,
} from "../../serviços/servicos-participante";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios, // correto
} from "../../utilitários/validações";
import {
  estilizarBotao,
  estilizarBotaoRetornar,
  estilizarBotaoRemover,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarInputTextarea,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarInscricao() {
  const referenciaToast = useRef(null);
  const { usuarioLogado } = useContext(ContextoUsuario);
  const {
    inscricaoConsultada,
    setInscricaoConsultada,
    competicaoSelecionadaParaInscricao,
    setCompeticaoSelecionadaParaInscricao
  } = useContext(ContextoParticipante);
  const navegar = useNavigate();

  const [dados, setDados] = useState({
    id_competicao: competicaoSelecionadaParaInscricao?.id || inscricaoConsultada?.competicao?.id || "",
    precisa_financiamento: inscricaoConsultada?.precisa_financiamento || false,
    motivacao: inscricaoConsultada?.motivacao || "",
    data_inscricao: inscricaoConsultada?.data_inscricao || new Date().toISOString().split('T')[0],
  });
  const [erros, setErros] = useState({});

  useEffect(() => {
  if (competicaoSelecionadaParaInscricao?.id) {
    setDados(d => ({ ...d, id_competicao: competicaoSelecionadaParaInscricao.id }));
  }
}, [inscricaoConsultada, competicaoSelecionadaParaInscricao, setCompeticaoSelecionadaParaInscricao]);

  useEffect(() => {
    if (inscricaoConsultada && inscricaoConsultada.id) {
      setDados({
        id_competicao: inscricaoConsultada.competicao?.id || "",
        precisa_financiamento: inscricaoConsultada.precisa_financiamento || false,
        motivacao: inscricaoConsultada.motivacao || "",
        data_inscricao: inscricaoConsultada.data_inscricao || new Date().toISOString().split('T')[0],
      });
      // Se estamos consultando uma inscrição, a competição selecionada DEVE ser a da inscrição.
      setCompeticaoSelecionadaParaInscricao(inscricaoConsultada.competicao || null);
    } else {
      // Se é uma nova inscrição, usa a competição que pode ter vindo da pesquisa.
      setDados({
        id_competicao: competicaoSelecionadaParaInscricao?.id || "",
        precisa_financiamento: false,
        motivacao: "",
        data_inscricao: new Date().toISOString().split('T')[0],
      });
    }
  }, [inscricaoConsultada, competicaoSelecionadaParaInscricao, setCompeticaoSelecionadaParaInscricao]); // <-- ADICIONADO AQUI


  function alterarEstado(event) {
    const { name, value, type, checked } = event.target;
    setDados((prevDados) => ({
      ...prevDados,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validarCampos() {
    const { motivacao, data_inscricao, id_competicao } = dados;
    let errosCamposObrigatoriosValidacao = validarCamposObrigatórios({
        motivacao,
        data_inscricao,
        id_competicao: id_competicao ? String(id_competicao) : ""
    });
    if (!id_competicao) {
        errosCamposObrigatoriosValidacao.id_competicao = "Selecione uma competição.";
    }
    setErros(errosCamposObrigatoriosValidacao);
    return checarListaVazia(errosCamposObrigatoriosValidacao);
  }

  function competicaoLabel() {
    if (inscricaoConsultada?.competicao?.nome || competicaoSelecionadaParaInscricao?.nome) {
      return "Competição Selecionada*:";
    } else {
      return "Selecione uma Competição*:";
    }
  }

  function pesquisarCompeticoes() {
    if (inscricaoConsultada?.id) {
        setInscricaoConsultada(dados);
    }
    navegar("/pesquisar-competicoes");
  }

  function retornarAdministrarInscricoes() {
    setInscricaoConsultada(null);
    setCompeticaoSelecionadaParaInscricao(null);
    navegar("/administrar-inscricoes");
  }

  async function cadastrarInscricao() {
    if (validarCampos()) {
      try {
        await servicoCadastrarInscricao({ ...dados, cpf: usuarioLogado.cpf });
        mostrarToast(
          referenciaToast,
          "Inscrição cadastrada com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao cadastrar inscrição.", "erro");
      }
    }
  }

  async function removerInscricao() {
    try {
      await servicoRemoverInscricao(inscricaoConsultada.id);
      mostrarToast(
        referenciaToast,
        "Inscrição removida com sucesso!",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao remover inscrição.", "erro");
    }
  }

  function BotoesAcoes() {
    if (inscricaoConsultada && inscricaoConsultada.id) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotaoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarInscricoes}
          />
          <Button
            className={estilizarBotaoRemover()}
            label="Remover Inscrição"
            onClick={removerInscricao}
          />
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotaoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarInscricoes}
          />
          <Button
            className={estilizarBotao()}
            label="Cadastrar"
            onClick={cadastrarInscricao}
            disabled={!dados.id_competicao}
          />
        </div>
      );
    }
  }

  function tituloFormulario() {
    return (inscricaoConsultada && inscricaoConsultada.id) ? "Detalhes da Inscrição" : "Nova Inscrição em Competição";
  }

  function CompeticaoInputText() {
    const nomeCompeticao = competicaoSelecionadaParaInscricao?.nome || inscricaoConsultada?.competicao?.nome;
    if (nomeCompeticao) {
      return (
        <InputText
          name="nome_competicao"
          className={estilizarInputText(erros.id_competicao, "input400", usuarioLogado.cor_tema)}
          value={nomeCompeticao}
          disabled
        />
      );
    }
    return null;
  }

  function BotaoSelecionarCompeticao() {
    if (!(inscricaoConsultada && inscricaoConsultada.id)) {
      return (
        <Button
          className={estilizarBotao(usuarioLogado.cor_tema)}
          label={dados.id_competicao ? "Substituir" : "Selecionar"}
          onClick={pesquisarCompeticoes}
        />
      );
    }
    return null;
  }

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referenciaToast}
        onHide={retornarAdministrarInscricoes}
        position="bottom-center"
      />
      <Card
        title={tituloFormulario()}
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            {competicaoLabel()}
          </label>
          <BotaoSelecionarCompeticao />
          <CompeticaoInputText />
          <MostrarMensagemErro mensagem={erros.id_competicao} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Data da Inscrição*:
          </label>
          <InputText
            name="data_inscricao"
            type="date"
            value={dados.data_inscricao}
            className={estilizarInputText(erros.data_inscricao, null, usuarioLogado.cor_tema)}
            onChange={alterarEstado}
            disabled={!!(inscricaoConsultada && inscricaoConsultada.id)}
          />
          <MostrarMensagemErro mensagem={erros.data_inscricao} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Precisa de Financiamento:
          </label>
          <Checkbox
            name="precisa_financiamento"
            checked={dados.precisa_financiamento}
            className={estilizarCheckbox(erros.precisa_financiamento)}
            onChange={alterarEstado}
            disabled={!!(inscricaoConsultada && inscricaoConsultada.id)}
          />
          <MostrarMensagemErro mensagem={erros.precisa_financiamento} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Motivação*:
          </label>
          <InputTextarea
            name="motivacao"
            value={dados.motivacao}
            className={estilizarInputTextarea(erros.motivacao, usuarioLogado.cor_tema)}
            onChange={alterarEstado}
            autoResize
            rows={3}
            cols={40}
            disabled={!!(inscricaoConsultada && inscricaoConsultada.id)}
          />
          <MostrarMensagemErro mensagem={erros.motivacao} />
        </div>
        <Divider className={estilizarDivider(usuarioLogado.cor_tema)} />
        <BotoesAcoes />
      </Card>
    </div>
  );
}