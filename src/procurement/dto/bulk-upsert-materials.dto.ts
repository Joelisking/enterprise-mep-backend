import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMaterialDto } from './create-material.dto';

export class BulkUpsertMaterialsDto {
  @ApiProperty({ type: [CreateMaterialDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialDto)
  materials: CreateMaterialDto[];
}
