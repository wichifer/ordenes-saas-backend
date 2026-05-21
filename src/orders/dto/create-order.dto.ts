import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto }
from './create-order-item.dto';

export class CreateOrderDto {

  @IsNumber()
  id_cliente: number;

  @IsString()
  numero_orden: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })

  @Type(() => CreateOrderItemDto)

  items: CreateOrderItemDto[];

}