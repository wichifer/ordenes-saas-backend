import {
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateOrderItemDto {

  @IsNumber()
  id_articulo: number;

  @IsString()
  descripcion_articulo: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;

}