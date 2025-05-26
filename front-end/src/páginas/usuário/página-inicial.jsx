import { useContext } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import ContextoUsuario from "../../contextos/contexto-usuario";
import imagemCompeticoes from "../../imagens/Competições envolvendo jogos.jpg"; // Manter ou alterar imagem
import {
  estilizarCard,
  estilizarCardHeaderCentralizado,
  estilizarPaginaUnica,
} from "../../utilitários/estilos";

export default function PaginaInicial() {
  const { usuarioLogado } = useContext(ContextoUsuario);

  function HeaderCentralizado() {
    return (
      <div className={estilizarCardHeaderCentralizado()}>
        Plataforma de Gestão de Competições de Jogos
      </div>
    );
  }

  return (
    <div className={estilizarPaginaUnica()}>
      <Card
        header={HeaderCentralizado}
        className={estilizarCard(usuarioLogado.cor_tema)}
      >
        <Image src={imagemCompeticoes} alt="Gestão de Competições de Jogos" width={1100} /> {/* Alt text adaptado */}
      </Card>
    </div>
  );
}