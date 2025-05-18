import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CitaDto } from './dto/cita.dto';
import { Paciente } from '../paciente/entities/paciente.entity';
import axios from 'axios';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  // 🔍 Clasificación usando modelo IA por API Python
  private async clasificarPrioridadIA(motivo: string): Promise<number> {
    try {
      const response = await axios.post('http://localhost:8000/clasificar', {
        motivo,
      });
      return response.data.prioridad;
    } catch (error) {
      console.error('Error al clasificar prioridad con IA:', error.message);
      return 1; // Prioridad baja por defecto si falla
    }
  }

  async create(citaDto: CitaDto): Promise<Cita> {
    const paciente = await this.pacienteRepository.findOneBy({
      expediente: citaDto.expediente,
    });

    if (!paciente) {
      throw new NotFoundException(
        `Paciente con expediente ${citaDto.expediente} no encontrado`,
      );
    }

    let fechaHora: Date;
    try {
      fechaHora = new Date(citaDto.fechaHora);
      if (isNaN(fechaHora.getTime())) {
        throw new Error();
      }
    } catch {
      throw new Error(
        'El formato de la fecha es incorrecto. Debe ser ISO 8601, ejemplo: "2025-05-13T10:00:00Z".',
      );
    }

    const prioridad = await this.clasificarPrioridadIA(citaDto.motivo);

    const nuevaCita = this.citaRepository.create({
      fechaHora,
      motivo: citaDto.motivo,
      observaciones: citaDto.observaciones,
      expediente: paciente,
      prioridad,
    });

    return this.citaRepository.save(nuevaCita);
  }

  async findAll(): Promise<Cita[]> {
    return this.citaRepository.find({ relations: ['expediente'] });
  }

  async findOne(idCita: string): Promise<Cita> {
    const cita = await this.citaRepository.findOne({
      where: { idCita },
      relations: ['expediente'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${idCita} no encontrada`);
    }
    return cita;
  }

  async update(idCita: string, citaDto: CitaDto): Promise<Cita> {
    const cita = await this.findOne(idCita);
    const paciente = await this.pacienteRepository.findOneBy({
      expediente: citaDto.expediente,
    });
    if (!paciente) {
      throw new NotFoundException(
        `Paciente con expediente ${citaDto.expediente} no encontrado`,
      );
    }

    const prioridad = await this.clasificarPrioridadIA(citaDto.motivo);

    await this.citaRepository.update(idCita, {
      fechaHora: citaDto.fechaHora,
      motivo: citaDto.motivo,
      observaciones: citaDto.observaciones,
      expediente: paciente,
      prioridad,
    });

    return this.findOne(idCita);
  }

  async delete(idCita: string): Promise<void> {
    await this.findOne(idCita);
    await this.citaRepository.delete(idCita);
  }

  async createByDate(fecha: string, expediente: number): Promise<Cita> {
    const paciente = await this.pacienteRepository.findOneBy({ expediente });
    if (!paciente) {
      throw new NotFoundException(
        `Paciente con expediente ${expediente} no encontrado`,
      );
    }

    let fechaHora: Date;
    try {
      fechaHora = new Date(fecha);
      if (isNaN(fechaHora.getTime())) {
        throw new Error();
      }
    } catch {
      throw new Error(
        'El formato de la fecha es incorrecto. Debe ser ISO 8601, ejemplo: "2025-05-13T10:00:00Z".',
      );
    }

    const nuevaCita = this.citaRepository.create({
      fechaHora,
      motivo: 'Cita automática',
      observaciones: '',
      expediente: paciente,
      prioridad: 1, // Por defecto
    });

    return this.citaRepository.save(nuevaCita);
  }
}
