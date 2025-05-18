import { IsNotEmpty, IsString, IsNumber, IsEmail, IsOptional, Min, Max } from 'class-validator';

export class PacienteDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'El expediente debe ser un número' })
  @Min(100000, { message: 'El expediente debe tener exactamente 6 dígitos' })
  @Max(999999, { message: 'El expediente debe tener exactamente 6 dígitos' })
  readonly expediente: number;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  readonly nombre: string;

  @IsOptional()
  @IsNumber({}, { message: 'El teléfono debe ser un número' })
  @Min(1000000000)
  @Max(9999999999)
  readonly telefono: number;

  @IsOptional()
  @IsEmail({}, { message: 'El correo debe ser un correo electrónico válido' })
  readonly correo: string;

  @IsOptional()
  @IsNumber({}, { message: 'El teléfono de emergencia debe ser un número' })
  @Min(1000000000)
  @Max(9999999999)
  readonly telefonoEmergencia: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del historial debe ser un número' })
  readonly idHistorial: number;
}
