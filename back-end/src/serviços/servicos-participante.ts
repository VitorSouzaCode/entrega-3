import md5 from "md5";
import { getManager } from "typeorm";
import Usuario, { Perfil, Status } from "../entidades/usuario"; // Usar Perfil para verificar
import Participante, { Nivel } from "../entidades/participante"; // Importar Nivel
import ServicosUsuario from "./servicos-usuario";
import Competição from "../entidades/competição"; // Classe Competição com acento
import Inscricao from "../entidades/inscricao"; // Classe Inscricao com acento

export default class ServicosParticipante {
  constructor() {}

  static async cadastrarParticipante(request, response) {
    try {
      const {
        usuario_info,
        nivel, // Anteriormente especialização
        ano_ingresso, // Anteriormente empresa_atuação
        data_nascimento,
        telefone,
      } = request.body;

      // usuario_info.perfil deve ser Perfil.PARTICIPANTE
      if (usuario_info.perfil !== Perfil.PARTICIPANTE) {
        return response.status(400).json({ erro: "Perfil de usuário inválido para cadastro de participante." });
      }

      const { usuario, token } = await ServicosUsuario.cadastrarUsuario(
        usuario_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuario);
        const participante = Participante.create({
          usuario,
          nivel,
          ano_ingresso,
          data_nascimento,
          telefone,
        });
        await transactionManager.save(participante);
        await transactionManager.update(Usuario, usuario.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      console.error("Erro em cadastrarParticipante:", error);
      return response.status(500).json({ erro: error.message || "Erro no BD ao cadastrar participante." });
    }
  }

  static async atualizarParticipante(request, response) {
    try {
      const {
        cpf,
        nivel,
        ano_ingresso,
        data_nascimento,
        telefone,
      } = request.body;
      const cpf_encriptado = md5(cpf);
      const participanteExistente = await Participante.findOne({ where: { usuario: { cpf: cpf_encriptado } } });
      if (!participanteExistente) {
        return response.status(404).json({ erro: "Participante não encontrado para atualização." });
      }
      await Participante.update(
        { usuario: { cpf: cpf_encriptado } },
        {
          nivel,
          ano_ingresso,
          data_nascimento,
          telefone,
        }
      );
      return response.json({ mensagem: "Participante atualizado com sucesso." });
    } catch (error) {
      console.error("Erro em atualizarParticipante:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: atualizarParticipante" });
    }
  }

  static async buscarParticipante(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const participante = await Participante.findOne({
        where: { usuario: { cpf: cpf_encriptado } },
        relations: ["usuario"],
      });
      if (!participante)
        return response
          .status(404)
          .json({ erro: "Participante não encontrado." });
      return response.json({
        nome: participante.usuario.nome,
        email: participante.usuario.email,
        // Dados específicos do participante
        nivel: participante.nivel,
        ano_ingresso: participante.ano_ingresso,
        data_nascimento: participante.data_nascimento,
        telefone: participante.telefone,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro no BD: buscarParticipante" });
    }
  }

  static async cadastrarInscricao(request, response) { // Método com acento
    try {
      const {
        id_competicao, // Anteriormente id_sitioarqueologico
        precisa_financiamento, // Anteriormente necessidade_especial
        motivacao, // Anteriormente justificativa
        data_inscricao, // Novo atributo
        cpf, // CPF do participante
      } = request.body;
      const cpf_encriptado = md5(cpf);
      const participante = await Participante.findOne({
        where: { usuario: { cpf: cpf_encriptado } },
      });
      if (!participante) {
        return response.status(404).json({ erro: "Participante não encontrado para realizar inscrição." });
      }
      const competicao = await Competição.findOne(id_competicao); // Entidade Competição com acento
      if (!competicao) {
        return response.status(404).json({ erro: "Competição não encontrada para inscrição." });
      }
      const inscricoesExistentes = await Inscricao.find({ // Entidade Inscricao com acento
        where: { participante, competicao },
      });
      if (inscricoesExistentes.length > 0)
        return response.status(400).json({
          erro: "O participante já realizou inscrição para esta competição.",
        });
      const novaInscricao = Inscricao.create({ // Entidade Inscricao com acento
        precisa_financiamento,
        motivacao,
        data_inscricao,
        participante,
        competicao,
      });
      await novaInscricao.save();
      return response.status(201).json({ mensagem: "Inscrição realizada com sucesso." });
    } catch (error) {
      console.error("Erro em cadastrarInscricao:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: cadastrarInscricao" });
    }
  }

  static async removerInscricao(request, response) { // Método com acento
    try {
      const id = request.params.id;
      const inscricao = await Inscricao.findOne(id); // Entidade Inscricao com acento
      if(!inscricao) {
        return response.status(404).json({ erro: "Inscrição não encontrada para remoção." });
      }
      await Inscricao.delete(id);
      return response.json({ mensagem: "Inscrição removida com sucesso." });
    } catch (error) {
      console.error("Erro em removerInscricao:", error);
      return response.status(500).json({ erro: "Erro no BD: removerInscricao" });
    }
  }

  static async buscarInscricoesDoParticipante(request, response) { // Método com acento
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const inscricoes = await Inscricao.find({ // Entidade Inscricao com acento
        where: { participante: { usuario: { cpf: cpf_encriptado } } },
        relations: [
          "participante",
          "participante.usuario",
          "competicao",
          "competicao.organizador",
          "competicao.organizador.usuario",
        ],
      });
      return response.json(inscricoes);
    } catch (error) {
      console.error("Erro em buscarInscricoesDoParticipante:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: buscarInscricoesDoParticipante" });
    }
  }

  static async buscarCompeticoesDisponiveis(request, response) { // Método com acento
    try {
      // Aqui você pode querer adicionar filtros, por exemplo, competições que ainda não finalizaram
      const competicoes = await Competição.find({ // Entidade Competição com acento
        relations: ["organizador", "organizador.usuario"], // Relações adaptadas
        // where: { etapa: Not(Etapa.FINALIZADA) } // Exemplo de filtro, se necessário
      });
      return response.json(competicoes);
    } catch (error) {
      console.error("Erro em buscarCompeticoesDisponiveis:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: buscarCompeticoesDisponiveis" });
    }
  }
}