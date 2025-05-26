import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { TELEFONE_MASCARA } from "../../utilitários/máscaras";
import {
  servicoCadastrarParticipante,
  servicoAtualizarParticipante,
  servicoBuscarParticipante,
} from "../../serviços/servicos-participante";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  TAMANHOS,
  estilizarBotao,
  estilizarBotaoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputMask,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarParticipante() {
  const referenciaToast = useRef(null);
  const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuario);
  const navegar = useNavigate();

  const [dados, setDados] = useState({
    nivel: "",
    ano_ingresso: "",
    data_nascimento: "",
    telefone: "",
  });
  const [erros, setErros] = useState({});
  const [cpfJaCadastradoComoParticipante, setCpfJaCadastradoComoParticipante] = useState(false);

  const opcoesNivel = [
    { label: "Amador", value: "amador" },
    { label: "Profissional", value: "profissional" },
  ];

  function alterarEstado(event) {
    const { name, value } = event.target;
    setDados((prevDados) => ({ ...prevDados, [name]: value }));
  }

  function validarCampos() {
    const errosValidacao = validarCamposObrigatórios({
        nivel: dados.nivel,
        ano_ingresso: dados.ano_ingresso,
        data_nascimento: dados.data_nascimento,
        telefone: dados.telefone,
    });
    setErros(errosValidacao);
    return checarListaVazia(errosValidacao);
  }

  function tituloFormulario() {
    return usuarioLogado?.cadastrado ? "Alterar Dados de Participante" : "Completar Cadastro de Participante";
  }

  async function cadastrarParticipante() {
    if (validarCampos()) {
      try {
        const response = await servicoCadastrarParticipante({
          ...dados,
          usuario_info: usuarioLogado,
        });
        if (response.data) {
          setUsuarioLogado((usuario) => ({
            ...usuario,
            status: response.data.status,
            token: response.data.token,
            cadastrado: true,
          }));
        }
        mostrarToast(
          referenciaToast,
          "Dados de participante cadastrados com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfJaCadastradoComoParticipante(true);
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao cadastrar participante.", "erro");
      }
    }
  }

  async function atualizarParticipante() {
    if (validarCampos()) {
      try {
        await servicoAtualizarParticipante({
          ...dados,
          cpf: usuarioLogado.cpf,
        });
        mostrarToast(
          referenciaToast,
          "Dados de participante atualizados com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao atualizar dados de participante.", "erro");
      }
    }
  }

  function labelBotaoSalvar() {
    return usuarioLogado?.cadastrado ? "Alterar" : "Cadastrar";
  }

  function acaoBotaoSalvar() {
    if (usuarioLogado?.cadastrado) {
      atualizarParticipante();
    } else {
      cadastrarParticipante();
    }
  }

  function redirecionar() {
    if (cpfJaCadastradoComoParticipante && !usuarioLogado?.cadastrado) {
      setUsuarioLogado(null);
      navegar("/criar-usuario");
    } else {
      navegar("/pagina-inicial");
    }
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosParticipante() {
      if (usuarioLogado?.cpf && usuarioLogado?.cadastrado) {
        try {
          const response = await servicoBuscarParticipante(usuarioLogado.cpf);
          if (!desmontado && response.data) {
            setDados({
              nivel: response.data.nivel || "",
              ano_ingresso: response.data.ano_ingresso || "",
              data_nascimento: response.data.data_nascimento || "",
              telefone: response.data.telefone || "",
            });
          }
        } catch (error) {
          if (error.response?.status === 404 && !usuarioLogado.cadastrado) {
          } else {
             mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao buscar dados do participante.", "erro");
          }
        }
      } else if (usuarioLogado?.cpf && !usuarioLogado?.cadastrado) {
         setDados({ nivel: "", ano_ingresso: "", data_nascimento: "", telefone: ""});
      }
    }
     if (usuarioLogado?.perfil === "participante") {
        buscarDadosParticipante();
    }
    return () => {
      desmontado = true;
    };
  }, [usuarioLogado?.cadastrado, usuarioLogado?.cpf, usuarioLogado?.perfil]);

  if (!usuarioLogado || usuarioLogado.perfil !== "participante") {
    return <div>Acesso negado ou usuário não é um participante.</div>;
  }

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referenciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />
      <Card
        title={tituloFormulario()}
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Nível*:
          </label>
          <Dropdown
            name="nivel"
            className={estilizarDropdown(erros.nivel, usuarioLogado.cor_tema)}
            value={dados.nivel}
            options={opcoesNivel}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.nivel} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Ano de Ingresso*:
          </label>
          <InputText
            name="ano_ingresso"
            type="number"
            value={dados.ano_ingresso}
            className={estilizarInputText(erros.ano_ingresso, "input200", usuarioLogado.cor_tema)}
            onChange={alterarEstado}
            placeholder="Ex: 2020"
            maxLength={4}
          />
          <MostrarMensagemErro mensagem={erros.ano_ingresso} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Data de Nascimento*:
          </label>
          <InputText
            name="data_nascimento"
            type="date"
            value={dados.data_nascimento}
            className={estilizarInputText(erros.data_nascimento, null, usuarioLogado.cor_tema)}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.data_nascimento} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Telefone*:
          </label>
          <InputMask
            name="telefone"
            autoClear
            size={TAMANHOS.TELEFONE}
            onChange={alterarEstado}
            className={estilizarInputMask(erros.telefone, usuarioLogado.cor_tema)}
            mask={TELEFONE_MASCARA}
            value={dados.telefone}
          />
          <MostrarMensagemErro mensagem={erros.telefone} />
        </div>
        <Divider className={estilizarDivider(usuarioLogado.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotaoRetornar()}
            label="Retornar"
            onClick={() => navegar("/pagina-inicial")}
          />
          <Button
            className={estilizarBotao()}
            label={labelBotaoSalvar()}
            onClick={acaoBotaoSalvar}
          />
        </div>
      </Card>
    </div>
  );
}