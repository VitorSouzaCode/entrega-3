import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import ContextoOrganizador from "../../contextos/contexto-organizador";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoBuscarCompeticoesDoOrganizador } from "../../serviços/servicos-organizador";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  TAMANHOS,
  estilizarBotao,
  estilizarBotaoRetornar,
  estilizarBotaoTabela,
  estilizarCard,
  estilizarColunaConsultar,
  estilizarColumnHeader,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFilterMenu,
  estilizarFlex,
  estilizarTriStateCheckbox,
} from "../../utilitários/estilos";

export default function AdministrarCompeticoes() {
  const referenciaToast = useRef(null);
  const { usuarioLogado } = useContext(ContextoUsuario);
  const { competicaoConsultada, setCompeticaoConsultada } =
    useContext(ContextoOrganizador);
  const [listaCompeticoes, setListaCompeticoes] = useState([]);
  const navegar = useNavigate();

  const opcoesCategoria = [
    { label: "eSports", value: "eSports" },
    { label: "Programação de Jogos", value: "Programação de Jogos" },
    { label: "Gamificação", value: "Gamificação" },
  ];

  function retornarPaginaInicial() {
    navegar("/pagina-inicial");
  }

  function adicionarCompeticao() {
    setCompeticaoConsultada(null);
    navegar("/cadastrar-competicao");
  }

  function ConsultarTemplate(competicao) {
    function consultar() {
      setCompeticaoConsultada(competicao);
      navegar("/cadastrar-competicao");
    }
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotaoTabela(
          usuarioLogado.cor_tema,
          competicaoConsultada?.id === competicao.id
        )}
        tooltip="Consultar Competição"
        tooltipOptions={{ position: "top" }}
        onClick={consultar}
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
    async function buscarCompeticoesDoOrganizador() {
      try {
        const response = await servicoBuscarCompeticoesDoOrganizador(
          usuarioLogado.cpf
        );
        if (!desmontado && response.data) {
          setListaCompeticoes(response.data);
        }
      } catch (error) {
        const erro = error.response?.data?.erro;
        if (erro) mostrarToast(referenciaToast, erro, "erro");
      }
    }
    if (usuarioLogado?.cpf) {
        buscarCompeticoesDoOrganizador();
    }
    return () => {
      desmontado = true;
    };
  }, [usuarioLogado?.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referenciaToast} position="bottom-center" />
      <Card
        title="Administrar Competições"
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
            body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
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
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
            sortable
            filterMatchMode="equals"
            filterElement={BooleanPossuiPremiacaoFilterTemplate}
            body={BooleanPossuiPremiacaoBodyTemplate}
            showClearButton={false}
            dataType="boolean"
          />
           <Column
            field="etapa"
            header="Etapa"
            filter
            showFilterOperator={false}
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
          label="Adicionar"
          onClick={adicionarCompeticao}
        />
      </Card>
    </div>
  );
}