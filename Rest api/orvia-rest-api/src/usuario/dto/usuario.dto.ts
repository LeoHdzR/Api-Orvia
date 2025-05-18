import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UsuarioDto {
  @ApiProperty()
  @IsString()
  readonly idUsuario: string;

  @ApiProperty()
  @IsString()
  readonly nombre: string;

  @ApiProperty()
  @IsString()
  readonly apellido: string;

  @ApiProperty()
  @IsEmail()
  readonly correo: string;

  @ApiProperty()
  @IsString()
  readonly contrasena: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly telefono?: string;
}