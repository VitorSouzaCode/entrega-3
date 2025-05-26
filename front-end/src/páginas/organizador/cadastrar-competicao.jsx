import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoOrganizador from "../../contextos/contexto-organizador";
import {
  servicoAlterarCompeticao,
  servicoCadastrarCompeticao,
  servicoRemoverCompeticao,
  servicoBuscarAreasDasCompeticoes,
} from "../../serviços/servicos-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotao,
  estilizarBotaoRemover,
  estilizarBotaoRetornar,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarInputTextarea,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarCompeticao() {
  const referenciaToast = useRef(null);
  const { usuarioLogado } = useContext(ContextoUsuario);
  const { competicaoConsultada, setCompeticaoConsultada } = useContext(ContextoOrganizador);
  const navegar = useNavigate();

  const [dados, setDados] = useState({
    nome: competicaoConsultada?.nome || "",
    categoria: competicaoConsultada?.categoria || "",
    area: competicaoConsultada?.area || "",
    data_inicio: competicaoConsultada?.data_inicio || "",
    descricao: competicaoConsultada?.descricao || "",
    possui_premiacao: competicaoConsultada?.possui_premiacao || false,
    etapa: competicaoConsultada?.etapa || "",
  });

  const [listaAreas, setListaAreas] = useState([]);
  const [erros, setErros] = useState({});

  const opcoesCategoria = [
    { label: "eSports", value: "eSports" },
    { label: "Programação de Jogos", value: "Programação de Jogos" },
    { label: "Gamificação", value: "Gamificação" },
  ];

  const opcoesEtapa = [
    { label: "Desenvolvimento", value: "Desenvolvimento" },
    { label: "Andamento", value: "Andamento" },
    { label: "Finalizada", value: "Finalizada" },
  ];

  function alterarEstado(event) {
    const { name, value, type, checked } = event.target;
    setDados((prevDados) => ({
      ...prevDados,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validarCampos() {
    const { nome, categoria, area, data_inicio, descricao, etapa } = dados;
    let errosCamposObrigatoriosValidacao = validarCamposObrigatórios({
      nome,
      categoria,
      area,
      data_inicio,
      descricao,
      etapa,
    });
    setErros(errosCamposObrigatoriosValidacao);
    return checarListaVazia(errosCamposObrigatoriosValidacao);
  }

  function retornarAdministrarCompeticoes() {
    setCompeticaoConsultada(null);
    navegar("/administrar-competicoes");
  }

  async function cadastrarCompeticao() {
    if (validarCampos()) {
      try {
        await servicoCadastrarCompeticao({
          ...dados,
          cpf: usuarioLogado.cpf,
        });
        mostrarToast(
          referenciaToast,
          "Competição cadastrada com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao cadastrar competição.", "erro");
      }
    }
  }

  async function alterarCompeticao() {
    if (validarCampos()) {
      try {
        await servicoAlterarCompeticao({
          ...dados,
          id: competicaoConsultada.id,
        });
        mostrarToast(
          referenciaToast,
          "Competição alterada com sucesso!",
          "sucesso"
        );
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao alterar competição.", "erro");
      }
    }
  }

  async function removerCompeticao() {
    try {
      await servicoRemoverCompeticao(competicaoConsultada.id);
      mostrarToast(
        referenciaToast,
        "Competição excluída com sucesso!",
        "sucesso"
      );
    } catch (error) {
      mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao excluir competição.", "erro");
    }
  }

  useEffect(() => {
    async function buscarAreas() {
      try {
        const response = await servicoBuscarAreasDasCompeticoes();
        if (response.data) setListaAreas(response.data);
      } catch (error) {
        const erro = error.response?.data?.erro;
        if (erro) mostrarToast(referenciaToast, erro, "error");
      }
    }
    buscarAreas();
  }, []);

  useEffect(() => {
    if (competicaoConsultada) {
      setDados({
        nome: competicaoConsultada.nome || "",
        categoria: competicaoConsultada.categoria || "",
        area: competicaoConsultada.area || "",
        data_inicio: competicaoConsultada.data_inicio || "",
        descricao: competicaoConsultada.descricao || "",
        possui_premiacao: competicaoConsultada.possui_premiacao || false,
        etapa: competicaoConsultada.etapa || "",
      });
    } else {
      setDados({
        nome: "", categoria: "", area: "", data_inicio: "",
        descricao: "", possui_premiacao: false, etapa: "",
      });
    }
  }, [competicaoConsultada]);

  function BotoesAcoes() {
    if (competicaoConsultada && competicaoConsultada.id) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotaoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarCompeticoes}
          />
          <Button
            className={estilizarBotaoRemover()}
            label="Remover"
            onClick={removerCompeticao}
          />
          <Button
            className={estilizarBotao()}
            label="Alterar"
            onClick={alterarCompeticao}
          />
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotaoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarCompeticoes}
          />
          <Button
            className={estilizarBotao()}
            label="Cadastrar"
            onClick={cadastrarCompeticao}
          />
        </div>
      );
    }
  }

  function tituloFormulario() {
    return (competicaoConsultada && competicaoConsultada.id) ? "Alterar" : "Cadastrar";
  }

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referenciaToast}
        onHide={retornarAdministrarCompeticoes}
        position="bottom-center"
      />
      <Card
        title={tituloFormulario()}
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Nome da Competição*:
          </label>
          <InputText
            name="nome"
            className={estilizarInputText(erros.nome, "input400", usuarioLogado.cor_tema)}
            value={dados.nome}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.nome} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Categoria*:
          </label>
          <Dropdown
            name="categoria"
            className={estilizarDropdown(erros.categoria, usuarioLogado.cor_tema)}
            value={dados.categoria}
            options={opcoesCategoria}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.categoria} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Áreas Cadastradas (sugestão):
          </label>
          <Dropdown
            name="area_sugestao"
            placeholder="-- Selecione uma área existente --"
            showClear
            className={estilizarDropdown(null, usuarioLogado.cor_tema)}
            filter
            options={listaAreas}
            onChange={(e) => setDados({...dados, area: e.value})}
            emptyMessage={"Nenhuma área cadastrada."}
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Área*:
          </label>
          <InputText
            name="area"
            className={estilizarInputText(erros.area, "input200", usuarioLogado.cor_tema)}
            value={dados.area}
            onChange={alterarEstado}
            placeholder="Ou digite uma nova área"
          />
          <MostrarMensagemErro mensagem={erros.area} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Data de Início*:
          </label>
          <InputText
            name="data_inicio"
            type="date"
            value={dados.data_inicio}
            className={estilizarInputText(erros.data_inicio, null, usuarioLogado.cor_tema)}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.data_inicio} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Descrição*:
          </label>
          <InputTextarea
            name="descricao"
            value={dados.descricao}
            className={estilizarInputTextarea(erros.descricao, usuarioLogado.cor_tema)}
            onChange={alterarEstado}
            autoResize
            rows={3}
            cols={40}
          />
          <MostrarMensagemErro mensagem={erros.descricao} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Possui Premiação*:
          </label>
          <Checkbox
            name="possui_premiacao"
            checked={dados.possui_premiacao}
            className={estilizarCheckbox(erros.possui_premiacao)}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.possui_premiacao} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Etapa*:
          </label>
          <Dropdown
            name="etapa"
            className={estilizarDropdown(erros.etapa, usuarioLogado.cor_tema)}
            value={dados.etapa}
            options={opcoesEtapa}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.etapa} />
        </div>
        <Divider className={estilizarDivider(usuarioLogado.cor_tema)} />
        <BotoesAcoes />
      </Card>
    </div>
  );
}