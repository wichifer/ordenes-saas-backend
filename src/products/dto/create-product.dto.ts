import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  precio_final: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock_actual: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock_minimo: number;

}