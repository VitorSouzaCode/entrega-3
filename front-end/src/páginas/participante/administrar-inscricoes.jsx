import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoParticipante from "../../contextos/contexto-participante";
import mostrarToast from "../../utilitários/mostrar-toast";
import { servicoBuscarInscricoesDoParticipante } from "../../serviços/servicos-participante";
import {
  TAMANHOS,
  estilizarBotao,
  estilizarBotaoRetornar,
  estilizarBotaoTabela,
  estilizarCard,
  estilizarColumnHeader,
  estilizarColunaConsultar,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFilterMenu,
  estilizarFlex,
  estilizarTriStateCheckbox,
} from "../../utilitários/estilos";

export default function AdministrarInscricoes() {
  const referenciaToast = useRef(null);
  const { usuarioLogado } = useContext(ContextoUsuario);
  const {
    inscricaoConsultada,
    setInscricaoConsultada,
    setCompeticaoSelecionadaParaInscricao,
  } = useContext(ContextoParticipante);
  const [listaInscricoes, setListaInscricoes] = useState([]);
  const navegar = useNavigate();

  const opcoesCategoriaCompeticao = [
    { label: "eSports", value: "eSports" },
    { label: "Programação de Jogos", value: "Programação de Jogos" },
    { label: "Gamificação", value: "Gamificação" },
  ];

  function retornarPaginaInicial() {
    navegar("/pagina-inicial");
  }

  function adicionarInscricao() {
    setInscricaoConsultada(null);
    setCompeticaoSelecionadaParaInscricao(null);
    navegar("/cadastrar-inscricao");
  }

  function ConsultarTemplate(inscricao) {
    function consultar() {
      setInscricaoConsultada(inscricao);
      setCompeticaoSelecionadaParaInscricao(null);
      navegar("/cadastrar-inscricao");
    }
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotaoTabela(
          usuarioLogado.cor_tema,
          inscricaoConsultada?.id === inscricao.id
        )}
        tooltip="Consultar Inscrição"
        tooltipOptions={{ position: "top" }}
        onClick={consultar}
      />
    );
  }

  function DropdownCategoriaCompeticaoTemplate(opcoes) {
    function alterarFiltroDropdown(event) {
      return opcoes.filterCallback(event.value, opcoes.index);
    }
    return (
      <Dropdown
        value={opcoes.value}
        options={opcoesCategoriaCompeticao}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }

  function BooleanPrecisaFinanciamentoBodyTemplate(inscricao) {
    return inscricao.precisa_financiamento ? "Sim" : "Não";
  }

  function BooleanPrecisaFinanciamentoFilterTemplate(opcoes) {
    function alterarFiltroTriState(event) {
      return opcoes.filterCallback(event.value);
    }
    return (
      <div>
        <label>Precisa Financiamento:</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuarioLogado?.cor_tema)}
          value={opcoes.value}
          onChange={alterarFiltroTriState}
        />
      </div>
    );
  }

  useEffect(() => {
    let desmontado = false;
    async function buscarInscricoesDoParticipante() {
      try {
        const response = await servicoBuscarInscricoesDoParticipante(
          usuarioLogado.cpf
        );
        if (!desmontado && response.data) setListaInscricoes(response.data);
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao buscar inscrições.", "error");
      }
    }
    if (usuarioLogado?.cpf) {
        buscarInscricoesDoParticipante();
    }
    return () => {
      desmontado = true;
    };
  }, [usuarioLogado?.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referenciaToast} position="bottom-center" />
      <Card
        title="Administrar Minhas Inscrições"
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma inscrição encontrada."
          value={listaInscricoes}
          responsiveLayout="scroll"
          breakpoint="490px"
          removableSort
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(
            usuarioLogado.cor_tema
          )}
        >
          <Column
            bodyClassName={estilizarColunaConsultar()}
            body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
          />
          <Column
            field="competicao.organizador.usuario.nome"
            header="Organizador"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
           <Column
            field="competicao.nome"
            header="Competição"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
          <Column
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            field="competicao.categoria"
            header="Categoria da Competição"
            filter
            filterMatchMode="equals"
            filterElement={DropdownCategoriaCompeticaoTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            sortable
          />
          <Column
            field="data_inscricao"
            header="Data da Inscrição"
            sortable
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
          />
          <Column
            field="precisa_financiamento"
            header="Precisa Financiamento"
            dataType="boolean"
            filter
            showFilterOperator={false}
            body={BooleanPrecisaFinanciamentoBodyTemplate}
            filterElement={BooleanPrecisaFinanciamentoFilterTemplate}
            filterMatchMode="equals"
            showClearButton={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
        </DataTable>
        <Divider className={estilizarDivider(usuarioLogado.cor_tema)} />
        <Button
          className={estilizarBotaoRetornar()}
          label="Retornar"
          onClick={retornarPaginaInicial}
        />
        <Button
          className={estilizarBotao()}
          label="Adcionar"
          onClick={adicionarInscricao}
        />
      </Card>
    </div>
  );
}