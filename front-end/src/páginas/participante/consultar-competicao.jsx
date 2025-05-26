import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoParticipante from "../../contextos/contexto-participante";
import {
  estilizarBotaoRetornar,
  estilizarBotao, // adicione aqui
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

export default function ConsultarCompeticao() {
  const { usuarioLogado } = useContext(ContextoUsuario);
  const { competicaoConsultadaParaInscricao, setCompeticaoSelecionadaParaInscricao } = useContext(ContextoParticipante);
  const navegar = useNavigate();
  const location = useLocation();

  const competicaoParaExibir = location.state?.competicao || competicaoConsultadaParaInscricao;

  useEffect(() => {
    if (!competicaoParaExibir || !competicaoParaExibir.id) {
    }
  }, [competicaoParaExibir, navegar]);

  const dados = {
    nome_organizador: competicaoParaExibir?.organizador?.usuario?.nome || "N/A",
    nome_competicao: competicaoParaExibir?.nome || "N/A",
    categoria: competicaoParaExibir?.categoria || "N/A",
    area: competicaoParaExibir?.area || "N/A",
    data_inicio: competicaoParaExibir?.data_inicio || "N/A",
    descricao: competicaoParaExibir?.descricao || "N/A",
    possui_premiacao: competicaoParaExibir?.possui_premiacao || false,
    etapa: competicaoParaExibir?.etapa || "N/A",
  };

  function retornarParaPesquisa() {
    navegar("/pesquisar-competicoes");
  }

  function selecionarParaInscricao() {
    setCompeticaoSelecionadaParaInscricao(competicaoParaExibir);
    navegar("/cadastrar-inscricao");
  }
  
  if (!competicaoParaExibir || !competicaoParaExibir.id) {
    return (
        <div className={estilizarFlex()}>
            <Card title="Competição não encontrada" className={estilizarCard(usuarioLogado.cor_tema)}>
                <p>Nenhuma competição foi selecionada para consulta.</p>
                <Button
                    label="Voltar para Pesquisa"
                    icon="pi pi-arrow-left"
                    onClick={retornarParaPesquisa}
                    className={estilizarBotaoRetornar()}
                />
            </Card>
        </div>
    );
  }

  return (
    <div className={estilizarFlex()}>
      <Card
        title={`Detalhes da Competição: ${dados.nome_competicao}`}
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Organizador:
          </label>
          <InputText
            name="nome_organizador"
            className={estilizarInputText(null, "input400", usuarioLogado.cor_tema)}
            value={dados.nome_organizador}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Categoria:
          </label>
          <InputText
            name="categoria"
            className={estilizarInputText(null, "input200", usuarioLogado.cor_tema)}
            value={dados.categoria}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Área:
          </label>
          <InputText
            name="area"
            className={estilizarInputText(null, "input200", usuarioLogado.cor_tema)}
            value={dados.area}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Data de Início:
          </label>
          <InputText
            name="data_inicio"
            type="date"
            value={dados.data_inicio ? new Date(dados.data_inicio).toISOString().split('T')[0] : ""}
            className={estilizarInputText(null, null, usuarioLogado.cor_tema)}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Descrição:
          </label>
          <InputTextarea
            name="descricao"
            value={dados.descricao}
            className={estilizarInputTextarea(null, usuarioLogado.cor_tema)}
            autoResize
            rows={3}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Possui Premiação:
          </label>
          <Checkbox
            name="possui_premiacao"
            checked={dados.possui_premiacao}
            className={estilizarCheckbox(null)}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuarioLogado.cor_tema)}>
            Etapa Atual:
          </label>
          <InputText
            name="etapa"
            className={estilizarInputText(null, "input200", usuarioLogado.cor_tema)}
            value={dados.etapa}
            disabled
          />
        </div>
        <Divider className={estilizarDivider(usuarioLogado.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotaoRetornar()}
            label="Voltar para Pesquisa"
            onClick={retornarParaPesquisa}
          />
           <Button
            className={estilizarBotao(usuarioLogado.cor_tema)}
            label="Inscrever-se nesta Competição"
            icon="pi pi-check"
            onClick={selecionarParaInscricao}
          />
        </div>
      </Card>
    </div>
  );
}