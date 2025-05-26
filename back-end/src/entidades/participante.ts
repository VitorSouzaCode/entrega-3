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
import Inscricao from "./inscricao"; // Nome da classe com acento (singular para entidade, plural para coleção)

// Enum 'Especialização' (Gerente) renomeado para 'Nivel' (Participante) [cite: 5]
export enum Nivel {
  AMADOR = "amador", // [cite: 5]
  PROFISSIONAL = "profissional", // [cite: 5]
}

// Enum 'Avaliação_clientes' removido, pois não existe para Participante na especificação de Vitor [cite: 4]

@Entity("participantes") // Nome da tabela explícito
export default class Participante extends BaseEntity { // Classe 'Participante'
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Nivel })
  nivel: Nivel; // Atributo 'especialização' renomeado [cite: 5]

  // 'avaliação_clientes' removido

  @Column()
  ano_ingresso: number; // Atributo 'empresa_atuação' renomeado [cite: 4]

  @Column({ type: "date" })
  data_nascimento: Date; // [cite: 4]

  @Column()
  telefone: string; // [cite: 4]

  @OneToMany(() => Inscricao, (inscricao) => inscricao.participante)
  inscricoes: Inscricao[]; // Atributo 'visitacoes' renomeado para 'inscricoes' [cite: 4]

  @OneToOne(() => Usuario, (usuario) => usuario.participante, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cpf_usuario" }) // Nome explícito da coluna da FK (opcional)
  usuario: Usuario; // Relação com 'Usuario', atributo 'participante' em Usuario
}