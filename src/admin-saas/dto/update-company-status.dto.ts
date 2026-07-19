import { IsBoolean } from "class-validator";

export class UpdateCompanyStatusDto {
  @IsBoolean()
  estado: boolean;

  
}