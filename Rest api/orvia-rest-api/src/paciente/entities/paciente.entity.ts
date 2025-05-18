import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Paciente {
  @PrimaryColumn({ type: 'int', unsigned: true })
  expediente: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'bigint', nullable: true })
  telefono: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo: string;

  @Column({ type: 'bigint', nullable: true })
  telefonoEmergencia: number;

  @Column({ type: 'int', nullable: true })
  idHistorial: number;
}
