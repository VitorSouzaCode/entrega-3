import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Organizador from "./organizador";
import Inscricao from "./inscricao"; 

export enum Categoria {
  ESPORTS = "eSports", 
  PROGRAMACAO_JOGOS = "Programação de Jogos", 
  GAMIFICACAO = "Gamificação", 
}

// Enum 'Finalidade' (Sítio) renomeado para 'Etapa' (Competição) [cite: 5]
export enum Etapa {
  DESENVOLVIMENTO = "Desenvolvimento", 
  ANDAMENTO = "Andamento", 
  FINALIZADA = "Finalizada", 
}

@Entity("competicoes") 
export default class Competição extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string; 

  @Column({ type: "enum", enum: Categoria })
  categoria: Categoria; 
  @Column()
  area: string; 

  @Column({ type: "date" })
  data_inicio: Date; 

  @Column()
  descricao: string; 

  @Column()
  possui_premiacao: boolean; 

  @Column({ type: "enum", enum: Etapa })
  etapa: Etapa; 

  @ManyToOne(
    () => Organizador,
    (organizador) => organizador.competições, 
    {
      onDelete: "CASCADE",
    }
  )
  organizador: Organizador; 

  @OneToMany(() => Inscricao, (inscricao) => inscricao.competicao) 
  inscricoes: Inscricao[]; 
}