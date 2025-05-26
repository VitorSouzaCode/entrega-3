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
import Inscricao from "./inscricao"; 

export enum Nivel {
  AMADOR = "amador",
  PROFISSIONAL = "profissional", 
}


@Entity("participantes") 
export default class Participante extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Nivel })
  nivel: Nivel; 


  @Column()
  ano_ingresso: number; 

  @Column({ type: "date" })
  data_nascimento: Date; //

  @Column()
  telefone: string; 

  @OneToMany(() => Inscricao, (inscricao) => inscricao.participante)
  inscricoes: Inscricao[]; 

  @OneToOne(() => Usuario, (usuario) => usuario.participante, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cpf_usuario" }) 
  usuario: Usuario; 
}