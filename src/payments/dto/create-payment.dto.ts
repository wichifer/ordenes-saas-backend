import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {

  @IsNotEmpty()
  @IsNumberString()
  id_orden_compra: string;


  @IsNotEmpty()
  @IsNumberString()
  monto: string;

  @IsNotEmpty()
  @IsString()
  metodo_pago?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

}