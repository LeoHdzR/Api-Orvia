import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CitaDto } from './dto/cita.dto';
import { Cita } from './entities/cita.entity';

@Controller('/api/v1/cita')
export class CitaController {
  constructor(private readonly citaService: CitaService) {}

  @Post()
  async create(@Body() citaDto: CitaDto): Promise<Cita> {
    return this.citaService.create(citaDto);
  }

  @Post('date')
  async createByDate(
    @Body('fecha') fecha: string,
    @Body('expediente') expediente: number,
  ): Promise<Cita> {
    return this.citaService.createByDate(fecha, expediente);
  }

  @Get()
  async findAll(): Promise<Cita[]> {
    return this.citaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cita> {
    return this.citaService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() citaDto: CitaDto): Promise<Cita> {
    return this.citaService.update(id, citaDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.citaService.delete(id);
    return { message: 'Cita eliminada' };
  }
}
