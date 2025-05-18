// src/data/data-source.ts
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Paciente } from '../paciente/entities/paciente.entity';
import { Cita } from '../cita/entities/cita.entity';

export const DatabaseModule: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'orvia-database.cwf6uce4uvtp.us-east-1.rds.amazonaws.com',
  port: 3306,
  username: 'admin',
  password: 'admin123',
  database: 'orvia_db',
  entities: [Usuario, Paciente, Cita],
  synchronize: true, // solo para desarrollo
};
