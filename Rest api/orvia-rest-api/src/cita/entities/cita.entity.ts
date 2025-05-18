import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Paciente } from '../../paciente/entities/paciente.entity';

@Entity()
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  idCita: string;

  @Column({ type: 'timestamp', nullable: false })
  fechaHora: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  motivo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observaciones?: string;

  @ManyToOne(() => Paciente, (paciente) => paciente.expediente, { nullable: false, onDelete: 'CASCADE' })
  expediente: Paciente;

  @Column({ type: 'int', nullable: true })
  prioridad: number;
}