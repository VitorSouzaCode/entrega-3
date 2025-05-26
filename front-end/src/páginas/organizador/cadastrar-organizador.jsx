import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import {
  servicoCadastrarOrganizador,
  servicoBuscarOrganizador,
  servicoAtualizarOrganizador,
} from "../../serviços/servicos-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotao,
  estilizarBotaoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarOrganizador() {
  const referenciaToast = useRef(null);
  const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuario);
  const [dados, setDados] = useState({
    area_atuacao: "",
    anos_experiencia: null,
  });
  const [erros, setErros] = useState({});
  const [cpfJaCadastradoComoOrganizador, setCpfJaCadastradoComoOrganizador] = useState(false);
  const navegar = useNavigate();

  const opcoesAreaAtuacao = [
    { label: "eSports", value: "eSports" },
    { label: "Programação de Jogos", value: "Programação de Jogos" },
  ];

  function alterarEstado(event) {
    const { name, value } = event.target;
    setDados((prevDados) => ({ ...prevDados, [name]: value }));
  }

  function validarCampos() {
    let errosCamposObrigatoriosValidacao;
    errosCamposObrigatoriosValidacao = validarCamposObrigatórios({
      area_atuacao: dados.area_atuacao,
      anos_experiencia: dados.anos_experiencia,
    });
    setErros(errosCamposObrigatoriosValidacao);
    return checarListaVazia(errosCamposObrigatoriosValidacao);
  }

  function tituloFormulario() {
    return usuarioLogado?.cadastrado ? "Alterar Dados de Organizador" : "Completar Cadastro de Organizador";
  }

  async function cadastrarOrganizador() {
    if (validarCampos()) {
      try {
        const response = await servicoCadastrarOrganizador({
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
          "Dados de organizador cadastrados com sucesso!",
          "sucesso"
        );
      } catch (error) {
        setCpfJaCadastradoComoOrganizador(true);
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao cadastrar organizador.", "erro");
      }
    }
  }

  async function atualizarOrganizador() {
    if (validarCampos()) {
      try {
        await servicoAtualizarOrganizador({
          ...dados,
          cpf: usuarioLogado.cpf,
        });
        mostrarToast(
          referenciaToast,
          "Dados de organizador atualizados com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao atualizar dados.", "erro");
      }
    }
  }

  function labelBotaoSalvar() {
    return usuarioLogado?.cadastrado ? "Alterar" : "Cadastrar";
  }

  function acaoBotaoSalvar() {
    if (usuarioLogado?.cadastrado) {
      atualizarOrganizador();
    } else {
      cadastrarOrganizador();
    }
  }

  function redirecionar() {
    if (cpfJaCadastradoComoOrganizador && !usuarioLogado?.cadastrado) {
      setUsuarioLogado(null);
      navegar("/criar-usuario");
    } else {
      navegar("/pagina-inicial");
    }
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarDadosOrganizador() {
      if (usuarioLogado?.cpf && usuarioLogado?.cadastrado) {
        try {
          const response = await servicoBuscarOrganizador(usuarioLogado.cpf);
          if (!desmontado && response.data) {
            setDados({
              area_atuacao: response.data.area_atuacao || "",
              anos_experiencia: response.data.anos_experiencia === null ? null : Number(response.data.anos_experiencia),
            });
          }
        } catch (error) {
           if (error.response?.status === 404 && !usuarioLogado.cadastrado) {
           } else {
             mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao buscar dados.", "erro");
           }
        }
      } else if (usuarioLogado?.cpf && !usuarioLogado?.cadastrado) {
        setDados({ area_atuacao: "", anos_experiencia: null });
      }
    }
    if (usuarioLogado?.perfil === "organizador") {
        buscarDadosOrganizador();
    }
    return () => {
      desmontado = true;
    };
  }, [usuarioLogado?.cadastrado, usuarioLogado?.cpf, usuarioLogado?.perfil]);

  if (!usuarioLogado || usuarioLogado.perfil !== "organizador") {
    return <div>Acesso negado ou usuário não é um organizador.</div>;
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
            Área de Atuação*:
          </label>
          <Dropdown
            name="area_atuacao"
            className={estilizarDropdown(
              erros.area_atuacao,
              usuarioLogado.cor_tema
            )}
            value={dados.area_atuacao}
            options={opcoesAreaAtuacao}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.area_atuacao} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Anos de Experiência*:
          </label>
          <InputNumber
            name="anos_experiencia"
            size={5}
            value={dados.anos_experiencia}
            onValueChange={alterarEstado}
            mode="decimal"
            min={0}
            inputClassName={estilizarInputNumber(
              erros.anos_experiencia,
              usuarioLogado.cor_tema
            )}
          />
          <MostrarMensagemErro mensagem={erros.anos_experiencia} />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
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