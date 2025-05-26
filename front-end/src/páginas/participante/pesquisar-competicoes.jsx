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
import { servicoBuscarCompeticoesDisponiveis } from "../../serviços/servicos-participante";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  TAMANHOS,
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

export default function PesquisarCompeticoes() {
  const referenciaToast = useRef(null);
  const { usuarioLogado } = useContext(ContextoUsuario);
  const {
    setCompeticaoConsultadaParaInscricao,
    setCompeticaoSelecionadaParaInscricao,
  } = useContext(ContextoParticipante);
  const [listaCompeticoes, setListaCompeticoes] = useState([]);
  const navegar = useNavigate();

  const opcoesCategoria = [
    { label: "eSports", value: "eSports" },
    { label: "Programação de Jogos", value: "Programação de Jogos" },
    { label: "Gamificação", value: "Gamificação" },
  ];

  function retornarParaNovaInscricao(competicao) {
    setCompeticaoSelecionadaParaInscricao(competicao);
    navegar("/cadastrar-inscricao");
  }

  function AcaoTemplate(competicao) {
    return (
      <Button
        icon="pi pi-check"
        className={estilizarBotaoTabela(usuarioLogado.cor_tema)}
        tooltip="Selecionar"
        tooltipOptions={{ position: "top" }}
        onClick={() => retornarParaNovaInscricao(competicao)}
      />
    );
  }

  function DropdownCategoriaTemplate(opcoes) {
    function alterarFiltroDropdown(event) {
      return opcoes.filterCallback(event.value, opcoes.index);
    }
    return (
      <Dropdown
        value={opcoes.value}
        options={opcoesCategoria}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }

  function BooleanPossuiPremiacaoBodyTemplate(competicao) {
    return competicao.possui_premiacao ? "Sim" : "Não";
  }

  function BooleanPossuiPremiacaoFilterTemplate(opcoes) {
    function alterarFiltroTriState(event) {
      return opcoes.filterCallback(event.value);
    }
    return (
      <div>
        <label>Possui Premiação:</label>
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
    async function buscarCompeticoes() {
      try {
        const response = await servicoBuscarCompeticoesDisponiveis();
        if (!desmontado && response.data) {
          setListaCompeticoes(response.data);
        }
      } catch (error) {
        mostrarToast(referenciaToast, error.response?.data?.erro || "Erro ao buscar competições.", "error");
      }
    }
    buscarCompeticoes();
    return () => {
      desmontado = true;
    };
  }, []);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referenciaToast} position="bottom-center" />
      <Card
        title="Pesquisar Competições para Inscrição"
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma competição encontrada."
          value={listaCompeticoes}
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
            body={AcaoTemplate}
            header="Ação"
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
          />
          <Column
            field="organizador.usuario.nome"
            header="Nome do Organizador"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
          <Column
            field="nome"
            header="Nome da Competição"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
          <Column
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            field="categoria"
            header="Categoria"
            filter
            filterMatchMode="equals"
            filterElement={DropdownCategoriaTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            sortable
          />
          <Column
            field="area"
            header="Área"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
          <Column
            field="possui_premiacao"
            header="Possui Premiação"
            dataType="boolean"
            filter
            showFilterOperator={false}
            body={BooleanPossuiPremiacaoBodyTemplate}
            filterElement={BooleanPossuiPremiacaoFilterTemplate}
            filterMatchMode="equals"
            showClearButton={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
          />
          <Column
            field="data_inicio"
            header="Data de Início"
            sortable
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
          />
          <Column
            field="etapa"
            header="Etapa"
            sortable
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
          />
        </DataTable>
        <Divider className={estilizarDivider(usuarioLogado.cor_tema)} />
        <Button
          className={estilizarBotaoRetornar()}
          label="Retornar"
          onClick={() => navegar("/cadastrar-inscricao")}
        />
      </Card>
    </div>
  );
}