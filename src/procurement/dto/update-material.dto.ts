import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMaterialDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  materialName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitCostGHS?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;
}
