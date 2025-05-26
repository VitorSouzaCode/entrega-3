import bcrypt from "bcrypt";
import dotenv from "dotenv";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuario, { Perfil, Status } from "../entidades/usuario"; 
import Organizador from "../entidades/organizador";
import Participante from "../entidades/participante";
import { getManager } from "typeorm";

dotenv.config();
const SALT = 10;
const SENHA_JWT = process.env.SENHA_JWT;

export default class ServicosUsuario {
  constructor() {}

  static async verificarCpfExistente(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (usuario)
        return response.status(404).json({ erro: "CPF já cadastrado." });
      else return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro no BD: verificarCpfExistente" }); 
    }
  }

  static async verificarCadastroCompleto(usuario: Usuario) {
    switch (usuario.perfil) { 
      case Perfil.ORGANIZADOR: 
        const organizador = await Organizador.findOne({
          where: { usuario: usuario.cpf },
          relations: ["usuario"],
        });
        if (!organizador) return false;
        return true;
      case Perfil.PARTICIPANTE: 
        const participante = await Participante.findOne({
          where: { usuario: usuario.cpf },
          relations: ["usuario"],
        });
        if (!participante) return false;
        return true;
      default:
        return false;
    }
  }

  static async logarUsuario(request, response) {
    try {
      const { nome_login, senha } = request.body;
      const cpf_encriptado = md5(nome_login);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (!usuario)
        return response
          .status(404)
          .json({ erro: "Nome de usuário não cadastrado." });

      const cadastro_completo = await ServicosUsuario.verificarCadastroCompleto(
        usuario
      );
      if (!cadastro_completo) {
       
        await Usuario.remove(usuario);
        return response.status(400).json({
          erro: "Cadastro incompleto. Por favor, realize o cadastro novamente.",
        });
      }
      const senha_correta = await bcrypt.compare(senha, usuario.senha);
      if (!senha_correta)
        return response.status(401).json({ erro: "Senha incorreta." });

      const token = sign(
        { perfil: usuario.perfil, email: usuario.email }, 
        SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1d" }
      );
      return response.json({
        usuarioLogado: {
          nome: usuario.nome,
          perfil: usuario.perfil, 
          email: usuario.email,
          questão: usuario.questão, 
          status: usuario.status,
          cor_tema: usuario.cor_tema,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro no BD: logarUsuario" });
    }
  }

  static async cadastrarUsuario(usuarioInfo) { 
    try {
    
      const { cpf, nome, perfil, email, senha, questão, resposta, cor_tema } =
        usuarioInfo;
      const cpf_encriptado = md5(cpf);
      const senha_encriptada = await bcrypt.hash(senha, SALT);
      const resposta_encriptada = await bcrypt.hash(resposta, SALT);
      const novoUsuario = Usuario.create({ 
        cpf: cpf_encriptado,
        nome,
        perfil,
        email,
        senha: senha_encriptada,
        questão,
        resposta: resposta_encriptada,
        cor_tema,
      });
      const token = sign(
        { perfil: novoUsuario.perfil, email: novoUsuario.email },
        SENHA_JWT,
        { subject: novoUsuario.nome, expiresIn: "1d" }
      );
      return { usuario: novoUsuario, senhaOriginal: senha, token }; 
    } catch (error) {
      console.error("Erro em cadastrarUsuario:", error);
      throw new Error("Erro no BD ao cadastrar usuário.");
    }
  }

  static async alterarUsuario(request, response) {
    try {
      const { cpf, senha, questão, resposta, cor_tema, email } = request.body;
      const cpf_encriptado = md5(cpf); 
      let tokenGerado: string; 

      const usuarioParaAlterar = await Usuario.findOne(cpf_encriptado); 
      if (!usuarioParaAlterar) {
        return response.status(404).json({ erro: "Usuário não encontrado." });
      }

      if (email) {
        usuarioParaAlterar.email = email;
        tokenGerado = sign({ perfil: usuarioParaAlterar.perfil, email }, SENHA_JWT, {
          subject: usuarioParaAlterar.nome,
          expiresIn: "1d",
        });
      }
      if (cor_tema) usuarioParaAlterar.cor_tema = cor_tema;
      if (senha) {
        const senha_encriptada = await bcrypt.hash(senha, SALT);
        usuarioParaAlterar.senha = senha_encriptada;
      }
      if (resposta) { 
        const resposta_encriptada = await bcrypt.hash(resposta, SALT);
        usuarioParaAlterar.questão = questão; 
        usuarioParaAlterar.resposta = resposta_encriptada; 
      }
      await Usuario.save(usuarioParaAlterar);

      const usuarioInfoRetorno = { 
        nome: usuarioParaAlterar.nome,
        perfil: usuarioParaAlterar.perfil, 
        email: usuarioParaAlterar.email,
        questão: usuarioParaAlterar.questão, 
        status: usuarioParaAlterar.status,
        cor_tema: usuarioParaAlterar.cor_tema,
        token: tokenGerado || request.headers.authorization?.split(' ')[1], // Mantém token existente se não for gerado novo
      };
      return response.json(usuarioInfoRetorno);
    } catch (error) {
      console.error("Erro em alterarUsuario:", error);
      return response.status(500).json({ erro: "Erro no BD: alterarUsuario" });
    }
  }

  static async removerUsuario(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        const usuario = await transactionManager.findOne(
          Usuario,
          cpf_encriptado
        );
        if (!usuario) {
          return response.status(404).json({ erro: "Usuário não encontrado para remoção." });
        }
        await transactionManager.remove(usuario);
      });
      
      return response.json({ mensagem: "Usuário removido com sucesso." }); // Adicionar mensagem de sucesso
    } catch (error) {
      console.error("Erro em removerUsuario:", error);
      return response.status(500).json({ erro: "Erro no BD: removerUsuario" });
    }
  }

  static async buscarQuestaoSeguranca(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (usuario) return response.json({ questão: usuario.questão }); // 'questão' mantido
      else return response.status(404).json({ mensagem: "CPF não cadastrado." });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro no BD: buscarQuestaoSeguranca" }); 
    }
  }

  static async verificarRespostaCorreta(request, response) {
    try {
      const { cpf, resposta } = request.body; 
      const cpf_encriptado = md5(cpf);
      const usuario = await Usuario.findOne(cpf_encriptado);
      if (!usuario) { 
        return response.status(404).json({ mensagem: "Usuário não encontrado." });
      }
      const resposta_correta = await bcrypt.compare(resposta, usuario.resposta); // 'resposta' mantido
      if (!resposta_correta)
        return response.status(401).json({ mensagem: "Resposta incorreta." });

      const token = sign(
        { perfil: usuario.perfil, email: usuario.email }, 
        process.env.SENHA_JWT,
        { subject: usuario.nome, expiresIn: "1h" }
      );
      return response.json({ token });
    } catch (error) {
      console.error("Erro em verificarRespostaCorreta:", error); 
      return response
        .status(500)
        .json({ erro: "Erro no BD: verificarRespostaCorreta" });
    }
  }
}