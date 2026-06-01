import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  precio_final?: number;

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