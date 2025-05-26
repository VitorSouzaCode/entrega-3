import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Usuario from "./usuario";
import Competição from "./competição"; 

export enum AreaAtuacao {
  ESPORTS = "eSports", 
  PROGRAMACAO_JOGOS = "Programação de Jogos", 
}

@Entity("organizadores") 
export default class Organizador extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: AreaAtuacao })
  area_atuacao: AreaAtuacao; 

  @Column()
  anos_experiencia: number; 


  @OneToMany(
    () => Competição, 
    (competicao) => competicao.organizador 
  )
  competições: Competição[]; 

  @OneToOne(() => Usuario, (usuario) => usuario.organizador, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cpf_usuario" }) 
  usuario: Usuario; 
}