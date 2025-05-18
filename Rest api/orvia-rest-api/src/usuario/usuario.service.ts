import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(usuarioDto: UsuarioDto): Promise<Usuario> {
    const nuevoUsuario = this.usuarioRepository.create(usuarioDto);
    return this.usuarioRepository.save(nuevoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(idUsuario: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ idUsuario });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);
    }
    return usuario;
  }

  async update(idUsuario: string, usuarioDto: UsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(idUsuario); // Verifica si el usuario existe
    await this.usuarioRepository.update(idUsuario, usuarioDto);
    return this.findOne(idUsuario); // Devuelve el usuario actualizado
  }

  async delete(idUsuario: string): Promise<void> {
    const usuario = await this.findOne(idUsuario); // Verifica si el usuario existe
    await this.usuarioRepository.delete(idUsuario);
  }
}
