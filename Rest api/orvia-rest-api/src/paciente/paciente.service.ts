import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { PacienteDto } from './dto/paciente.dto';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(pacienteDto: PacienteDto): Promise<Paciente> {
    const nuevoPaciente = this.pacienteRepository.create(pacienteDto);
    return this.pacienteRepository.save(nuevoPaciente);
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find();
  }

  async findOne(expediente: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOneBy({ expediente });
    if (!paciente) {
      throw new NotFoundException(`Paciente con expediente ${expediente} no encontrado`);
    }
    return paciente;
  }

  async update(expediente: number, pacienteDto: PacienteDto): Promise<Paciente> {
    const paciente = await this.findOne(expediente); // Verifica si el paciente existe
    await this.pacienteRepository.update({ expediente }, pacienteDto);
    return this.findOne(expediente); // Devuelve el paciente actualizado
  }

  async delete(expediente: number): Promise<void> {
    const paciente = await this.findOne(expediente); // Verifica si el paciente existe
    await this.pacienteRepository.delete({ expediente });
  }
}
