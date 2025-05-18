import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Controller('/api/v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() usuarioDto: UsuarioDto): Promise<Usuario> {
    return this.usuarioService.create(usuarioDto);
  }

  @Get()
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':idUsuario')
  async findOne(@Param('idUsuario') idUsuario: string): Promise<Usuario> {
    return this.usuarioService.findOne(idUsuario);
  }

  @Put(':idUsuario')
  async update(@Param('idUsuario') idUsuario: string, @Body() usuarioDto: UsuarioDto): Promise<Usuario> {
    return this.usuarioService.update(idUsuario, usuarioDto);
  }

  @Delete(':idUsuario')
  async delete(@Param('idUsuario') idUsuario: string): Promise<{ message: string }> {
    await this.usuarioService.delete(idUsuario);
    return { message: 'Usuario eliminado' };
  }
}
