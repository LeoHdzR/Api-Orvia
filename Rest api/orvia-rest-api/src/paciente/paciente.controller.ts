import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './dto/paciente.dto';
import { Paciente } from './entities/paciente.entity';

@Controller('/api/v1/paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  async create(@Body() pacienteDto: PacienteDto): Promise<Paciente> {
    return this.pacienteService.create(pacienteDto);
  }

  @Get()
  async findAll(): Promise<Paciente[]> {
    return this.pacienteService.findAll();
  }

  @Get(':expediente')
  async findOne(@Param('expediente') expediente: number): Promise<Paciente> {
    return this.pacienteService.findOne(expediente);
  }

  @Put(':expediente')
  async update(@Param('expediente') expediente: number, @Body() pacienteDto: PacienteDto): Promise<Paciente> {
    return this.pacienteService.update(expediente, pacienteDto);
  }

  @Delete(':expediente')
  async delete(@Param('expediente') expediente: number): Promise<{ message: string }> {
    await this.pacienteService.delete(expediente);
    return { message: 'Paciente eliminado' };
  }
}
