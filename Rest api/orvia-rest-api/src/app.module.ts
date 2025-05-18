// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PacienteModule } from './paciente/paciente.module';
import { CitaModule } from './cita/cita.module';
import { UsuarioModule } from './usuario/usuario.module';

import { Usuario } from './usuario/entities/usuario.entity';
import { Paciente } from './paciente/entities/paciente.entity';
import { Cita } from './cita/entities/cita.entity';

@Module({
  imports: [
    // Carga variables de entorno desde .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configura TypeORM usando ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'admin'),
        password: configService.get('DB_PASSWORD', 'admin123'),
        database: configService.get('DB_NAME', 'orvia_db'),
        entities: [Usuario, Paciente, Cita],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      }),
      inject: [ConfigService],
    }),

    // Módulos propios
    PacienteModule,
    CitaModule,
    UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
