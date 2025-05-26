import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
 
} from "typeorm";
import Competição from "./competição"; 
import Participante from "./participante";

@Entity("inscricoes") 
export default class Inscricao extends BaseEntity { 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  precisa_financiamento: boolean;

  @Column()
  motivacao: string; 

  @Column({ type: "date" })
  data_inscricao: Date; 

  @ManyToOne(
    () => Competição, 
    (competicao) => competicao.inscricoes, 
    {
      onDelete: "CASCADE",
    }
  )
  competicao: Competição; 

  @ManyToOne(() => Participante, (participante) => participante.inscricoes, {
    onDelete: "CASCADE",
  })
  participante: Participante; 
}