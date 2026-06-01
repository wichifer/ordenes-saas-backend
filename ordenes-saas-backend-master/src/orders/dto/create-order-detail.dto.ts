import {
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class CreateOrderDetailDto {

  @IsNotEmpty()
  @IsNumberString()
  id_articulo: string;

  @IsNotEmpty()
  @IsNumberString()
  cantidad: string;

  @IsNotEmpty()
  @IsNumberString()
  precio_unitario: string;

}