import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { Paciente } from './entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])], // Registra la entidad Paciente
  controllers: [PacienteController],
  providers: [PacienteService],
  exports: [PacienteService, TypeOrmModule], // Exporta TypeOrmModule si es necesario en otros módulos
})
export class PacienteModule {}
