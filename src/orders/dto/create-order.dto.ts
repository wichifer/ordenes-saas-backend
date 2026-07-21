//C:\dev\ordenes-saas-backend\src\orders\dto\create-order.dto.ts
import {
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class OrderItemDto {

  @IsNotEmpty()
  @IsNumberString()
  id_articulo: string;

  @IsNotEmpty()
  descripcion_articulo: string;

  @IsNotEmpty()
  cantidad: number;

  @IsNotEmpty()
  precio_unitario: number;

}

export class CreateOrderDto {

  @IsNotEmpty()
  @IsNumberString()
  id_cliente: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  aprobar_automaticamente?: boolean;
}