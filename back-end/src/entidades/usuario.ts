import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import Organizador from "./organizador"; 
import Participante from "./participante"; 
export enum Perfil {
  ORGANIZADOR = "organizador", 
  PARTICIPANTE = "participante", 
}

export enum Status {
  PENDENTE = "pendente",
  ATIVO = "ativo",
}

export enum Cores {
  AMARELO = "yellow",
  ANIL = "indigo",
  AZUL = "blue",
  AZUL_PISCINA = "cyan",
  CINZA_ESCURO = "bluegray",
  LARANJA = "orange",
  ROSA = "pink",
  ROXO = "purple",
  VERDE = "green",
  VERDE_AZULADO = "teal",
}

@Entity("usuarios") 
export default class Usuario extends BaseEntity { 
  @PrimaryColumn()
  cpf: string;

  @Column({ type: "enum", enum: Perfil })
  perfil: Perfil;

  @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  questão: string; 

  @Column()
  resposta: string; 

  @Column({ type: "enum", enum: Cores })
  cor_tema: string;

  @OneToOne(() => Organizador, (organizador) => organizador.usuario) 
  organizador: Organizador;
  
  @OneToOne(() => Participante, (participante) => participante.usuario) 
  participante: Participante;

  @CreateDateColumn()
  data_criacao: Date; 
  
}