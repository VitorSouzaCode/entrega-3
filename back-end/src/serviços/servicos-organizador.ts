import md5 from "md5";
import { getManager } from "typeorm";
import Usuario, { Perfil,Status } from "../entidades/usuario";
import Organizador, { AreaAtuacao } from "../entidades/organizador"; 
import ServicosUsuario from "./servicos-usuario";
import Competição from "../entidades/competição"; 

export default class ServicosOrganizador {
  constructor() {}

  static async cadastrarOrganizador(request, response) {
    try {
      const {
        usuario_info,
        area_atuacao, 
        anos_experiencia, 
      } = request.body;

      if (!Object.values(AreaAtuacao).includes(usuario_info.area_atuacao as AreaAtuacao) && usuario_info.area_atuacao) {
        
      }


      if (usuario_info.perfil !== Perfil.ORGANIZADOR) {
        return response.status(400).json({ erro: "Perfil de usuário inválido para cadastro de organizador." });
      }

      const { usuario, token } = await ServicosUsuario.cadastrarUsuario(
        usuario_info
      );
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuario);
        const organizador = Organizador.create({
          usuario,
          area_atuacao,
          anos_experiencia,
        });
        await transactionManager.save(organizador);
        await transactionManager.update(Usuario, usuario.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      console.error("Erro em cadastrarOrganizador:", error);
      return response.status(500).json({ erro: error.message || "Erro no BD ao cadastrar organizador." });
    }
  }

  static async buscarOrganizador(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const organizador = await Organizador.findOne({
        where: { usuario: { cpf: cpf_encriptado } }, 
        relations: ["usuario"],
      });
      if (!organizador)
        return response
          .status(404)
          .json({ erro: "Organizador não encontrado." });
      return response.json({
        nome: organizador.usuario.nome,
        email: organizador.usuario.email,
        area_atuacao: organizador.area_atuacao,
        anos_experiencia: organizador.anos_experiencia,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro no BD: buscarOrganizador" });
    }
  }

  static async atualizarOrganizador(request, response) {
    try {
      const { cpf, area_atuacao, anos_experiencia } = request.body;
      const cpf_encriptado = md5(cpf);
      const organizadorExistente = await Organizador.findOne({ where: { usuario: { cpf: cpf_encriptado } } });
      if (!organizadorExistente) {
        return response.status(404).json({ erro: "Organizador não encontrado para atualização." });
      }
      await Organizador.update(
        { usuario: { cpf: cpf_encriptado } },
        { area_atuacao, anos_experiencia } 
      );
      return response.json({ mensagem: "Organizador atualizado com sucesso." }); 
    } catch (error) {
      console.error("Erro em atualizarOrganizador:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: atualizarOrganizador" });
    }
  }

  static async cadastrarCompetição(request, response) { 
    try {
      const {
        nome, 
        categoria,
        area, 
        data_inicio,
        descricao,
        possui_premiacao,
        etapa, 
        cpf, 
      } = request.body;
      const cpf_encriptado = md5(cpf);
      const organizador = await Organizador.findOne({
        where: { usuario: { cpf: cpf_encriptado } }, 
        relations: ["usuario"], 
      });

      if (!organizador) {
        return response.status(404).json({ erro: "Organizador não encontrado para associar à competição." });
      }

      await Competição.create({
        nome,
        categoria,
        area,
        data_inicio,
        descricao,
        possui_premiacao,
        etapa,
        organizador, 
      }).save();
      return response.status(201).json({ mensagem: "Competição cadastrada com sucesso." }); // Status 201 para criação
    } catch (error) {
      console.error("Erro em cadastrarCompetição:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: cadastrarCompetição" });
    }
  }

  static async alterarCompetição(request, response) { 
    try {
      const {
        id, 
        nome,
        categoria,
        area,
        data_inicio,
        descricao,
        possui_premiacao,
        etapa,
      } = request.body;
      const competicaoExistente = await Competição.findOne(id);
      if (!competicaoExistente) {
        return response.status(404).json({ erro: "Competição não encontrada para alteração." });
      }
      await Competição.update(id, { 
        nome,
        categoria,
        area,
        data_inicio,
        descricao,
        possui_premiacao,
        etapa,
      });
      return response.json({ mensagem: "Competição alterada com sucesso." });
    } catch (error) {
      console.error("Erro em alterarCompetição:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: alterarCompetição" });
    }
  }

  static async removerCompetição(request, response) { 
    try {
      const id_competicao = request.params.id;
      const competicao = await Competição.findOne(id_competicao); 
      if (!competicao) {
        return response.status(404).json({ erro: "Competição não encontrada para remoção." });
      }
      await Competição.remove(competicao);
      return response.json({ mensagem: "Competição removida com sucesso." });
    } catch (error) {
      console.error("Erro em removerCompetição:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: removerCompetição" });
    }
  }

  static async buscarCompetiçõesDoOrganizador(request, response) { 
    try {
      const cpf_encriptado = md5(request.params.cpf);

      const competicoes = await Competição.find({ 
        where: { organizador: { usuario: { cpf: cpf_encriptado } } },
        relations: ["organizador", "organizador.usuario"],
      });

      return response.json(competicoes);
    } catch (error) {
      console.error("Erro em buscarCompetiçõesDoOrganizador:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: buscarCompetiçõesDoOrganizador" });
    }
  }

  static filtrarAreaEliminandoRepeticao(competicoes: Competição[]) {
    let areas: { label: string; value: string }[];
    areas = competicoes
      .filter(
        (competicao, indice, competicoes_antes_filtrar) =>
        competicoes_antes_filtrar.findIndex(
            (competicao_anterior) =>
            competicao_anterior.area === competicao.area
          ) === indice && competicao.area 
      )
      .map((competicao) => ({
        label: competicao.area,
        value: competicao.area,
      }));
    return areas;
  }

  static async buscarAreasDasCompetições(request, response) { 
    try {
      const competicoes = await Competição.find(); 
      const areas =
        ServicosOrganizador.filtrarAreaEliminandoRepeticao(competicoes);
      return response.json(areas.sort((a, b) => a.label.localeCompare(b.label)));
    } catch (error) {
      console.error("Erro em buscarAreasDasCompetições:", error);
      return response
        .status(500)
        .json({ erro: "Erro no BD: buscarAreasDasCompetições" });
    }
  }
}