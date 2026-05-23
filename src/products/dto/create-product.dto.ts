import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {

  @IsString()
  codigo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio_final: number;

  @IsOptional()
  @IsNumber()
  stock_actual?: number;

  @IsOptional()
  @IsNumber()
  stock_minimo?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

}