import { Module } from '@nestjs/common';
import { CitaController } from './cita.controller';
import { CitaService } from './cita.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { PacienteModule } from 'src/paciente/paciente.module';


@Module({
    imports: [TypeOrmModule.forFeature([Cita]), PacienteModule],
    controllers: [CitaController],
    providers: [CitaService, TypeOrmModule],
})
export class CitaModule {}

