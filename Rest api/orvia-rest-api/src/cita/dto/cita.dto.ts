import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDate} from "class-validator";
import { Type } from "class-transformer";

export class CitaDto {
  @IsOptional()
  @IsString()
  readonly idCita: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly fechaHora: Date;

  @IsNotEmpty()
  @IsString()
  readonly motivo: string;

  @IsOptional()
  @IsString()
  readonly observaciones?: string;

  @IsOptional()
  @IsString()
  readonly recomendaciones?: string;

  @IsOptional()
  @IsString()
  readonly comentarios?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expediente: number; // Cambiado a number para coincidir con la entidad Paciente
}