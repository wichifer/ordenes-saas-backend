// src/admin-saas/dto/create-company.dto.ts

import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  razon_social: string;

  @IsString()
  cuit: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  usuario_email: string;

  @MinLength(6)
  password: string;
}