import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateStockMovementDto {

  @IsNotEmpty()
  @IsNumberString()
  id_articulo: string;

  @IsNotEmpty()
  @IsIn(['ENTRADA', 'SALIDA'])
  tipo_movimiento: string;

  @Type(() => Number)
  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsString()
  referencia?: string;

}