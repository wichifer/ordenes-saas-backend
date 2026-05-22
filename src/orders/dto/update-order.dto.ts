import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrderDto {

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

}