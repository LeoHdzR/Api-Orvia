import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CitaDto } from './dto/cita.dto';
import { Paciente } from '../paciente/entities/paciente.entity';

@Injectable()
export class CitaService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  // Prioridad: 3 = Alta, 2 = Media, 1 = Baja
  private clasificarPrioridad(motivo: string): number {
    const texto = motivo.toLowerCase();
    if (texto.includes('urgente') || texto.includes('dolor') || texto.includes('fractura') || texto.includes('sangrado')) {
      return 3;
    } else if (texto.includes('revisión') || texto.includes('control') || texto.includes('seguimiento')) {
      return 2;
    } else {
      return 1;
    }
  }

  async create(citaDto: CitaDto): Promise<Cita> {
    const paciente = await this.pacienteRepository.findOneBy({ expediente: citaDto.expediente });
    if (!paciente) {
      throw new NotFoundException(`Paciente con expediente ${citaDto.expediente} no encontrado`);
    }

    let fechaHora: Date;
    try {
      fechaHora = new Date(citaDto.fechaHora);
      if (isNaN(fechaHora.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      throw new Error('El formato de la fecha es incorrecto. Debe ser una fecha válida en formato ISO 8601, por ejemplo: "2025-05-13T10:00:00Z".');
    }

    const prioridad = this.clasificarPrioridad(citaDto.motivo);

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
    const cita = await this.citaRepository.findOne({ where: { idCita }, relations: ['expediente'] });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${idCita} no encontrada`);
    }
    return cita;
  }

  async update(idCita: string, citaDto: CitaDto): Promise<Cita> {
    const cita = await this.findOne(idCita);
    const paciente = await this.pacienteRepository.findOneBy({ expediente: citaDto.expediente });
    if (!paciente) {
      throw new NotFoundException(`Paciente con expediente ${citaDto.expediente} no encontrado`);
    }

    const prioridad = this.clasificarPrioridad(citaDto.motivo);

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
      throw new NotFoundException(`Paciente con expediente ${expediente} no encontrado`);
    }

    let fechaHora: Date;
    try {
      fechaHora = new Date(fecha);
      if (isNaN(fechaHora.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      throw new Error('El formato de la fecha es incorrecto. Debe ser una fecha válida en formato ISO 8601, por ejemplo: "2025-05-13T10:00:00Z".');
    }

    const nuevaCita = this.citaRepository.create({
      fechaHora,
      motivo: 'Cita automática',
      observaciones: '',
      expediente: paciente,
      prioridad: 1, // Prioridad baja por defecto
    });

    return this.citaRepository.save(nuevaCita);
  }
}
